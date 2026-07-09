import { createAPIFileRoute } from "@tanstack/start/api";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const APIRoute = createAPIFileRoute("/api/admin-login")({
  POST: async ({ request }) => {
    const body = await request.formData();
    const email = (body.get("email") as string)?.trim();
    const password = body.get("password") as string;

    if (!email || !password) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/painel?error=Preencha+e-mail+e+senha" },
      });
    }

    const res = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/painel?error=Credenciais+inv%C3%A1lidas" },
      });
    }

    const data = await res.json();
    const token = data.access_token as string;

    const cookie = `jp_admin=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`;

    return new Response(null, {
      status: 302,
      headers: { Location: "/painel", "Set-Cookie": cookie },
    });
  },
});
