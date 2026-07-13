import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

// ─── Admin API helpers ────────────────────────────────────────────────────────

function getAdminToken(req: Request): string | null {
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(/(?:^|;\s*)jp_admin=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function redirect(location: string, extra?: HeadersInit): Response {
  return new Response(null, {
    status: 302,
    headers: { Location: location, ...extra },
  });
}

function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

async function handleAdminLogin(req: Request): Promise<Response> {
  const body = await req.formData();
  const email = (body.get("email") as string)?.trim();
  const password = body.get("password") as string;

  if (!email || !password) {
    return redirect("/painel?error=Preencha+e-mail+e+senha");
  }

  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return redirect("/painel?error=Credenciais+inv%C3%A1lidas");
  }

  const data = await res.json() as { access_token: string };
  const cookie = `jp_admin=${encodeURIComponent(data.access_token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`;
  return redirect("/painel", { "Set-Cookie": cookie });
}

async function handleAdminLogout(): Promise<Response> {
  return redirect("/painel", { "Set-Cookie": "jp_admin=; Path=/; HttpOnly; Max-Age=0" });
}

async function handleSessionCheck(req: Request): Promise<Response> {
  const token = getAdminToken(req);
  if (!token) return Response.json({ authed: false });

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    return Response.json({ authed: res.ok });
  } catch {
    return Response.json({ authed: false });
  }
}

async function handleAdminPosts(req: Request): Promise<Response> {
  const token = getAdminToken(req);
  if (!token) return Response.json({ authed: false, posts: [] });

  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) return Response.json({ authed: false, posts: [] });

  const postsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/posts?select=id,title,slug,excerpt,content,featured_image_url,status,published_at,created_at&order=created_at.desc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } },
  );
  const posts = postsRes.ok ? await postsRes.json() : [];
  return Response.json({ authed: true, posts });
}

async function handleAdminSavePost(req: Request): Promise<Response> {
  const token = getAdminToken(req);
  if (!token) return redirect("/painel");

  const body = await req.formData();
  const id = body.get("id") as string | null;
  const title = (body.get("title") as string)?.trim();
  const excerpt = (body.get("excerpt") as string)?.trim() || null;
  const content = (body.get("content") as string)?.trim() || null;
  const image = (body.get("image") as string)?.trim() || null;
  const status = (body.get("status") as string) || "draft";

  if (!title) {
    return redirect("/painel?view=new&error=T%C3%ADtulo+%C3%A9+obrigat%C3%B3rio");
  }

  const authHeader = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };

  if (id) {
    const updateBody: Record<string, unknown> = { title, excerpt, content, featured_image_url: image, status };
    if (status === "published") updateBody.published_at = new Date().toISOString();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
      method: "PATCH",
      headers: authHeader,
      body: JSON.stringify(updateBody),
    });
    if (!res.ok) {
      const err = await res.text();
      return redirect(`/painel?view=edit&id=${id}&error=${encodeURIComponent(err.slice(0, 80))}`);
    }
  } else {
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) return redirect("/painel");
    const user = await userRes.json() as { id: string };

    const suffix = Math.random().toString(36).slice(2, 7);
    const slug = `${slugify(title)}-${suffix}`;

    const insertBody: Record<string, unknown> = {
      title, excerpt, content, featured_image_url: image, status,
      slug, author_id: user.id,
      published_at: status === "published" ? new Date().toISOString() : null,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify(insertBody),
    });
    if (!res.ok) {
      const err = await res.text();
      return redirect(`/painel?view=new&error=${encodeURIComponent(err.slice(0, 80))}`);
    }
  }

  return redirect("/painel");
}

async function handleAdminDeletePost(req: Request): Promise<Response> {
  const token = getAdminToken(req);
  if (!token) return redirect("/painel");

  const body = await req.formData();
  const id = body.get("id") as string;

  if (id) {
    await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
    });
  }
  return redirect("/painel");
}

