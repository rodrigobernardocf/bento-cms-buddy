import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Users, CheckCircle2, FileEdit } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [posts, published, drafts, users] = await Promise.all([
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "draft"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      return {
        posts: posts.count ?? 0,
        published: published.count ?? 0,
        drafts: drafts.count ?? 0,
        users: users.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Posts totais", value: stats.data?.posts ?? "—", icon: FileText },
    { label: "Publicados", value: stats.data?.published ?? "—", icon: CheckCircle2 },
    { label: "Rascunhos", value: stats.data?.drafts ?? "—", icon: FileEdit },
    { label: "Usuários", value: stats.data?.users ?? "—", icon: Users },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Visão geral do conteúdo</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Icon className="size-5 text-brand" />
            </div>
            <p className="mt-3 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
