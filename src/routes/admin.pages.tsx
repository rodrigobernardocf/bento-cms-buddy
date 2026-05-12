import { createFileRoute } from "@tanstack/react-router";
import { Layout, ExternalLink, Search } from "lucide-react";

export const Route = createFileRoute("/admin/pages")({
  component: PagesList,
});

function PagesList() {
  const pages = [
    { id: 1, title: "Home Clássica", path: "/home", status: "published", updated_at: new Date().toISOString() },
    { id: 2, title: "Tratamentos", path: "/tratamentos", status: "published", updated_at: new Date().toISOString() },
    { id: 3, title: "O Especialista", path: "/especialista", status: "published", updated_at: new Date().toISOString() },
    { id: 4, title: "Blog", path: "/blog", status: "published", updated_at: new Date().toISOString() },
    { id: 5, title: "Bento (Antiga Home)", path: "/", status: "published", updated_at: new Date().toISOString() },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Páginas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie as páginas do seu site</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Buscar por título..."
            className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            disabled
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Caminho</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Última atualização</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.path}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                    Publicado
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(p.updated_at).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={p.path}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg p-2 text-muted-foreground hover:bg-secondary"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