async function handleImageUpload(req: Request): Promise<Response> {
  const token = getAdminToken(req);
  if (!token) return Response.json({ error: "Não autorizado" }, { status: 401 });

  let formData: FormData;
  try { formData = await req.formData(); } catch {
    return Response.json({ error: "Form inválido" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file || !file.type.startsWith("image/")) {
    return Response.json({ error: "Arquivo inválido — envie uma imagem" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = await file.arrayBuffer();

  const up = await fetch(`${SUPABASE_URL}/storage/v1/object/blog-imagens/${filename}`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, "Content-Type": file.type },
    body: buffer,
  });

  if (!up.ok) {
    const err = await up.text();
    return Response.json({ error: `Storage: ${err.slice(0, 120)}` }, { status: 500 });
  }

  const url = `${SUPABASE_URL}/storage/v1/object/public/blog-imagens/${filename}`;
  return Response.json({ url });
}

// ─── Admin page HTML (no React/TanStack, pure vanilla) ───────────────────────

function handlePainelPage(): Response {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin · Dr. JP</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Helvetica Neue",Arial,sans-serif;background:#f5f3ef;color:#1a2744;min-height:100vh}
#root{min-height:100vh}
.lay{display:flex;min-height:100vh}
.side{width:220px;background:#1a2744;color:#fff;padding:1.5rem;flex-shrink:0;display:flex;flex-direction:column;gap:.25rem}
.logo{font-size:.9rem;font-weight:700;margin-bottom:1.5rem}
.ng{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);margin:.75rem 0 .35rem}
.nl{display:block;padding:.5rem .75rem;border-radius:.75rem;font-size:.875rem;font-weight:500;color:rgba(255,255,255,.7);text-decoration:none}
.nl:hover,.nl.on{color:#fff;background:rgba(255,255,255,.12)}
.nl.out{color:#f87171}
.sp{flex:1}
.mn{flex:1;padding:2.5rem;overflow-y:auto}
.hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.75rem}
h1{font-size:1.625rem;font-weight:600}
.btn{display:inline-block;border:none;border-radius:.875rem;padding:.6rem 1.2rem;font-size:.8rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;text-decoration:none}
.bp{background:#1a2744;color:#fff}
.bw{background:#7a1c2e;color:#fff}
.bb{background:#4a7ab5;color:#fff;border-radius:.75rem;padding:.45rem .9rem;font-size:.75rem;letter-spacing:0;text-transform:none}
.bg{background:transparent;border:1px solid #e5e1d8;color:#8a8070}
.bd{background:transparent;border:1px solid #fca5a5;color:#7a1c2e;border-radius:.75rem;padding:.45rem .9rem;font-size:.75rem;font-weight:700;cursor:pointer}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:1rem;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}
th{background:#f0ede8;padding:.75rem 1rem;text-align:left;font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#8a8070}
td{padding:.875rem 1rem;border-top:1px solid #e5e1d8;font-size:.875rem;vertical-align:middle}
.pub{display:inline-block;padding:.2rem .6rem;border-radius:999px;font-size:.7rem;font-weight:700;text-transform:uppercase;background:#d1fae5;color:#065f46}
.drf{display:inline-block;padding:.2rem .6rem;border-radius:999px;font-size:.7rem;font-weight:700;text-transform:uppercase;background:#f0ede8;color:#8a8070}
.card{background:#fff;border:1px solid #e5e1d8;border-radius:1.25rem;padding:2rem;max-width:860px}
.fld{margin-bottom:1.1rem}
label{display:block;font-size:.8125rem;font-weight:600;margin-bottom:.4rem}
input,textarea,select{width:100%;border:1px solid #e5e1d8;border-radius:.75rem;padding:.6rem .875rem;font-size:.9rem;font-family:inherit;background:#fff;outline:none}
textarea{line-height:1.7;resize:vertical}
.err{background:#fef2f2;border:1px solid #fca5a5;border-radius:.75rem;padding:.75rem 1rem;font-size:.8rem;color:#7a1c2e;margin-bottom:1rem}
.mt{color:#8a8070;font-size:.8rem}
.lwrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem}
.lcard{background:#fff;border:1px solid #e5e1d8;border-radius:1.5rem;padding:2.5rem;width:100%;max-width:400px;box-shadow:0 4px 24px rgba(0,0,0,.06)}
.lcard h1{font-size:1.5rem;font-weight:600;margin-bottom:.25rem}
.acts{display:flex;gap:.5rem;align-items:center}
</style>
</head>
<body>
<div id="root"><div style="display:flex;align-items:center;justify-content:center;min-height:100vh;color:#8a8070">Carregando...</div></div>
<script>
(function() {

function esc(s) {
  if (!s) return "";
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"});
}

var root = document.getElementById("root");

document.addEventListener("submit", function(e) {
  var f = e.target;
  if (f && f.classList && f.classList.contains("confirm-delete")) {
    var t = f.getAttribute("data-title") || "este item";
    if (!confirm('Excluir "' + t + '"?')) e.preventDefault();
  }
});

document.addEventListener("click", function(e) {
  if (!e.target || e.target.id !== "img-upload-btn") return;
  var fileInput = document.getElementById("img-file");
  var file = fileInput && fileInput.files && fileInput.files[0];
  var status = document.getElementById("img-status");
  if (!file) { if (status) status.textContent = "Escolha uma imagem primeiro."; return; }
  if (status) status.textContent = "Enviando...";
  var fd = new FormData();
  fd.append("file", file);
  fetch("/api/upload-image", { method: "POST", body: fd })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.error) { if (status) status.textContent = "Erro: " + data.error; return; }
      var ta = document.querySelector("textarea[name=content]");
      if (ta) {
        var start = ta.selectionStart || ta.value.length;
        var before = ta.value.substring(0, start);
        var after = ta.value.substring(ta.selectionEnd || start);
        var pre = (before === "" || before.endsWith("\n\n")) ? "" : "\n\n";
        var suf = (after === "" || after.startsWith("\n\n")) ? "" : "\n\n";
        ta.value = before + pre + data.url + suf + after;
        var pos = start + pre.length + data.url.length + suf.length;
        ta.selectionStart = ta.selectionEnd = pos;
        ta.focus();
      }
      if (status) status.textContent = "Imagem inserida no conteudo";
      if (fileInput) fileInput.value = "";
    })
    .catch(function() { if (status) status.textContent = "Erro ao enviar."; });
});

function params() { return new URLSearchParams(location.search); }

function sidebar(view) {
  function nl(href, label, v) {
    var cls = "nl" + (view === v ? " on" : "");
    return '<a class="' + cls + '" href="' + href + '">' + label + "</a>";
  }
  return '<aside class="side">' +
    '<div class="logo">CMS · Dr. JP</div>' +
    '<div class="ng">Conteúdo</div>' +
    nl("/painel", "Posts", "posts") +
    nl("/painel?view=new", "Novo post", "new") +
    '<div class="sp"></div>' +
    '<a class="nl" href="/" style="color:rgba(255,255,255,.5)">← Ver site</a>' +
    '<a class="nl out" href="/api/admin-logout">Sair</a>' +
    "</aside>";
}

function renderLogin(error) {
  var errHtml = error ? '<div class="err">' + esc(decodeURIComponent(error)) + "</div>" : "";
  root.innerHTML =
    '<div class="lwrap"><div class="lcard">' +
    "<h1>Admin · Dr. JP</h1>" +
    '<p class="mt" style="margin-bottom:1.75rem">Entre com sua conta para gerenciar o site.</p>' +
    errHtml +
    '<form method="POST" action="/api/admin-login">' +
    '<div class="fld"><label>E-mail</label><input type="email" name="email" placeholder="seu@email.com" autocomplete="email" required></div>' +
    '<div class="fld"><label>Senha</label><input type="password" name="password" placeholder="••••••••" autocomplete="current-password" required></div>' +
    '<button type="submit" class="btn bp" style="width:100%">Entrar</button>' +
    "</form></div></div>";
}

function renderPostsList(posts, error) {
  var errHtml = error ? '<div class="err">' + esc(decodeURIComponent(error)) + "</div>" : "";
  var rows;
  if (posts.length === 0) {
    rows = '<tr><td colspan="4" style="text-align:center;color:#8a8070;padding:2rem">Nenhum post ainda. <a href="/painel?view=new" style="color:#7a1c2e">Criar o primeiro →</a></td></tr>';
  } else {
    rows = posts.map(function(p) {
      return "<tr>" +
        "<td><strong>" + esc(p.title) + "</strong><br><span class='mt'>" + esc(p.slug) + "</span></td>" +
        "<td><span class='" + (p.status === "published" ? "pub" : "drf") + "'>" + (p.status === "published" ? "Publicado" : "Rascunho") + "</span></td>" +
        "<td class='mt' style='white-space:nowrap'>" + fmtDate(p.published_at || p.created_at) + "</td>" +
        "<td><div class='acts'>" +
          "<a class='btn bb' href='/painel?view=edit&id=" + esc(p.id) + "'>Editar</a>" +
          "<a class='btn bg' href='/blog/" + esc(p.slug) + "' target='_blank' style='font-size:.75rem'>Ver</a>" +
          "<form class='confirm-delete' data-title='" + esc(p.title) + "' method='POST' action='/api/admin-delete-post' style='display:inline'>" +
            "<input type='hidden' name='id' value='" + esc(p.id) + "'>" +
            "<button type='submit' class='bd'>Excluir</button>" +
          "</form>" +
        "</div></td>" +
        "</tr>";
    }).join("");
  }
  root.innerHTML =
    '<div class="lay">' + sidebar("posts") +
    '<main class="mn">' +
    '<div class="hdr"><h1>Posts</h1><a class="btn bw" href="/painel?view=new">+ Novo post</a></div>' +
    errHtml +
    "<table><thead><tr><th>Título</th><th>Status</th><th>Data</th><th></th></tr></thead>" +
    "<tbody>" + rows + "</tbody></table>" +
    "</main></div>";
}

function renderPostForm(post, error) {
  var isEdit = !!post;
  var errHtml = error ? '<div class="err">' + esc(decodeURIComponent(error)) + "</div>" : "";
  root.innerHTML =
    '<div class="lay">' + sidebar(isEdit ? "edit" : "new") +
    '<main class="mn">' +
    '<div class="hdr"><h1>' + (isEdit ? "Editar post" : "Novo post") + "</h1>" +
    '<a class="btn bg" href="/painel">← Voltar</a></div>' +
    errHtml +
    '<div class="card"><form method="POST" action="/api/admin-save-post">' +
    (isEdit ? "<input type='hidden' name='id' value='" + esc(post.id) + "'>" : "") +
    '<div class="fld"><label>Título</label><input type="text" name="title" value="' + esc(post ? post.title : "") + '" placeholder="Título do artigo" required></div>' +
    '<div class="fld"><label>Resumo (excerpt)</label><textarea name="excerpt" rows="2" placeholder="Frase de abertura">' + esc(post && post.excerpt ? post.excerpt : "") + "</textarea></div>" +
    '<div class="fld"><label>Conteúdo</label>' +
    '<p style="font-size:.75rem;color:#8a8070;margin-bottom:.4rem">Parágrafos separados por linha em branco. Para imagem no meio do texto, cole a URL sozinha em um parágrafo (ex: https://site.com/foto.jpg)</p>' +
    '<textarea name="content" rows="22" placeholder="Escreva o artigo aqui...">' + esc(post && post.content ? post.content : "") + "</textarea></div>" +
    '<div class="fld" style="background:#f8f6f2;border:1px solid #e5e1d8;border-radius:.75rem;padding:1rem">' +
    '<label style="margin-bottom:.5rem">Upload de imagem para o conteúdo</label>' +
    '<p style="font-size:.75rem;color:#8a8070;margin-bottom:.75rem">Escolha um arquivo — a URL será inserida no cursor do campo de conteúdo.</p>' +
    '<div style="display:flex;gap:.75rem;align-items:center;flex-wrap:wrap">' +
    '<input type="file" id="img-file" accept="image/*" style="font-size:.85rem;flex:1;min-width:0">' +
    '<button type="button" id="img-upload-btn" class="btn bb" style="white-space:nowrap">Enviar imagem</button>' +
    '</div>' +
    '<span id="img-status" style="display:block;margin-top:.5rem;font-size:.8rem;color:#8a8070"></span>' +
    '</div>' +
    '<div class="fld"><label>URL da imagem de capa</label><input type="url" name="image" value="' + esc(post && post.featured_image_url ? post.featured_image_url : "") + '" placeholder="https://..."></div>' +
    '<div class="fld"><label>Status</label><select name="status">' +
    '<option value="draft"' + (!post || post.status !== "published" ? " selected" : "") + ">Rascunho</option>" +
    '<option value="published"' + (post && post.status === "published" ? " selected" : "") + ">Publicado</option>" +
    "</select></div>" +
    '<div style="display:flex;gap:.75rem;margin-top:.5rem">' +
    '<button type="submit" class="btn bp">' + (isEdit ? "Salvar alterações" : "Criar post") + "</button>" +
    '<a class="btn bg" href="/painel">Cancelar</a>' +
    "</div></form></div>" +
    "</main></div>";
}

(async function() {
  var p = params();
  var view = p.get("view") || "posts";
  var id = p.get("id");
  var error = p.get("error");

  var session;
  try {
    session = await fetch("/api/session-check").then(function(r) { return r.json(); });
  } catch(e) {
    session = { authed: false };
  }

  if (!session.authed) {
    renderLogin(error);
    return;
  }

  var postsData;
  try {
    postsData = await fetch("/api/admin-posts").then(function(r) { return r.json(); });
  } catch(e) {
    postsData = { posts: [] };
  }
  var posts = postsData.posts || [];

  if (view === "new") {
    renderPostForm(null, error);
  } else if (view === "edit" && id) {
    var post = posts.find(function(x) { return x.id === id; });
    renderPostForm(post || null, error);
  } else {
    renderPostsList(posts, error);
  }
})();

})();
</script>
</body>
</html>`;
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

// ─── Router ──────────────────────────────────────────────────────────────────

async function routeAdminRequest(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  if ((path.toLowerCase() === "/painel" || path.toLowerCase() === "/painel/") && method === "GET") return handlePainelPage();
  if (path === "/api/admin-login" && method === "POST") return handleAdminLogin(req);
  if (path === "/api/admin-logout") return handleAdminLogout();
  if (path === "/api/session-check" && method === "GET") return handleSessionCheck(req);
  if (path === "/api/admin-posts" && method === "GET") return handleAdminPosts(req);
  if (path === "/api/admin-save-post" && method === "POST") return handleAdminSavePost(req);
  if (path === "/api/admin-delete-post" && method === "POST") return handleAdminDeletePost(req);
  if (path === "/api/upload-image" && method === "POST") return handleImageUpload(req);

  return null;
}

// ─── Entry ───────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      // Handle admin API routes before TanStack Start sees them
      const adminResponse = await routeAdminRequest(request);
      if (adminResponse) return adminResponse;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
