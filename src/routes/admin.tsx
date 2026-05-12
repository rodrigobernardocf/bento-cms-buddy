import { createFileRoute, Link, Outlet, useNavigate, useLocation, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSettings } from "@/hooks/useSettings";
import { LayoutDashboard, FileText, Users, LogOut, Home, Layers, Settings } from "lucide-react";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      throw redirect({ to: "/admin/dashboard" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const settings = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/pages", label: "Páginas", icon: Layers },
    { to: "/admin/posts", label: "Posts", icon: FileText },
    ...(isAdmin ? [{ to: "/admin/users", label: "Usuários", icon: Users }] : []),
    { to: "/admin/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-60 flex-col border-r border-border bg-card p-5">
        <Link to="/" className="mb-8 text-lg font-bold truncate">
          CMS · {settings.siteName.split(' ')[0]} {settings.siteName.split(' ')[1] || ''}
        </Link>
        <nav className="flex-1 space-y-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="size-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 space-y-1 border-t border-border pt-4">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">
            <Home className="size-4" /> Ver site
          </Link>
          <button
            onClick={() => signOut().then(() => navigate({ to: "/login" }))}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
          >
            <LogOut className="size-4" /> Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
