import { Link } from "@tanstack/react-router";
import { useSettings } from "@/hooks/useSettings";

export function SiteNavBar() {
  const settings = useSettings();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-classic-navy border-b border-white/5">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-3">
          <span className="text-xl font-medium tracking-tight text-white">
            Dr. João Paulo <span className="font-serif italic font-normal">Neto</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-white/80">
          <Link to="/home" className="hover:text-white transition-colors">Início</Link>
          <Link to="/tratamentos" className="hover:text-white transition-colors">Tratamentos</Link>
          <Link to="/especialista" className="hover:text-white transition-colors">O Especialista</Link>
          <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/agendar"
            className="hidden sm:inline-flex rounded-full bg-classic-wine px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-md transition hover:bg-white hover:text-classic-navy hover:-translate-y-0.5"
          >
            Agendar Consulta
          </Link>
        </div>
      </div>
    </header>
  );
}
