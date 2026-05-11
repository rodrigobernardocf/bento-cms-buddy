import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/hooks/usePosts";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: PostDetail,
});

function PostDetail() {
  const { slug } = Route.useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Post;
    },
  });

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando artigo...</div>;
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Artigo não encontrado.</p>
        <Link to="/blog" className="mt-6 text-brand font-bold underline">Voltar para o blog</Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background text-foreground pb-20">
      {/* Featured Image Banner */}
      {post.featured_image_url && (
        <div className="relative h-[40vh] w-full overflow-hidden sm:h-[60vh]">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6">
        <header className={post.featured_image_url ? "-mt-20 relative z-10" : "pt-20"}>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-md px-4 py-2 text-sm font-bold shadow-sm hover:bg-brand hover:text-brand-foreground transition mb-8"
          >
            <ArrowLeft className="size-4" /> Todos os artigos
          </Link>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
            {post.title}
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border py-6">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              {new Date(post.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              5 min de leitura
            </div>
            <button className="flex items-center gap-2 hover:text-brand transition ml-auto">
              <Share2 className="size-4" /> Compartilhar
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="mt-12 prose prose-lg dark:prose-invert max-w-none prose-img:rounded-[2rem] prose-a:text-brand">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p className="italic text-muted-foreground">Este artigo não possui conteúdo ainda.</p>
          )}
        </div>

        {/* Footer info */}
        <footer className="mt-20 rounded-[32px] bg-secondary p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="size-20 rounded-full bg-brand/20 flex items-center justify-center text-3xl font-bold text-brand">
              JP
            </div>
            <div>
              <h4 className="text-xl font-bold">Dr. João Paulo Neto</h4>
              <p className="text-muted-foreground mt-1">
                Reabilitador Oral · Mentor de Reabilitação Objetiva. Compartilhando conhecimento para elevar o nível da odontologia.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
