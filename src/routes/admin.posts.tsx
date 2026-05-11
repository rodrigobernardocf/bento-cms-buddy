import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/posts")({
  component: PostsList,
});

function PostsList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, remove, update } = usePosts({ search, status, page, pageSize });
  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / pageSize));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie todos os posts</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90"
        >
          <Plus className="size-4" /> Novo post
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por título..."
            className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }}
          className="rounded-xl border border-input bg-card px-4 py-2.5 text-sm"
        >
          <option value="all">Todos</option>
          <option value="published">Publicados</option>
          <option value="draft">Rascunhos</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Criado</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Carregando...</td></tr>
            )}
            {!isLoading && data?.posts.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Nenhum post encontrado</td></tr>
            )}
            {data?.posts.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => update.mutate({ id: p.id, status: p.status === "published" ? "draft" : "published" })}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      p.status === "published" ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {p.status === "published" ? "Publicado" : "Rascunho"}
                  </button>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      if (confirm("Excluir este post?")) {
                        remove.mutate(p.id, { onSuccess: () => toast.success("Post removido") });
                      }
                    }}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-lg border border-input bg-card px-3 py-1.5 text-sm disabled:opacity-40"
          >Anterior</button>
          <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-input bg-card px-3 py-1.5 text-sm disabled:opacity-40"
          >Próxima</button>
        </div>
      )}
    </div>
  );
}
