import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNavBar } from "@/components/SiteNavBar";
import { ArrowLeft } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  published_at: string | null;
  created_at: string;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }): Promise<{ post: Post }> => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(params.slug)}&status=eq.published&select=id,title,slug,content,excerpt,published_at,created_at&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    if (!res.ok) throw notFound();
    const data: Post[] = await res.json();
    if (!data.length) throw notFound();
    return { post: data[0] };
  },
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const paragraphs = (post.content ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    <div className="min-h-screen bg-classic-light font-sans text-classic-navy selection:bg-classic-pastel selection:text-white">
      <SiteNavBar />
      <main className="pt-32 pb-24 px-6">
        <article className="mx-auto max-w-2xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-classic-navy/50 hover:text-classic-navy transition-colors"
          >
            <ArrowLeft className="size-4" /> Blog
          </Link>

          <time className="mt-8 block text-xs font-semibold uppercase tracking-widest text-classic-brown/70">
            {new Date(post.published_at ?? post.created_at).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </time>

          <h1 className="mt-4 text-4xl md:text-5xl font-medium leading-tight">
            {post.title}
          </h1>

          <div className="mt-10 space-y-5 text-lg leading-relaxed text-classic-navy/80">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-16 rounded-3xl bg-classic-navy px-8 py-10 text-white text-center">
            <p className="text-lg font-medium leading-snug max-w-md mx-auto">
              Quer aplicar o checklist completo de diagnóstico do Método RAIZ no seu consultório?
              Conheça a Reabilitação Objetiva.
            </p>
            <a
              href="/reabilitacao-objetiva-online"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-classic-wine px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition hover:bg-classic-brown"
            >
              Conhecer a Reabilitação Objetiva &rarr;
            </a>
          </div>
        </article>
      </main>
    </div>
  );
}
