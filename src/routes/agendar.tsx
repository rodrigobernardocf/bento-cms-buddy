import { createFileRoute } from "@tanstack/react-router";
import { SiteNavBar } from "@/components/SiteNavBar";
import { useSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/agendar")({
  component: AgendarPage,
});

function AgendarPage() {
  const settings = useSettings();

  return (
    <div className="min-h-screen bg-classic-light font-sans text-classic-navy selection:bg-classic-pastel selection:text-white">
      <SiteNavBar />
      <main className="pt-32 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-serif italic">Agendar Consulta</h1>
          <p className="mt-4 text-classic-navy/60 mb-8">Redirecionando ou clique abaixo para falar no WhatsApp.</p>
          <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-classic-pastel px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-classic-brown"
          >
            Falar pelo WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
}
