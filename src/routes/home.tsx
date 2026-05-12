import { createFileRoute } from "@tanstack/react-router";
import { SiteNavBar } from "@/components/SiteNavBar";
import doctorPortrait from "@/assets/doctor-portrait.jpg";
import clinicInterior from "@/assets/clinic-interior.webp";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-classic-light font-sans text-classic-navy selection:bg-classic-pastel selection:text-white">
      <SiteNavBar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-24 md:py-32">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 items-center relative z-10">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-classic-brown/80">
                Referência em Prótese & Implantes
              </span>
              <h1 className="mt-4 text-5xl md:text-7xl font-medium tracking-tight text-classic-navy leading-[1.1]">
                A Reabilitação <br />
                <span className="font-serif italic text-classic-pastel text-6xl md:text-8xl">Objetiva</span>
              </h1>
              <p className="mt-6 text-lg text-classic-navy/70 max-w-lg leading-relaxed">
                Sua saúde bucal em mãos de quem une o rigor acadêmico da UNICAMP com 15 anos de excelência clínica.
              </p>
              <div className="mt-10">
                <a
                  href="/agendar"
                  className="inline-flex items-center gap-3 rounded-full bg-classic-pastel px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-classic-brown"
                >
                  Agendar Avaliação &rarr;
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-[3rem] bg-classic-pastel/20">
                <img
                  src={clinicInterior}
                  alt="Clínica"
                  className="h-full w-full object-cover grayscale mix-blend-multiply opacity-80"
                />
              </div>
              <div className="absolute top-8 right-8 rounded-2xl bg-white p-5 shadow-xl">
                <div className="flex flex-col gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-classic-navy mb-2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
                  <span className="text-xs font-bold text-classic-navy">Implantes & Estética</span>
                  <span className="text-[10px] text-classic-navy/60">Avançada</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Especialidades Section (Dark) */}
        <section className="bg-classic-navy py-24 text-white">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
              Especialidades <span className="font-serif italic text-classic-pastel">Clínicas</span>
            </h2>
            <div className="mt-16 grid gap-6 md:grid-cols-3 text-left">
              {[
                { title: "Prótese Dental", desc: "Restaurando a função e harmonia com tecnologia alemã." },
                { title: "Implantes de Carga Imediata", desc: "Novos dentes no mesmo dia com segurança total." },
                { title: "Facetas de Porcelana", desc: "O design do seu novo sorriso planejado digitalmente." }
              ].map((item, i) => (
                <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-6 text-classic-pastel"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                  <h3 className="text-xl font-serif italic text-white">{item.title}</h3>
                  <p className="mt-3 text-sm text-white/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sobre Section */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-classic-navy">
                Dr. João Paulo <span className="font-serif italic text-classic-brown">Neto</span>
              </h2>
              <p className="mt-6 text-lg text-classic-navy/80 leading-relaxed">
                Doutor em Prótese Dental pela <strong>Unicamp</strong> e Mestre em Reabilitação Oral pela <strong>UFU</strong>. Com 15 anos de excelência clínica, unindo o rigor acadêmico com a praticidade necessária para o dia a dia do cirurgião-dentista e o bem-estar do paciente.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-8">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-classic-navy/50">CRO / RN</span>
                  <p className="mt-1 text-sm font-serif text-classic-navy">3271</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-classic-navy/50">Base de Ensino</span>
                  <p className="mt-1 text-sm font-serif italic text-classic-navy">Prática Clínica Real</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full max-w-md">
              <div className="aspect-square rounded-full overflow-hidden border-[10px] border-classic-navy">
                <img src={doctorPortrait} alt="Dr. João Paulo" className="h-full w-full object-cover grayscale mix-blend-multiply opacity-90" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-white">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-5xl md:text-6xl font-serif italic text-classic-navy">Vamos Conversar?</h2>
            <p className="mt-4 text-lg text-classic-navy/60">Seja para um novo sorriso ou uma nova carreira acadêmica, estamos aqui.</p>
            
            <div className="mt-16 grid gap-6 md:grid-cols-2">
              <div className="flex flex-col items-center justify-center rounded-[3rem] border border-classic-navy/10 bg-classic-light p-12 transition hover:shadow-lg">
                <div className="rounded-full bg-green-100 p-4 text-green-600 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <h3 className="text-2xl font-serif italic text-classic-navy">Agendamento Clínico</h3>
                <p className="mt-2 text-sm text-classic-navy/60">Consultas presenciais para pacientes em Natal/RN</p>
                <a href="/agendar" className="mt-8 text-[11px] font-bold uppercase tracking-widest text-classic-navy transition hover:text-classic-brown">Falar com Equipe</a>
              </div>

              <div className="flex flex-col items-center justify-center rounded-[3rem] bg-classic-navy p-12 text-white transition hover:bg-classic-navy/90 shadow-xl">
                <div className="mb-6 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 className="text-2xl font-serif italic">Parcerias & Cursos</h3>
                <p className="mt-2 text-sm text-white/60">Informações sobre mentorias e cursos para turmas fechadas</p>
                <a href="https://chat.whatsapp.com/HT7tVn2LZku1EZ436IGqhY?mode=gi_t" target="_blank" rel="noreferrer" className="mt-8 text-[11px] font-bold uppercase tracking-widest text-white transition hover:text-classic-pastel">Entrar em Contato</a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-classic-navy/10 py-8 px-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-classic-navy/40">
          © {new Date().getFullYear()} Dr. João Paulo Silva-Neto. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
