import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteNavBar } from "@/components/SiteNavBar";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: PostPage,
});

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

function PostPage() {
  const { slug } = Route.useParams();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, content, excerpt, featured_image_url, published_at, created_at")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data as Post;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-classic-light font-sans text-classic-navy">
        <SiteNavBar />
        <main className="pt-32 pb-24 px-6 text-center text-classic-navy/40">Carregando...</main>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-classic-light font-sans text-classic-navy">
        <SiteNavBar />
        <main className="pt-32 pb-24 px-6 text-center">
          <p className="text-classic-navy/60">Post não encontrado.</p>
          <Link to="/blog" className="mt-4 inline-block text-sm text-classic-brown underline">
            Voltar ao blog
          </Link>
        </main>
      </div>
    );
  }

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

          {post.featured_image_url && (
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="mt-8 w-full rounded-2xl object-cover aspect-video"
            />
          )}

          <div className="mt-10 space-y-5 text-lg leading-relaxed text-classic-navy/80">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* CTA */}
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
