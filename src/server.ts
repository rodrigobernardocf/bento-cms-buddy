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

  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  });
  return Response.json({ authed: res.ok });
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

// ─── Router ──────────────────────────────────────────────────────────────────

async function routeAdminRequest(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  if (path === "/api/admin-login" && method === "POST") return handleAdminLogin(req);
  if (path === "/api/admin-logout") return handleAdminLogout();
  if (path === "/api/session-check" && method === "GET") return handleSessionCheck(req);
  if (path === "/api/admin-posts" && method === "GET") return handleAdminPosts(req);
  if (path === "/api/admin-save-post" && method === "POST") return handleAdminSavePost(req);
  if (path === "/api/admin-delete-post" && method === "POST") return handleAdminDeletePost(req);

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
