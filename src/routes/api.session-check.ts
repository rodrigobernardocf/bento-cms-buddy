import { createAPIFileRoute } from "@tanstack/start/api";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

function getToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(/(?:^|;\s*)jp_admin=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export const APIRoute = createAPIFileRoute("/api/session-check")({
  GET: async ({ request }) => {
    const token = getToken(request.headers.get("cookie"));
    if (!token) return Response.json({ authed: false });

    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
    });

    return Response.json({ authed: res.ok });
  },
});
