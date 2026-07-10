import { createAPIFileRoute } from "@tanstack/start/api";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

function getToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(/(?:^|;\s*)jp_admin=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export const APIRoute = createAPIFileRoute("/api/admin-posts")({
  GET: async ({ request }) => {
    const token = getToken(request.headers.get("cookie"));
    if (!token) return Response.json({ authed: false, posts: [] });

    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) return Response.json({ authed: false, posts: [] });

    const postsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?select=id,title,slug,excerpt,content,featured_image_url,status,published_at,created_at&order=created_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } }
    );
    const posts = postsRes.ok ? await postsRes.json() : [];

    return Response.json({ authed: true, posts });
  },
});
