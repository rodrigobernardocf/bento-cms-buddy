import { createFileRoute, Link } from "@tanstack/react-router";
import { Youtube, Instagram, MapPin, Calendar, ExternalLink, ArrowRight } from "lucide-react";
import { useBentoBlocks, BentoBlock } from "@/hooks/useBentoBlocks";
import { useSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/")({
  component: BentoLanding,
});

function BentoLanding() {
  const { blocks, isLoading: loadingBlocks } = useBentoBlocks();
  const { profile, isLoading: loadingProfile } = useSettings();

  const isLoading = loadingBlocks || loadingProfile;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
        {/* Header */}
        <header className="flex flex-col items-start gap-5">
          <div className="size-32 overflow-hidden rounded-full ring-4 ring-card shadow-lg bg-secondary">
            {profile?.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                width={768}
                height={768}
                className="size-full object-cover"
              />
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {profile?.name || "Carregando..."}
          </h1>
          <p className="text-base text-muted-foreground">
            {profile?.bio}
          </p>
        </header>

        {/* Bento grid */}
        <section className="mt-8 grid grid-cols-2 gap-4">
          {isLoading && (
            <div className="col-span-2 py-20 text-center text-muted-foreground">
              Carregando sua grade...
            </div>
          )}
          
          {blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </section>

        <footer className="mt-12 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span>© {new Date().getFullYear()} Dr. João Paulo Neto</span>
            <Link to="/blog" className="hover:underline font-bold text-brand">Blog</Link>
          </div>
          <Link to="/login" className="hover:underline">Acesso restrito</Link>
        </footer>
      </div>
    </main>
  );
}

function BlockRenderer({ block }: { block: BentoBlock }) {
  const isLarge = block.col_span === 2;
  
  const baseStyles = "rounded-3xl p-5 transition hover:scale-[1.02] shadow-sm overflow-hidden relative";
  const colSpanClass = isLarge ? "col-span-2" : "col-span-1";
  
  const bgStyle = block.background_config.type === "color" 
    ? { backgroundColor: block.background_config.value }
    : block.background_config.type === "gradient"
    ? { background: block.background_config.value }
    : {};

  if (block.block_type === "link" && isLarge) {
    return (
      <a
        href={block.link_url || "#"}
        className={`${colSpanClass} group relative overflow-hidden rounded-3xl p-6 text-brand-foreground shadow-md transition hover:shadow-xl`}
        style={bgStyle}
      >
        <div className="absolute -right-10 top-0 h-full w-1/2 bg-brand opacity-90" />
        <div className="absolute right-6 top-6 size-16 rounded-full bg-card/95" />
        <div className="absolute left-6 top-6 flex gap-2">
          <span className="size-10 rounded-xl bg-card/95" />
          <span className="size-10 rounded-xl bg-brand" />
        </div>
        <div className="relative z-10 mt-24">
          <h2 className="text-3xl font-bold leading-none">
            {block.title?.split(" ")[0]}<br />
            <span className="font-extrabold tracking-tight">{block.title?.split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="mt-2 text-sm opacity-90">{block.subtitle}</p>
          <p className="mt-3 max-w-sm text-sm opacity-80">
            {block.content}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-success shadow-sm transition group-hover:gap-3">
            Quero fazer parte! <ArrowRight className="size-4" />
          </span>
        </div>
      </a>
    );
  }

  if (block.block_type === "youtube") {
    return (
      <a
        href={block.link_url || "https://youtube.com"}
        target="_blank"
        rel="noreferrer"
        className={`${baseStyles} ${colSpanClass}`}
        style={bgStyle}
      >
        <div className="flex size-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
          <Youtube className="size-7" />
        </div>
        <p className="mt-12 font-bold">{block.title}</p>
        <span className="mt-3 inline-block rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-foreground">
          {block.subtitle || "Inscreva-se"}
        </span>
      </a>
    );
  }

  if (block.block_type === "instagram") {
    return (
      <a
        href={block.link_url || "https://instagram.com"}
        target="_blank"
        rel="noreferrer"
        className={`${baseStyles} ${colSpanClass}`}
        style={bgStyle}
      >
        <div
          className="flex size-14 items-center justify-center rounded-2xl text-brand-foreground"
          style={{ background: "var(--gradient-insta)" }}
        >
          <Instagram className="size-7" />
        </div>
        <p className="mt-12 text-sm text-muted-foreground">{block.title}</p>
        <span className="mt-3 inline-block rounded-full bg-[oklch(0.6_0.18_250)] px-5 py-2 text-sm font-semibold text-brand-foreground">
          {block.subtitle || "Seguir"}
        </span>
      </a>
    );
  }

  if (block.block_type === "image") {
    return (
      <a
        href={block.link_url || "#"}
        className={`${colSpanClass} group relative h-56 overflow-hidden rounded-3xl shadow-md transition hover:shadow-xl`}
      >
        <img
          src={block.image_url || "/assets/clinic-interior.jpg"}
          alt={block.title || "Image"}
          width={1280}
          height={768}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-card px-5 py-3 text-sm font-bold shadow-md">
          <Calendar className="size-4" /> {block.title}
        </span>
      </a>
    );
  }

  if (block.block_type === "map") {
    return (
      <div className={`${colSpanClass} rounded-3xl p-6`} style={bgStyle}>
        <h3 className="text-2xl font-bold">{block.title}</h3>
        <a
          href={block.link_url || "https://maps.google.com"}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-start gap-3 rounded-2xl bg-card p-4 transition hover:shadow-md"
        >
          <MapPin className="mt-0.5 size-5 text-brand" />
          <div className="flex-1">
            <p className="font-semibold">{block.subtitle}</p>
            <p className="text-sm text-muted-foreground">{block.content}</p>
          </div>
          <ExternalLink className="size-4 text-muted-foreground" />
        </a>
      </div>
    );
  }

  return null;
}
