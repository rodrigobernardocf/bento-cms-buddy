import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

type Role = "admin" | "editor" | "author";

function UsersPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/admin/dashboard" });
  }, [loading, isAdmin, navigate]);

  const users = useQuery({
    queryKey: ["users-with-roles"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data: profiles, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      return profiles.map((p) => ({
        ...p,
        roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role as Role),
      }));
    },
  });

  const setRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      // remove other roles, set this one
      await supabase.from("user_roles").delete().eq("user_id", userId);
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Permissão atualizada");
      qc.invalidateQueries({ queryKey: ["users-with-roles"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  if (!isAdmin) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold">Usuários</h1>
      <p className="mt-1 text-sm text-muted-foreground">Gerencie permissões de acesso</p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Permissão</th>
            </tr>
          </thead>
          <tbody>
            {users.data?.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{u.full_name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">@{u.username ?? "—"}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.roles[0] ?? "author"}
                    onChange={(e) => setRole.mutate({ userId: u.id, role: e.target.value as Role })}
                    className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
                  >
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
