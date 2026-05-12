import { createFileRoute } from "@tanstack/react-router";
import { SiteNavBar } from "@/components/SiteNavBar";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="min-h-screen bg-classic-light font-sans text-classic-navy selection:bg-classic-pastel selection:text-white">
      <SiteNavBar />
      <main className="pt-32 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-serif italic">Blog</h1>
          <p className="mt-4 text-classic-navy/60">Em breve...</p>
        </div>
      </main>
    </div>
  );
}
