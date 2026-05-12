import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Save, Globe, Info, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "Dr. João Paulo Silva-Neto",
    siteDescription: "Reabilitador Oral e Mentor de Dentistas",
    contactEmail: "contato@drjoaopaulo.com.br",
    whatsappNumber: "5584996455555",
  });

  useEffect(() => {
    const saved = localStorage.getItem("site-settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("site-settings", JSON.stringify(settings));
      setLoading(false);
      toast.success("Configurações salvas com sucesso!");
    }, 800);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie as informações globais do site</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Informações Básicas */}
          <div className="space-y-4 rounded-2xl bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Globe className="size-4 text-brand" />
              Geral
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Site</label>
              <input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="Ex: Dr. João Paulo Silva-Neto"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição / Subtítulo</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                placeholder="Ex: Reabilitador Oral e Mentor de Dentistas"
                rows={3}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4 rounded-2xl bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <MessageSquare className="size-4 text-brand" />
              Contato & Redes
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail de Contato</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="Ex: contato@exemplo.com"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp (apenas números)</label>
              <input
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="Ex: 5584999999999"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50"
          >
            <Save className="size-4" />
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>

      <div className="mt-12 rounded-2xl border border-dashed border-border p-6 text-center">
        <Info className="mx-auto size-6 text-muted-foreground" />
        <h3 className="mt-2 font-medium">Dica de SEO</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          O nome e a descrição do site são usados para os motores de busca (Google) e compartilhamentos em redes sociais.
        </p>
      </div>
    </div>
  );
}
