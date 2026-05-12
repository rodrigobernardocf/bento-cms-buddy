import { Link } from "@tanstack/react-router";
import { useSettings } from "@/hooks/useSettings";

export function SiteNavBar() {
  const settings = useSettings();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-classic-light/90 backdrop-blur-md border-b border-black/5">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-3">
          <span className="text-xl font-medium tracking-tight text-classic-navy">
            Dr. João Paulo <span className="font-serif italic font-normal">Neto</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-classic-navy/80">
          <Link to="/home" className="hover:text-classic-brown transition-colors">Início</Link>
          <Link to="/tratamentos" className="hover:text-classic-brown transition-colors">Tratamentos</Link>
          <Link to="/especialista" className="hover:text-classic-brown transition-colors">O Especialista</Link>
          <Link to="/blog" className="hover:text-classic-brown transition-colors">Blog</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/agendar"
            className="hidden sm:inline-flex rounded-full bg-classic-pastel px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-classic-brown"
          >
            Agendar Consulta
          </Link>
        </div>
      </div>
    </header>
  );
}
