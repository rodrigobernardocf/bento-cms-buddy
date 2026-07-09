import { createFileRoute } from "@tanstack/react-router";
import { getWebRequest } from "@tanstack/react-start/server";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

function getSession(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(/(?:^|;\s*)jp_admin=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

type Search = { error?: string; view: string; id?: string };

type LoaderResult =
  | { authed: false; error?: string }
  | { authed: true; posts: Post[]; editPost?: Post; view: string; error?: string };

export const Route = createFileRoute("/painel")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    error: typeof s.error === "string" ? s.error : undefined,
    view: typeof s.view === "string" ? s.view : "posts",
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  loader: async ({ location }): Promise<LoaderResult> => {
    const req = getWebRequest();
    const token = getSession(req.headers.get("cookie"));
    const search = location.search as Search;

    if (!token) return { authed: false, error: search.error };

    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) return { authed: false, error: "Sessão expirada. Entre novamente." };

    const postsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?select=id,title,slug,excerpt,content,featured_image_url,status,published_at,created_at&order=created_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } }
    );
    const posts: Post[] = postsRes.ok ? await postsRes.json() : [];

    const editPost =
      search.view === "edit" && search.id
        ? posts.find((p) => p.id === search.id)
        : undefined;

    return { authed: true, posts, editPost, view: search.view, error: search.error };
  },
  component: PainelPage,
});

/* ─── styles ─────────────────────────────────────────────────────────── */
const S = {
  root: "font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f3ef;color:#1a2744;min-height:100vh",
  // login
  loginWrap: "display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem",
  card: "background:#fff;border:1px solid #e5e1d8;border-radius:1.5rem;padding:2.5rem;width:100%;max-width:400px;box-shadow:0 4px 24px rgba(0,0,0,.06)",
  h1: "font-size:1.5rem;font-weight:600;margin-bottom:.25rem",
  muted: "color:#8a8070;font-size:.875rem;margin-bottom:1.75rem",
  label: "display:block;font-size:.8125rem;font-weight:600;margin-bottom:.4rem",
  input: "width:100%;border:1px solid #e5e1d8;border-radius:.75rem;padding:.6rem .875rem;font-size:.9rem;background:#fff;outline:none;font-family:inherit;box-sizing:border-box",
  field: "margin-bottom:1.1rem",
  btnPrimary: "width:100%;background:#1a2744;color:#fff;border:none;border-radius:.875rem;padding:.75rem 1.25rem;font-size:.8125rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;cursor:pointer",
  btnWine: "background:#7a1c2e;color:#fff;border:none;border-radius:.875rem;padding:.55rem 1rem;font-size:.75rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;cursor:pointer",
  btnGhost: "background:transparent;color:#8a8070;border:1px solid #e5e1d8;border-radius:.875rem;padding:.55rem 1rem;font-size:.75rem;font-weight:700;cursor:pointer",
  btnSmBlue: "background:#4a7ab5;color:#fff;border:none;border-radius:.75rem;padding:.45rem .9rem;font-size:.75rem;font-weight:700;cursor:pointer",
  // admin layout
  layout: "display:flex;min-height:100vh",
  aside: "width:220px;background:#1a2744;color:#fff;padding:1.5rem;flex-shrink:0;display:flex;flex-direction:column;gap:.25rem",
  asideTitle: "font-size:.9rem;font-weight:700;margin-bottom:1.5rem;letter-spacing:.02em",
  navGroup: "font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:.5rem;margin-top:1rem",
  navLink: "display:block;padding:.5rem .75rem;border-radius:.75rem;font-size:.875rem;font-weight:500;color:rgba(255,255,255,.7);text-decoration:none",
  navLinkActive: "display:block;padding:.5rem .75rem;border-radius:.75rem;font-size:.875rem;font-weight:500;color:#fff;background:rgba(255,255,255,.12);text-decoration:none",
  content: "flex:1;padding:2.5rem;overflow-y:auto",
  contentHeader: "display:flex;align-items:center;justify-content:space-between;margin-bottom:1.75rem",
  pageTitle: "font-size:1.625rem;font-weight:600",
  table: "width:100%;border-collapse:collapse;background:#fff;border-radius:1rem;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)",
  th: "background:#f0ede8;padding:.75rem 1rem;text-align:left;font-size:.75rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#8a8070",
  td: "padding:.875rem 1rem;border-top:1px solid #e5e1d8;font-size:.875rem;vertical-align:middle",
  badgePub: "display:inline-block;padding:.2rem .6rem;border-radius:999px;font-size:.7rem;font-weight:700;text-transform:uppercase;background:#d1fae5;color:#065f46",
  badgeDraft: "display:inline-block;padding:.2rem .6rem;border-radius:999px;font-size:.7rem;font-weight:700;text-transform:uppercase;background:#f0ede8;color:#8a8070",
  // form
  formCard: "background:#fff;border:1px solid #e5e1d8;border-radius:1.25rem;padding:2rem;max-width:860px",
  textarea: "width:100%;border:1px solid #e5e1d8;border-radius:.75rem;padding:.6rem .875rem;font-size:.9rem;font-family:inherit;line-height:1.7;resize:vertical;box-sizing:border-box",
  select: "width:100%;border:1px solid #e5e1d8;border-radius:.75rem;padding:.6rem .875rem;font-size:.9rem;font-family:inherit;background:#fff",
  errBox: "background:#fef2f2;border:1px solid #fca5a5;border-radius:.75rem;padding:.75rem 1rem;font-size:.8rem;color:#7a1c2e;margin-bottom:1rem",
};

