import { createFileRoute, Link } from "@tanstack/react-router";
import { Youtube, Instagram, MapPin, Calendar, ExternalLink, ArrowRight } from "lucide-react";
import doctorPortrait from "@/assets/doctor-portrait.jpg";
import clinicInterior from "@/assets/clinic-interior.webp";
import reabilitacaoBanner from "@/assets/reabilitacao-objetiva-banner.png";

import { useSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/")({
  component: BentoLanding,
});

function BentoLanding() {
  const settings = useSettings();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
        {/* Header */}
        <header className="flex flex-col items-start gap-5">
          <div className="size-32 overflow-hidden rounded-full ring-4 ring-card shadow-lg">
            <img
              src={doctorPortrait}
              alt={settings.siteName}
              width={768}
              height={768}
              className="size-full py-0 my-0 object-contain px-0 text-xs mx-0"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-left">{settings.siteName}</h1>
          <p className="text-base text-muted-foreground">
            {settings.siteDescription}
          </p>
        </header>

        {/* Bento grid */}
        <section className="mt-8 grid grid-cols-2 gap-4">
          {/* Featured course banner */}
          <a
            href="https://chat.whatsapp.com/HT7tVn2LZku1EZ436IGqhY?mode=gi_t"
            target="_blank"
            rel="noreferrer"
            className="col-span-2 group relative h-64 overflow-hidden rounded-3xl shadow-md transition hover:shadow-xl"
          >
            <img
              src={reabilitacaoBanner}
              alt="Reabilitação Objetiva"
              className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="relative z-10 flex h-full flex-col justify-end p-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-success shadow-sm transition group-hover:gap-3">
                Quero fazer parte! <ArrowRight className="size-4" />
              </span>
            </div>
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/channel/UCSpW0K7xSnmNuwTlNqEFLTA"
            target="_blank"
            rel="noreferrer"
            className="rounded-3xl bg-brand-soft p-5 transition hover:scale-[1.02]"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
              <Youtube className="size-7" />
            </div>
            <p className="mt-12 font-bold leading-tight">YouTube</p>
            <span className="mt-3 inline-block rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-foreground">
              Inscreva-se
            </span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/drjoaopaulosneto"
            target="_blank"
            rel="noreferrer"
            className="rounded-3xl bg-secondary p-5 transition hover:scale-[1.02]"
          >
            <div
              className="flex size-14 items-center justify-center rounded-2xl text-brand-foreground"
              style={{ background: "var(--gradient-insta)" }}
            >
              <Instagram className="size-7" />
            </div>
            <p className="mt-12 text-sm text-muted-foreground">@drjoaopaulosneto</p>
            <span className="mt-3 inline-block rounded-full bg-[oklch(0.6_0.18_250)] px-5 py-2 text-sm font-semibold text-brand-foreground">
              Seguir
            </span>
          </a>

          {/* Clinic / agendar */}
          <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="col-span-2 group relative h-56 overflow-hidden rounded-3xl shadow-md transition hover:shadow-xl"
          >
            <img
              src={clinicInterior}
              alt="Clínica Scientiart Odontologia"
              width={1280}
              height={768}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-card px-5 py-3 text-sm font-bold shadow-md">
              <Calendar className="size-4" /> Agendar consulta!
            </span>
          </a>

          {/* Localização */}
          <div className="col-span-2 rounded-3xl bg-secondary p-6">
            <h3 className="text-2xl font-bold">Localização</h3>
            <a
              href="https://share.google/0KIFX3jzkqiqjuaSA"
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-start gap-3 rounded-2xl bg-card p-4 transition hover:shadow-md"
            >
              <MapPin className="mt-0.5 size-5 text-brand" />
              <div className="flex-1">
                <p className="font-semibold">Scientiart Odontologia</p>
                <p className="text-sm text-muted-foreground">Clínica Odontológica · Parnamirim, RN</p>
              </div>
              <ExternalLink className="size-4 text-muted-foreground" />
            </a>
          </div>
        </section>

        <footer className="mt-12 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} {settings.siteName}</span>
          <Link to="/login" className="hover:underline">Acesso restrito</Link>
        </footer>
      </div>
    </main>
  );
}
