import { createAPIFileRoute } from "@tanstack/start/api";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

function getSession(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(/(?:^|;\s*)jp_admin=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export const APIRoute = createAPIFileRoute("/api/admin-delete-post")({
  POST: async ({ request }) => {
    const token = getSession(request.headers.get("cookie"));
    if (!token) {
      return new Response(null, { status: 302, headers: { Location: "/painel" } });
    }

    const body = await request.formData();
    const id = body.get("id") as string;

    if (id) {
      await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
        method: "DELETE",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
      });
    }

    return new Response(null, { status: 302, headers: { Location: "/painel" } });
  },
});
