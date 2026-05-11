import { createFileRoute } from "@tanstack/react-router";
import { useBentoBlocks, BentoBlock, uploadMedia } from "@/hooks/useBentoBlocks";
import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { Edit2, GripVertical, Plus, Save, Trash2, X, Upload, Loader2, Palette } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bento")({
  component: BentoEditor,
});

const PRESET_COLORS = [
  { name: "Brand", value: "var(--brand)" },
  { name: "Brand Soft", value: "var(--brand-soft)" },
  { name: "Secondary", value: "var(--secondary)" },
  { name: "Dark", value: "oklch(0.18 0.04 260)" },
  { name: "Success", value: "var(--success)" },
  { name: "Instagram", value: "var(--gradient-insta)", isGradient: true },
];

function BentoEditor() {
  const { user } = useAuth();
  const { blocks, updateBlock, addBlock, removeBlock, isLoading } = useBentoBlocks();
  const [editingBlock, setEditingBlock] = useState<BentoBlock | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock) return;

    updateBlock.mutate(editingBlock, {
      onSuccess: () => {
        toast.success("Bloco atualizado!");
        setEditingBlock(null);
      },
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !editingBlock) return;

    try {
      setIsUploading(true);
      const url = await uploadMedia(file, user.id);
      setEditingBlock({
        ...editingBlock,
        image_url: url,
        background_config: { ...editingBlock.background_config, type: "image", url }
      });
      toast.success("Imagem enviada!");
    } catch (error) {
      console.error(error);
      toast.error("Erro no upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate = () => {
    const newBlock: Omit<BentoBlock, "id" | "created_at" | "updated_at"> = {
      title: "Novo Bloco",
      subtitle: "Subtítulo",
      content: "",
      link_url: "",
      image_url: "",
      block_type: "link",
      col_span: 1,
      background_config: { type: "color", value: "var(--secondary)" },
      sort_order: blocks.length,
    };
    addBlock.mutate(newBlock, {
      onSuccess: () => toast.success("Bloco criado!"),
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Página Inicial</h1>
          <p className="text-muted-foreground">Personalize a grade Bento do seu site.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-brand-foreground hover:opacity-90 transition shadow-sm"
        >
          <Plus className="size-4" /> Novo Bloco
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mb-4" />
          <p>Carregando sua grade...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="group flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition hover:shadow-md hover:border-brand/30"
            >
              <div className="cursor-grab text-muted-foreground hover:text-brand">
                <GripVertical className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-brand/10 text-brand px-2 py-0.5 rounded-full">
                    {block.block_type}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {block.col_span} {block.col_span === 1 ? "COL" : "COLS"}
                  </span>
                </div>
                <h3 className="font-bold text-sm">{block.title || "Sem título"}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{block.subtitle}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => setEditingBlock(block)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Edit2 className="size-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Deseja realmente excluir este bloco?")) {
                      removeBlock.mutate(block.id);
                    }
                  }}
                  className="rounded-lg p-2 text-destructive/60 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {editingBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-xl my-auto rounded-[32px] border bg-card shadow-2xl overflow-hidden">
            <div className="p-8 border-b bg-secondary/30 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Configurar Bloco</h2>
                <p className="text-xs text-muted-foreground mt-1">ID: {editingBlock.id}</p>
              </div>
              <button onClick={() => setEditingBlock(null)} className="rounded-full p-2 hover:bg-secondary transition">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Conteúdo Principal */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Edit2 className="size-3" /> Conteúdo
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground ml-1">Título</label>
                    <input
                      className="w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none"
                      value={editingBlock.title || ""}
                      onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground ml-1">Subtítulo</label>
                    <input
                      className="w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none"
                      value={editingBlock.subtitle || ""}
                      onChange={(e) => setEditingBlock({ ...editingBlock, subtitle: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground ml-1">Descrição / Texto</label>
                  <textarea
                    className="w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none resize-none"
                    rows={2}
                    value={editingBlock.content || ""}
                    onChange={(e) => setEditingBlock({ ...editingBlock, content: e.target.value })}
                  />
                </div>
              </div>

              {/* Layout e Estilo */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Palette className="size-3" /> Visual e Layout
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground ml-1">Tipo de Bloco</label>
                    <select
                      className="w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none appearance-none"
                      value={editingBlock.block_type}
                      onChange={(e) => setEditingBlock({ ...editingBlock, block_type: e.target.value as any })}
                    >
                      <option value="link">Link Padrão</option>
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                      <option value="map">Mapa / Localização</option>
                      <option value="image">Imagem / Banner</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground ml-1">Tamanho</label>
                    <select
                      className="w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none"
                      value={editingBlock.col_span}
                      onChange={(e) => setEditingBlock({ ...editingBlock, col_span: parseInt(e.target.value) })}
                    >
                      <option value={1}>1 Coluna (Pequeno)</option>
                      <option value={2}>2 Colunas (Largo)</option>
                    </select>
                  </div>
                </div>

                {/* Seletor de Cores / Background */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground ml-1">Cor de Fundo / Estilo</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setEditingBlock({ 
                          ...editingBlock, 
                          background_config: { 
                            type: color.isGradient ? "gradient" : "color", 
                            value: color.value 
                          } 
                        })}
                        className={`size-10 rounded-xl border-2 transition ${
                          editingBlock.background_config.value === color.value ? "border-brand scale-110 shadow-lg" : "border-transparent"
                        }`}
                        style={{ background: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Upload de Imagem */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground ml-1">Imagem do Bloco</label>
                  <div className="flex items-center gap-4">
                    <div className="size-20 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden bg-secondary/20">
                      {editingBlock.image_url ? (
                        <img src={editingBlock.image_url} className="size-full object-cover" />
                      ) : (
                        <Upload className="size-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary py-2 text-xs font-bold hover:bg-secondary/80 transition"
                      >
                        {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                        {editingBlock.image_url ? "Trocar Imagem" : "Enviar Imagem"}
                      </button>
                      <p className="text-[10px] text-muted-foreground">Upload direto para o Supabase Storage.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground ml-1">Link de Destino (URL)</label>
                <input
                  className="w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none"
                  placeholder="https://..."
                  value={editingBlock.link_url || ""}
                  onChange={(e) => setEditingBlock({ ...editingBlock, link_url: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingBlock(null)}
                  className="flex-1 rounded-2xl border py-4 font-bold text-sm hover:bg-secondary transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-brand py-4 font-bold text-sm text-brand-foreground hover:opacity-90 shadow-lg shadow-brand/20 transition"
                >
                  <Save className="size-4" /> Salvar Bloco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
