import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BentoBlock {
  id: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  link_url: string | null;
  image_url: string | null;
  block_type: "link" | "youtube" | "instagram" | "map" | "image";
  col_span: number;
  background_config: {
    type: "color" | "gradient" | "image";
    value?: string;
    url?: string;
  };
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useBentoBlocks() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["bento_blocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bento_blocks")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as BentoBlock[];
    },
  });

  const updateBlock = useMutation({
    mutationFn: async (payload: Partial<BentoBlock> & { id: string }) => {
      const { data, error } = await supabase
        .from("bento_blocks")
        .update(payload)
        .eq("id", payload.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bento_blocks"] });
    },
  });

  const addBlock = useMutation({
    mutationFn: async (payload: Omit<BentoBlock, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("bento_blocks")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bento_blocks"] });
    },
  });

  const removeBlock = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bento_blocks").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bento_blocks"] });
    },
  });

  return {
    blocks: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    updateBlock,
    addBlock,
    removeBlock,
  };
}

export async function uploadMedia(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `bento/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
