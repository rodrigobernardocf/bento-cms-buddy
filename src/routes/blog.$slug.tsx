import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteNavBar } from "@/components/SiteNavBar";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  created_at: string;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  published_at: string | null;
  created_at: string;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }): Promise<{ post: Post; related: RelatedPost[] }> => {
    const [postRes, relatedRes] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(params.slug)}&status=eq.published&select=id,title,slug,content,excerpt,featured_image_url,published_at,created_at&limit=1`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      ),
      fetch(
        `${SUPABASE_URL}/rest/v1/posts?slug=neq.${encodeURIComponent(params.slug)}&status=eq.published&select=id,title,slug,published_at,created_at&order=published_at.desc&limit=3`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      ),
    ]);

    if (!postRes.ok) throw notFound();
    const posts: Post[] = await postRes.json();
    if (!posts.length) throw notFound();

    const related: RelatedPost[] = relatedRes.ok ? await relatedRes.json() : [];
    return { post: posts[0], related };
  },
  component: PostPage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function readingTime(content: string | null) {
  if (!content) return "1 min";
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min de leitura`;
}

function isImgUrl(text: string) {
  return /^https?:\/\/\S+\.(jpg|jpeg|png|webp|gif|avif|svg)(\?[^\s]*)?$/i.test(text.trim());
}

function PostPage() {
  const { post, related } = Route.useLoaderData();
  const paragraphs = (post.content ?? "")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-classic-light font-sans text-classic-navy">
      <SiteNavBar />

      {/* Hero do post */}
      <div className="bg-classic-navy pt-32 pb-12 px-6 text-white">
        <div className="mx-auto max-w-5xl">
          <a href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition mb-8">
            ← Blog
          </a>
          <div className="flex items-center gap-3 mb-4">
            <time className="text-xs font-semibold uppercase tracking-widest text-classic-pastel/70">
              {formatDate(post.published_at ?? post.created_at)}
            </time>
            <span className="text-white/20">·</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {readingTime(post.content)}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium leading-tight max-w-3xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-lg text-white/60 leading-relaxed max-w-2xl">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Imagem de capa */}
      {post.featured_image_url && (
        <div className="mx-auto max-w-5xl px-6 -mb-8 relative z-10" style={{ marginTop: "-2rem" }}>
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full rounded-3xl object-cover shadow-xl"
            style={{ maxHeight: "420px" }}
          />
        </div>
      )}

      {/* Layout 2 colunas: artigo + sidebar */}
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Conteúdo do artigo */}
          <article className="flex-1 min-w-0">
            <div className="space-y-6 text-[17px] leading-[1.85] text-classic-navy/80">
              {paragraphs.map((p, i) =>
                isImgUrl(p) ? (
                  <img key={i} src={p.trim()} alt="" className="w-full rounded-2xl shadow-md" />
                ) : p.startsWith("## ") ? (
                  <h2 key={i} className="text-2xl font-semibold text-classic-navy mt-10 mb-2 leading-snug">
                    {p.slice(3)}
                  </h2>
                ) : (
                  <p key={i}>{p}</p>
                )
              )}
            </div>

            {/* CTA inline no fim do artigo */}
            <div className="mt-16 rounded-3xl bg-classic-navy px-8 py-10 text-white text-center">
              <p className="text-lg font-medium leading-snug max-w-md mx-auto">
                Quer aplicar o checklist completo de diagnóstico do Método RAIZ no seu consultório?
                Conheça a Reabilitação Objetiva.
              </p>
              <a
                href="/reabilitacao-objetiva-online"
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-classic-wine px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition hover:bg-classic-brown"
              >
                Conhecer a Reabilitação Objetiva →
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">

            {/* Card CTA sticky */}
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl bg-classic-navy p-6 text-white">
                <p className="text-[11px] font-bold uppercase tracking-widest text-classic-pastel/70 mb-3">
                  Método RAIZ
                </p>
                <p className="text-sm font-medium leading-snug">
                  Aprenda a conduzir reabilitações complexas com previsibilidade e protocolo.
                </p>
                <a
                  href="/reabilitacao-objetiva-online"
                  className="mt-4 block text-center rounded-xl bg-classic-wine px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-classic-brown"
                >
                  Conhecer o Método →
                </a>
              </div>

              <div className="rounded-2xl bg-white border border-classic-navy/10 p-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-classic-navy/40 mb-3">
                  Agendar consulta
                </p>
                <p className="text-sm text-classic-navy/70 leading-snug">
                  Dr. João Paulo Silva-Neto — Reabilitação Oral e Estética.
                </p>
                <a
                  href="/agendar"
                  className="mt-4 block text-center rounded-xl bg-classic-pastel px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-classic-navy"
                >
                  Agendar Avaliação
                </a>
              </div>

              {/* Outros artigos */}
              {related.length > 0 && (
                <div className="rounded-2xl bg-white border border-classic-navy/10 p-6">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-classic-navy/40 mb-4">
                    Outros artigos
                  </p>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <a
                        key={r.id}
                        href={`/blog/${r.slug}`}
                        className="block group"
                      >
                        <time className="text-[10px] font-semibold uppercase tracking-widest text-classic-brown/60">
                          {formatDate(r.published_at ?? r.created_at)}
                        </time>
                        <p className="mt-1 text-sm font-medium leading-snug group-hover:text-classic-brown transition-colors line-clamp-2">
                          {r.title}
                        </p>
                      </a>
                    ))}
                  </div>
                  <a href="/blog" className="mt-5 block text-center text-xs font-bold text-classic-wine hover:underline">
                    Ver todos os artigos →
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