/* ─── page root ─────────────────────────────────────────────────────── */
function PainelPage() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();

  if (!data.authed) {
    return (
      <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", background: "#f5f3ef", color: "#1a2744", minHeight: "100vh" }}>
        <LoginView error={data.error} />
      </div>
    );
  }

  const { posts, editPost, view, error } = data;
  const showForm = view === "new" || view === "edit";

  return (
    <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", background: "#f5f3ef", color: "#1a2744", minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: "#1a2744", color: "#fff", padding: "1.5rem", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: ".9rem", fontWeight: 700, marginBottom: "1.5rem" }}>CMS · Dr. JP</div>
        <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", marginBottom: ".5rem" }}>Conteúdo</div>
        <a href="/painel" style={{ ...(showForm ? {} : { background: "rgba(255,255,255,.12)", color: "#fff" }), display: "block", padding: ".5rem .75rem", borderRadius: ".75rem", fontSize: ".875rem", fontWeight: 500, color: showForm ? "rgba(255,255,255,.7)" : "#fff", textDecoration: "none", marginBottom: ".25rem" }}>
          Posts
        </a>
        <a href="/painel?view=new" style={{ ...(view === "new" ? { background: "rgba(255,255,255,.12)", color: "#fff" } : { color: "rgba(255,255,255,.7)" }), display: "block", padding: ".5rem .75rem", borderRadius: ".75rem", fontSize: ".875rem", fontWeight: 500, textDecoration: "none" }}>
          Novo post
        </a>
        <div style={{ flex: 1 }} />
        <a href="/" style={{ display: "block", padding: ".5rem .75rem", borderRadius: ".75rem", fontSize: ".875rem", color: "rgba(255,255,255,.5)", textDecoration: "none", marginBottom: ".25rem" }}>← Ver site</a>
        <a href="/api/admin-logout" style={{ display: "block", padding: ".5rem .75rem", borderRadius: ".75rem", fontSize: ".875rem", color: "#f87171", textDecoration: "none" }}>Sair</a>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "2.5rem", overflowY: "auto" }}>
        {showForm
          ? <PostFormView post={editPost} error={error} />
          : <PostsListView posts={posts ?? []} error={error} />}
      </main>
    </div>
  );
}

