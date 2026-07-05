import { createFileRoute } from "@tanstack/react-router";
import { SiteNavBar } from "@/components/SiteNavBar";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  created_at: string;
}

export const Route = createFileRoute("/blog/")({
  loader: async (): Promise<{ posts: Post[] }> => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/posts?status=eq.published&select=id,title,slug,excerpt,featured_image_url,published_at,created_at&order=published_at.desc`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      if (!res.ok) return { posts: [] };
      return { posts: (await res.json()) as Post[] };
    } catch {
      return { posts: [] };
    }
  },
  component: BlogPage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function BlogPage() {
  const { posts } = Route.useLoaderData();
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-classic-light font-sans text-classic-navy">
      <SiteNavBar />

      {/* Hero */}
      <section className="bg-classic-navy pt-32 pb-16 px-6 text-white">
        <div className="mx-auto max-w-5xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-classic-pastel/80">
            Reabilitação Objetiva · Blog
          </span>
          <h1 className="mt-3 text-5xl md:text-6xl font-medium leading-tight">
            Clínica sem <span className="font-serif italic text-classic-pastel">improviso.</span>
          </h1>
          <p className="mt-4 max-w-xl text-white/60 text-lg leading-relaxed">
            Conteúdo clínico direto — diagnóstico, protocolo e raciocínio aplicado.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-classic-navy/40 py-24">Nenhum post publicado ainda.</p>
        ) : (
          <>
            {/* Post em destaque */}
            {featured && (
              <a href={`/blog/${featured.slug}`} className="group block mb-16">
                {featured.featured_image_url && (
                  <div className="overflow-hidden rounded-3xl mb-6">
                    <img
                      src={featured.featured_image_url}
                      alt={featured.title}
                      className="w-full h-72 object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <span className="rounded-full bg-classic-wine/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-classic-wine">
                    Destaque
                  </span>
                  <time className="text-xs text-classic-navy/40 font-medium">
                    {formatDate(featured.published_at ?? featured.created_at)}
                  </time>
                </div>
                <h2 className="text-3xl md:text-4xl font-medium leading-snug group-hover:text-classic-brown transition-colors">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="mt-3 text-classic-navy/60 text-lg leading-relaxed max-w-2xl line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-classic-wine">
                  Ler artigo →
                </span>
              </a>
            )}

            {/* Demais posts */}
            {rest.length > 0 && (
              <>
                <div className="border-t border-classic-navy/10 mb-12" />
                <div className="grid gap-8 md:grid-cols-2">
                  {rest.map((post) => (
                    <a
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col rounded-2xl border border-classic-navy/10 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-classic-brown/20 transition"
                    >
                      {post.featured_image_url && (
                        <div className="overflow-hidden h-44">
                          <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-col flex-1 p-6">
                        <time className="text-[11px] font-bold uppercase tracking-widest text-classic-brown/60">
                          {formatDate(post.published_at ?? post.created_at)}
                        </time>
                        <h3 className="mt-2 text-xl font-medium leading-snug group-hover:text-classic-brown transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-2 text-classic-navy/55 text-sm leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        <span className="mt-4 text-xs font-bold text-classic-wine">Ler artigo →</span>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
