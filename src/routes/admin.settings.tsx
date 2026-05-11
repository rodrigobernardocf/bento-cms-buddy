import { createFileRoute } from "@tanstack/react-router";
import { useSettings, ProfileSettings } from "@/hooks/useSettings";
import { uploadMedia } from "@/hooks/useBentoBlocks";
import { useAuth } from "@/lib/auth-context";
import { useState, useRef, useEffect } from "react";
import { Save, Upload, Loader2, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const { profile, updateProfile, isLoading } = useSettings();
  const [formData, setFormData] = useState<ProfileSettings | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    updateProfile.mutate(formData, {
      onSuccess: () => toast.success("Configurações salvas!"),
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !formData) return;

    try {
      setIsUploading(true);
      const url = await uploadMedia(file, user.id);
      setFormData({ ...formData, avatar_url: url });
      toast.success("Foto carregada!");
    } catch (error) {
      console.error(error);
      toast.error("Erro no upload");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading || !formData) return <div className="p-8">Carregando configurações...</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configurações Gerais</h1>
        <p className="text-muted-foreground">Gerencie as informações principais do seu site.</p>
      </div>

      <div className="rounded-[32px] border bg-card p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 border-b pb-8">
            <div className="relative group">
              <div className="size-32 overflow-hidden rounded-full ring-4 ring-secondary bg-secondary/50">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <User className="size-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                {isUploading ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-sm font-bold">Foto de Perfil</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-muted-foreground ml-1">Nome do Profissional</label>
              <input
                className="w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-muted-foreground ml-1">Bio / Especialidade</label>
              <textarea
                className="w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none resize-none"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand py-4 font-bold text-brand-foreground hover:opacity-90 shadow-lg shadow-brand/20 transition"
          >
            {updateProfile.isPending ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