/* ─── login ─────────────────────────────────────────────────────────── */
function LoginView({ error }: { error?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e1d8", borderRadius: "1.5rem", padding: "2.5rem", width: "100%", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: ".25rem", color: "#1a2744" }}>Admin · Dr. JP</h1>
        <p style={{ color: "#8a8070", fontSize: ".875rem", marginBottom: "1.75rem" }}>Entre com sua conta para gerenciar o site.</p>
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: ".75rem", padding: ".75rem 1rem", fontSize: ".8rem", color: "#7a1c2e", marginBottom: "1rem" }}>
            {decodeURIComponent(error)}
          </div>
        )}
        <form method="POST" action="/api/admin-login">
          <Field label="E-mail">
            <input type="email" name="email" placeholder="seu@email.com" autoComplete="email"
              style={{ width: "100%", border: "1px solid #e5e1d8", borderRadius: ".75rem", padding: ".6rem .875rem", fontSize: ".9rem", background: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </Field>
          <Field label="Senha">
            <input type="password" name="password" placeholder="••••••••" autoComplete="current-password"
              style={{ width: "100%", border: "1px solid #e5e1d8", borderRadius: ".75rem", padding: ".6rem .875rem", fontSize: ".9rem", background: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </Field>
          <button type="submit" style={{ width: "100%", background: "#1a2744", color: "#fff", border: "none", borderRadius: ".875rem", padding: ".75rem 1.25rem", fontSize: ".8125rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", cursor: "pointer" }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── posts list ─────────────────────────────────────────────────────── */
function PostsListView({ posts, error }: { posts: Post[]; error?: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 600 }}>Posts</h1>
        <a href="/painel?view=new" style={{ background: "#7a1c2e", color: "#fff", borderRadius: ".875rem", padding: ".55rem 1.1rem", fontSize: ".8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", textDecoration: "none" }}>
          + Novo post
        </a>
      </div>
      {error && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: ".75rem", padding: ".75rem 1rem", fontSize: ".8rem", color: "#7a1c2e", marginBottom: "1rem" }}>{decodeURIComponent(error)}</div>}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
        <thead>
          <tr>
            {["Título", "Status", "Data", ""].map((h) => (
              <th key={h} style={{ background: "#f0ede8", padding: ".75rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#8a8070" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#8a8070", fontSize: ".875rem" }}>Nenhum post ainda. <a href="/painel?view=new" style={{ color: "#7a1c2e" }}>Criar o primeiro →</a></td></tr>
          ) : posts.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: ".875rem 1rem", borderTop: "1px solid #e5e1d8", fontSize: ".875rem", verticalAlign: "middle" }}>
                <strong>{p.title}</strong>
                <br />
                <span style={{ fontSize: ".75rem", color: "#8a8070" }}>{p.slug}</span>
              </td>
              <td style={{ padding: ".875rem 1rem", borderTop: "1px solid #e5e1d8", verticalAlign: "middle" }}>
                <span style={p.status === "published"
                  ? { display: "inline-block", padding: ".2rem .6rem", borderRadius: "999px", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", background: "#d1fae5", color: "#065f46" }
                  : { display: "inline-block", padding: ".2rem .6rem", borderRadius: "999px", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", background: "#f0ede8", color: "#8a8070" }}>
                  {p.status === "published" ? "Publicado" : "Rascunho"}
                </span>
              </td>
              <td style={{ padding: ".875rem 1rem", borderTop: "1px solid #e5e1d8", color: "#8a8070", fontSize: ".8rem", whiteSpace: "nowrap", verticalAlign: "middle" }}>
                {fmtDate(p.published_at ?? p.created_at)}
              </td>
              <td style={{ padding: ".875rem 1rem", borderTop: "1px solid #e5e1d8", verticalAlign: "middle" }}>
                <div style={{ display: "flex", gap: ".5rem" }}>
                  <a href={`/painel?view=edit&id=${p.id}`} style={{ background: "#4a7ab5", color: "#fff", borderRadius: ".75rem", padding: ".45rem .9rem", fontSize: ".75rem", fontWeight: 700, textDecoration: "none" }}>
                    Editar
                  </a>
                  <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" style={{ background: "transparent", border: "1px solid #e5e1d8", color: "#8a8070", borderRadius: ".75rem", padding: ".45rem .9rem", fontSize: ".75rem", fontWeight: 700, textDecoration: "none" }}>
                    Ver
                  </a>
                  <form method="POST" action="/api/admin-delete-post" style={{ display: "inline" }}
                    onSubmit={(e) => { if (!confirm(`Excluir "${p.title}"?`)) e.preventDefault(); }}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" style={{ background: "transparent", border: "1px solid #fca5a5", color: "#7a1c2e", borderRadius: ".75rem", padding: ".45rem .9rem", fontSize: ".75rem", fontWeight: 700, cursor: "pointer" }}>
                      Excluir
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── post form ──────────────────────────────────────────────────────── */
function PostFormView({ post, error }: { post?: Post; error?: string }) {
  const isEdit = !!post;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 600 }}>{isEdit ? "Editar post" : "Novo post"}</h1>
        <a href="/painel" style={{ background: "transparent", border: "1px solid #e5e1d8", color: "#8a8070", borderRadius: ".875rem", padding: ".55rem 1rem", fontSize: ".8rem", fontWeight: 700, textDecoration: "none" }}>
          ← Voltar
        </a>
      </div>
      {error && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: ".75rem", padding: ".75rem 1rem", fontSize: ".8rem", color: "#7a1c2e", marginBottom: "1rem" }}>{decodeURIComponent(error)}</div>}
      <div style={{ background: "#fff", border: "1px solid #e5e1d8", borderRadius: "1.25rem", padding: "2rem", maxWidth: 860 }}>
        <form method="POST" action="/api/admin-save-post">
          {isEdit && <input type="hidden" name="id" value={post!.id} />}
          <Field label="Título">
            <input type="text" name="title" defaultValue={post?.title ?? ""} placeholder="Título do artigo" required
              style={{ width: "100%", border: "1px solid #e5e1d8", borderRadius: ".75rem", padding: ".6rem .875rem", fontSize: ".9rem", background: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </Field>
          <Field label="Resumo (excerpt)">
            <textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} placeholder="Frase de abertura — aparece na listagem e no header do post"
              style={{ width: "100%", border: "1px solid #e5e1d8", borderRadius: ".75rem", padding: ".6rem .875rem", fontSize: ".9rem", fontFamily: "inherit", lineHeight: 1.7, resize: "vertical", boxSizing: "border-box" }} />
          </Field>
          <Field label="Conteúdo (parágrafos separados por linha em branco)">
            <textarea name="content" rows={22} defaultValue={post?.content ?? ""} placeholder={"Escreva o artigo aqui.\n\nSepare os parágrafos com uma linha em branco."}
              style={{ width: "100%", border: "1px solid #e5e1d8", borderRadius: ".75rem", padding: ".6rem .875rem", fontSize: ".9rem", fontFamily: "inherit", lineHeight: 1.7, resize: "vertical", boxSizing: "border-box" }} />
          </Field>
          <Field label="URL da imagem de capa">
            <input type="url" name="image" defaultValue={post?.featured_image_url ?? ""} placeholder="https://..."
              style={{ width: "100%", border: "1px solid #e5e1d8", borderRadius: ".75rem", padding: ".6rem .875rem", fontSize: ".9rem", background: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={post?.status ?? "draft"}
              style={{ width: "100%", border: "1px solid #e5e1d8", borderRadius: ".75rem", padding: ".6rem .875rem", fontSize: ".9rem", fontFamily: "inherit", background: "#fff" }}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </Field>
          <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
            <button type="submit" style={{ background: "#1a2744", color: "#fff", border: "none", borderRadius: ".875rem", padding: ".65rem 1.5rem", fontSize: ".8125rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", cursor: "pointer" }}>
              {isEdit ? "Salvar alterações" : "Criar post"}
            </button>
            <a href="/painel" style={{ background: "transparent", border: "1px solid #e5e1d8", color: "#8a8070", borderRadius: ".875rem", padding: ".65rem 1.25rem", fontSize: ".8125rem", fontWeight: 700, textDecoration: "none" }}>
              Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── helpers ───────────────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={{ display: "block", fontSize: ".8125rem", fontWeight: 600, marginBottom: ".4rem", color: "#1a2744" }}>{label}</label>
      {children}
    </div>
  );
}
