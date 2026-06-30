import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNavBar } from "@/components/SiteNavBar";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  created_at: string;
}

export const Route = createFileRoute("/blog/")({
  loader: async (): Promise<{ posts: Post[] }> => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/posts?status=eq.published&select=id,title,slug,excerpt,published_at,created_at&order=published_at.desc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      if (!res.ok) return { posts: [] };
      const posts = await res.json();
      return { posts: posts as Post[] };
    } catch {
      return { posts: [] };
    }
  },
  component: BlogPage,
});

function BlogPage() {
  const { posts } = Route.useLoaderData();

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
            {posts.length === 0 && (
              <p className="text-center text-classic-navy/40">Nenhum post publicado ainda.</p>
            )}
            {posts.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
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
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
