import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePosts, uploadMedia } from "@/hooks/usePosts";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/posts/new")({
  component: NewPost,
});

function NewPost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { create } = usePosts();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const cats = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const url = await uploadMedia(file, user.id);
      setImageUrl(url);
      toast.success("Imagem enviada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    const slug = newCategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");
    const { data, error } = await supabase.from("categories").insert({ name: newCategory, slug }).select().single();
    if (error) return toast.error(error.message);
    cats.refetch();
    setCategoryIds([...categoryIds, data.id]);
    setNewCategory("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    create.mutate(
      { title, excerpt, content, featured_image_url: imageUrl, status, author_id: user.id, category_ids: categoryIds },
      {
        onSuccess: () => { toast.success("Post criado!"); navigate({ to: "/admin/posts" }); },
        onError: (err) => toast.error(err instanceof Error ? err.message : "Erro"),
      }
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/posts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline">
        <ArrowLeft className="size-4" /> Voltar
      </Link>
      <h1 className="mt-3 text-3xl font-bold">Novo post</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Título</label>
          <input
            required value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-input bg-card px-4 py-2.5"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Resumo</label>
          <input
            value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-xl border border-input bg-card px-4 py-2.5"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Conteúdo</label>
          <textarea
            value={content} onChange={(e) => setContent(e.target.value)} rows={10}
            className="w-full rounded-xl border border-input bg-card px-4 py-2.5"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Imagem destacada</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-input bg-card px-4 py-2.5 text-sm hover:bg-secondary">
              <Upload className="size-4" /> {uploading ? "Enviando..." : "Selecionar"}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
            {imageUrl && <img src={imageUrl} alt="preview" className="h-16 w-16 rounded-lg object-cover" />}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Categorias</label>
          <div className="flex flex-wrap gap-2">
            {cats.data?.map((c) => {
              const active = categoryIds.includes(c.id);
              return (
                <button
                  key={c.id} type="button"
                  onClick={() => setCategoryIds(active ? categoryIds.filter((x) => x !== c.id) : [...categoryIds, c.id])}
                  className={`rounded-full px-3 py-1.5 text-sm ${active ? "bg-brand text-brand-foreground" : "bg-secondary text-foreground"}`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nova categoria"
              className="flex-1 rounded-xl border border-input bg-card px-3 py-2 text-sm"
            />
            <button type="button" onClick={handleAddCategory} className="rounded-xl bg-secondary px-4 py-2 text-sm">Adicionar</button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="rounded-xl border border-input bg-card px-4 py-2.5">
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>

        <button type="submit" disabled={create.isPending} className="rounded-xl bg-brand px-6 py-3 font-semibold text-brand-foreground disabled:opacity-50">
          {create.isPending ? "Salvando..." : "Salvar post"}
        </button>
      </form>
    </div>
  );
}
