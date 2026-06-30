import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteNavBar } from "@/components/SiteNavBar";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  created_at: string;
}

function BlogPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["public-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, featured_image_url, published_at, created_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  return (
    <div className="min-h-screen bg-classic-light font-sans text-classic-navy selection:bg-classic-pastel selection:text-white">
      <SiteNavBar />
      <main className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl font-serif italic text-center">Blog</h1>
          <p className="mt-3 text-center text-classic-navy/60 text-lg">
            Conteúdo clínico direto ao ponto.
          </p>

          <div className="mt-16 space-y-8">
            {isLoading && (
              <p className="text-center text-classic-navy/40">Carregando...</p>
            )}
            {!isLoading && posts?.length === 0 && (
              <p className="text-center text-classic-navy/40">Nenhum post publicado ainda.</p>
            )}
            {posts?.map((post) => (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group block rounded-3xl border border-classic-navy/10 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-classic-brown/30"
              >
                <time className="text-xs font-semibold uppercase tracking-widest text-classic-brown/70">
                  {new Date(post.published_at ?? post.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <h2 className="mt-3 text-2xl font-medium leading-snug group-hover:text-classic-brown transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-3 text-classic-navy/60 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-classic-brown">
                  Ler post &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
