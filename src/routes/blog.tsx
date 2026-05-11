import { createFileRoute, Link } from "@tanstack/react-router";
import { usePosts } from "@/hooks/usePosts";
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  component: BlogList,
});

function BlogList() {
  const { data, isLoading } = usePosts({ status: "published", pageSize: 12 });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand transition mb-8">
            <ArrowLeft className="size-4" /> Voltar para o início
          </Link>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog & Artigos</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Conteúdo exclusivo sobre Reabilitação Oral e Odontologia.
          </p>
        </header>

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-video rounded-3xl bg-secondary" />
                <div className="h-6 w-3/4 rounded-lg bg-secondary" />
                <div className="h-4 w-1/2 rounded-lg bg-secondary" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {data?.posts.map((post) => (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group block space-y-4"
              >
                <div className="aspect-video overflow-hidden rounded-[2rem] bg-secondary shadow-sm transition group-hover:shadow-md">
                  {post.featured_image_url ? (
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="size-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div className="space-y-2 px-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(post.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight transition group-hover:text-brand">
                    {post.title}
                  </h2>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt || "Clique para ler o artigo completo..."}
                  </p>
                  <div className="pt-2 text-sm font-bold text-brand flex items-center gap-1">
                    Ler mais <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && data?.posts.length === 0 && (
          <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-[32px]">
            Nenhum artigo publicado ainda.
          </div>
        )}
      </div>
    </main>
  );
}
