import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/slug";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  status: "draft" | "published";
  author_id: string;
  created_at: string;
  updated_at: string;
}

interface PostsFilters {
  search?: string;
  status?: "draft" | "published" | "all";
  page?: number;
  pageSize?: number;
}

export function usePosts(filters: PostsFilters = {}) {
  const { search = "", status = "all", page = 1, pageSize = 10 } = filters;
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["posts", { search, status, page, pageSize }],
    queryFn: async () => {
      let q = supabase.from("posts").select("*", { count: "exact" }).order("created_at", { ascending: false });
      if (status !== "all") q = q.eq("status", status);
      if (search) q = q.ilike("title", `%${search}%`);
      const from = (page - 1) * pageSize;
      q = q.range(from, from + pageSize - 1);
      const { data, error, count } = await q;
      if (error) throw error;
      return { posts: (data ?? []) as Post[], count: count ?? 0 };
    },
  });

  const create = useMutation({
    mutationFn: async (input: {
      title: string;
      content?: string;
      excerpt?: string;
      featured_image_url?: string | null;
      status: "draft" | "published";
      author_id: string;
      category_ids?: string[];
    }) => {
      const slug = `${slugify(input.title)}-${Math.random().toString(36).slice(2, 7)}`;
      const { data, error } = await supabase
        .from("posts")
        .insert({
          title: input.title,
          slug,
          content: input.content ?? null,
          excerpt: input.excerpt ?? null,
          featured_image_url: input.featured_image_url ?? null,
          status: input.status,
          author_id: input.author_id,
          published_at: input.status === "published" ? new Date().toISOString() : null,
        })
        .select()
        .single();
      if (error) throw error;
      if (input.category_ids?.length) {
        await supabase
          .from("post_categories")
          .insert(input.category_ids.map((cid) => ({ post_id: data.id, category_id: cid })));
      }
      return data as Post;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Post> & { id: string }) => {
      const { data, error } = await supabase.from("posts").update(patch).eq("id", id).select().single();
      if (error) throw error;
      return data as Post;
    },
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ["posts"] });
      const prev = qc.getQueriesData<{ posts: Post[]; count: number }>({ queryKey: ["posts"] });
      prev.forEach(([key, val]) => {
        if (!val) return;
        qc.setQueryData(key, {
          ...val,
          posts: val.posts.map((p) => (p.id === vars.id ? { ...p, ...vars } : p)),
        });
      });
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev?.forEach(([k, v]) => qc.setQueryData(k, v)),
    onSettled: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["posts"] });
      const prev = qc.getQueriesData<{ posts: Post[]; count: number }>({ queryKey: ["posts"] });
      prev.forEach(([key, val]) => {
        if (!val) return;
        qc.setQueryData(key, { ...val, posts: val.posts.filter((p) => p.id !== id) });
      });
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev?.forEach(([k, v]) => qc.setQueryData(k, v)),
    onSettled: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  return { ...list, create, update, remove };
}

export async function uploadMedia(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
