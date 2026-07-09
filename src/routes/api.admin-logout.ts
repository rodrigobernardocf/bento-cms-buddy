import { createAPIFileRoute } from "@tanstack/start/api";

export const APIRoute = createAPIFileRoute("/api/admin-logout")({
  GET: async () => {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/painel",
        "Set-Cookie": "jp_admin=; Path=/; HttpOnly; Max-Age=0",
      },
    });
  },
});
