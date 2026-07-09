import { createAPIFileRoute } from "@tanstack/start/api";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

function getSession(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(/(?:^|;\s*)jp_admin=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
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

export const APIRoute = createAPIFileRoute("/api/admin-save-post")({
  POST: async ({ request }) => {
    const token = getSession(request.headers.get("cookie"));
    if (!token) {
      return new Response(null, { status: 302, headers: { Location: "/painel" } });
    }

    const body = await request.formData();
    const id = body.get("id") as string | null;
    const title = (body.get("title") as string)?.trim();
    const excerpt = (body.get("excerpt") as string)?.trim() || null;
    const content = (body.get("content") as string)?.trim() || null;
    const image = (body.get("image") as string)?.trim() || null;
    const status = (body.get("status") as string) || "draft";

    if (!title) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/painel?view=new&error=T%C3%ADtulo+%C3%A9+obrigat%C3%B3rio" },
      });
    }

    const authHeader = { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: "return=minimal" };

    if (id) {
      // Update existing post
      const updateBody: Record<string, unknown> = { title, excerpt, content, featured_image_url: image, status };
      if (status === "published") updateBody.published_at = new Date().toISOString();

      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
        method: "PATCH",
        headers: authHeader,
        body: JSON.stringify(updateBody),
      });

      if (!res.ok) {
        const err = await res.text();
        return new Response(null, {
          status: 302,
          headers: { Location: `/painel?view=edit&id=${id}&error=${encodeURIComponent(err.slice(0, 80))}` },
        });
      }
    } else {
      // Get author_id from token
      const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
      });
      if (!userRes.ok) {
        return new Response(null, { status: 302, headers: { Location: "/painel" } });
      }
      const user = await userRes.json();

      const suffix = Math.random().toString(36).slice(2, 7);
      const slug = `${slugify(title)}-${suffix}`;

      const insertBody: Record<string, unknown> = {
        title, excerpt, content, featured_image_url: image, status,
        slug, author_id: user.id,
        published_at: status === "published" ? new Date().toISOString() : null,
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
        method: "POST",
        headers: { ...authHeader, Prefer: "return=minimal" },
        body: JSON.stringify(insertBody),
      });

      if (!res.ok) {
        const err = await res.text();
        return new Response(null, {
          status: 302,
          headers: { Location: `/painel?view=new&error=${encodeURIComponent(err.slice(0, 80))}` },
        });
      }
    }

    return new Response(null, { status: 302, headers: { Location: "/painel" } });
  },
});
