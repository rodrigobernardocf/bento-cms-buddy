import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Users,
  Youtube,
  Star,
  Clock,
  BookOpen,
  Award,
} from "lucide-react";
import doctorPortrait from "@/assets/doctor-portrait.jpg";
import cursomockup from "@/assets/mockup/curso-mockup.png";
import caso1Antes from "@/assets/casos/caso1-antes.jpg";
import caso1Depois from "@/assets/casos/caso1-depois.jpg";
import caso2Antes from "@/assets/casos/caso2-antes.jpg";
import caso2Depois from "@/assets/casos/caso2-depois.jpg";
import caso3Antes from "@/assets/casos/caso3-antes.jpg";
import caso3Depois from "@/assets/casos/caso3-depois.jpg";
import mod1 from "@/assets/modulos/mod1.jpg";
import mod2 from "@/assets/modulos/mod2.jpg";
import mod3 from "@/assets/modulos/mod3.jpg";
import mod4 from "@/assets/modulos/mod4.jpg";
import mod5 from "@/assets/modulos/mod5.jpg";
import mod6 from "@/assets/modulos/mod6.jpg";
import mod7 from "@/assets/modulos/mod7.jpg";
import mod8 from "@/assets/modulos/mod8.jpg";

export const Route = createFileRoute("/reabilitacao-objetiva-online")({
  component: CursoPage,
});

const HOTMART_URL = "https://pay.hotmart.com/U102790539J";

const modulos = [
  { img: mod1, num: "01", title: "Apresentação", sub: "Comece por aqui" },
  { img: mod2, num: "02", title: "Mentalidade Reabilitadora", sub: "A base do método" },
  { img: mod3, num: "03", title: "Diagnóstico", sub: "Protocolo completo" },
  { img: mod4, num: "04", title: "Planejamento", sub: "Casos reais hands-on" },
  { img: mod5, num: "05", title: "Precificação", sub: "Apresentação ao paciente" },
  { img: mod6, num: "06", title: "Gestão Clínica", sub: "Protocolos e documentação" },
  { img: mod7, num: "07", title: "Tratamento", sub: "3 casos do início ao fim" },
  { img: mod8, num: "08", title: "Proservação", sub: "Acompanhamento a longo prazo" },
];

const depoimentos = [
  {
    name: "Dra. Amanda Bellão",
    text: "O Curso é excelente! Contempla bem as necessidades de quem está iniciando na profissão, como também de quem já tem anos nela.",
    inicial: "A",
  },
  {
    name: "Dra. Ana Clara Soares",
    text: "Depois dele mudei minha dinâmica de planejamento e a forma como conduzo meus casos. A clareza do método faz toda diferença.",
    inicial: "A",
  },
  {
    name: "Dra. Lariane Raulino",
    text: "Curso transformador. Aumentou minha segurança para apresentar e fechar grandes tratamentos com previsibilidade.",
    inicial: "L",
  },
];

const faq = [
  {
    q: "Sou clínico geral. O curso funciona para mim?",
    a: "Sim. O método foi desenvolvido exatamente para o clínico geral que quer tratar reabilitações com segurança, sem depender de encaminhamentos desnecessários. A maioria dos alunos são clínicos gerais.",
  },
  {
    q: "Já fiz pós-graduação em prótese. Vale a pena?",
    a: "A pós te dá técnica. O método RO te dá um sistema — checklist, raciocínio clínico e protocolo do diagnóstico até a proservação. Muitos alunos com pós relatam que faltava exatamente isso: um fluxo organizado.",
  },
  {
    q: "Quanto tempo preciso dedicar por semana?",
    a: "O curso tem 30h de conteúdo e é 100% no seu ritmo. Não há turmas com prazo. Você assiste quando e onde quiser.",
  },
  {
    q: "Por quanto tempo tenho acesso?",
    a: "Acesso vitalício. Uma vez inscrito, o conteúdo é seu para sempre, incluindo todas as atualizações futuras.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Pelo cartão de crédito em até 12x ou à vista com desconto. A plataforma é a Hotmart, referência nacional em cursos online.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="cursor-pointer py-5 border-b border-classic-navy/10 last:border-0">
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-classic-navy text-sm md:text-base">{q}</span>
        <ChevronDown className={`size-5 text-classic-brown shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>
      {open && <p className="mt-3 text-classic-navy/60 text-sm leading-relaxed pr-6">{a}</p>}
    </div>
  );
}

function CursoPage() {
  return (
    <div className="min-h-screen bg-classic-light font-sans text-classic-navy">

      {/* ── HERO ── */}
      <section className="bg-classic-navy text-white pt-16 pb-24 px-6">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-classic-pastel mb-5">
              CONHEÇA O CURSO:
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight">
              Chega de improvisar em{" "}
              <span className="text-classic-pastel">reabilitação oral.</span>
            </h1>
            <p className="mt-5 text-lg text-white/70 leading-relaxed">
              Aprenda a conduzir qualquer caso com previsibilidade — do diagnóstico à proservação.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={HOTMART_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-classic-pastel px-8 py-4 text-sm font-bold text-classic-navy shadow-xl transition hover:opacity-90"
              >
                Quero minha vaga <ArrowRight className="size-4" />
              </a>
              <a
                href="#modulos"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-white/70 transition hover:bg-white/10"
              >
                Ver o conteúdo
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-white/40">
              <span className="flex items-center gap-1.5"><Clock className="size-4" /> 30h de conteúdo</span>
              <span className="flex items-center gap-1.5"><BookOpen className="size-4" /> 8 módulos</span>
              <span className="flex items-center gap-1.5"><Award className="size-4" /> </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-classic-pastel/10 blur-3xl" />
            <img
              src={doctorPortrait}
              alt="Dr. João Paulo Silva-Neto"
              className="relative rounded-3xl w-full object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="bg-classic-light py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-brown text-center mb-3">
            Quem já aplicou o método
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-classic-navy mb-12">
            O que os alunos dizem:
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {depoimentos.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-classic-navy/5 shadow-sm flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-classic-brown text-classic-brown" />
                  ))}
                </div>
                <p className="text-sm text-classic-navy/70 leading-relaxed italic flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-classic-navy/5">
                  <div className="size-9 rounded-full bg-classic-pastel/40 flex items-center justify-center text-classic-navy font-bold text-sm shrink-0">
                    {t.inicial}
                  </div>
                  <span className="text-sm font-semibold text-classic-navy">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── O PROBLEMA ── */}
      <section className="bg-classic-navy py-20 px-6 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-pastel text-center mb-3">
            Você se reconhece aqui?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center leading-tight mb-12">
            A maioria dos dentistas trata reabilitação{" "}
            <span className="text-classic-pastel/70">no improviso</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Aceita casos complexos e só percebe a dificuldade no meio do tratamento",
              "Planeja na consulta, sem um protocolo claro de diagnóstico",
              "Usa o modelo DVO: Dinheiro, Vontade e Osso — resultado imprevisível",
              "Sente que falta um sistema, não conhecimento técnico",
              "Tem dificuldade em apresentar e precificar reabilitações ao paciente",
              "Termina casos sem um protocolo definido de proservação",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <XCircle className="size-5 text-classic-pastel/50 shrink-0 mt-0.5" />
                <p className="text-sm text-white/70 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÓDULOS ── */}
      <section id="modulos" className="bg-classic-light py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-brown text-center mb-3">
            Conteúdo
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-classic-navy mb-3">
            8 módulos do início ao fim
          </h2>
          <p className="text-center text-classic-navy/50 text-sm mb-12">
            30 horas de conteúdo · Casos reais · Acesso vitalício
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modulos.map((mod) => (
              <div key={mod.num} className="group rounded-2xl overflow-hidden shadow-sm border border-classic-navy/5 bg-white">
                <div className="relative overflow-hidden">
                  <img
                    src={mod.img}
                    alt={mod.title}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-classic-navy/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {mod.num}
                  </span>
                </div>
                <div className="p-3">
                  <p className="font-bold text-classic-navy text-sm leading-tight">{mod.title}</p>
                  <p className="text-xs text-classic-navy/50 mt-0.5">{mod.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREVIEW DO CURSO ── */}
      <section className="bg-classic-navy py-20 px-6 text-white">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-classic-pastel mb-3">
              Dentro da plataforma
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              30 horas de conteúdo exclusivo
            </h2>
            <div className="space-y-4 text-white/60 text-sm leading-relaxed">
              <p>Aulas gravadas em alta qualidade com o Dr. João Paulo ensinando ao vivo o raciocínio clínico por trás de cada decisão.</p>
              <p>Disponível na Hotmart — assiste no celular, tablet ou computador, quando e onde quiser.</p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                { val: "30h", label: "de conteúdo" },
                { val: "8", label: "módulos" },
                { val: "∞", label: "acesso" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 py-4 px-2">
                  <p className="text-3xl font-black text-classic-pastel">{s.val}</p>
                  <p className="text-xs text-white/40 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={cursomockup}
              alt="Curso Reabilitação Objetiva — plataforma"
              className="w-full max-w-xs drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── CASOS CLÍNICOS ── */}
      <section className="bg-classic-light py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-brown text-center mb-3">
            Resultados reais
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-classic-navy mb-3">
            Casos tratados com o método
          </h2>
          <p className="text-center text-classic-navy/40 text-sm mb-12">
            Casos clínicos do Dr. João Paulo Silva-Neto · CRO/RN 3271
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { antes: caso1Antes, depois: caso1Depois, n: 1 },
              { antes: caso2Antes, depois: caso2Depois, n: 2 },
              { antes: caso3Antes, depois: caso3Depois, n: 3 },
            ].map((c) => (
              <div key={c.n} className="bg-white rounded-2xl overflow-hidden border border-classic-navy/5 shadow-sm">
                <div className="bg-classic-navy/5 px-4 py-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-classic-navy/40">Caso {c.n}</span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-classic-navy/10">
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-classic-navy/30 mb-2 text-center">Antes</p>
                    <img src={c.antes} alt={`Caso ${c.n} antes`} className="w-full rounded-lg object-contain" />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-classic-brown mb-2 text-center">Depois</p>
                    <img src={c.depois} alt={`Caso ${c.n} depois`} className="w-full rounded-lg object-contain" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTORIDADE ── */}
      <section className="bg-classic-navy py-20 px-6 text-white">
        <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-12 items-center">
          <img
            src={doctorPortrait}
            alt="Dr. João Paulo Silva-Neto"
            className="rounded-3xl w-full object-cover shadow-2xl opacity-90"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-classic-pastel mb-3">
              Seu professor
            </p>
            <h2 className="text-3xl font-bold mb-6">Dr. João Paulo Silva-Neto</h2>
            <div className="space-y-4 text-white/60 text-sm leading-relaxed">
              <p>Clínico, professor e pesquisador em Reabilitação Oral. Doutor em Prótese Dental pela <span className="text-white font-semibold">UNICAMP-SP</span> e Mestre em Reabilitação Oral pela <span className="text-white font-semibold">UFU-MG</span>.</p>
              <p>A base do método não é a teoria acadêmica — são <span className="text-white font-semibold">15 anos de prática clínica real</span>, com centenas de casos de reabilitação tratados.</p>
              <p>Desenvolveu a Reabilitação Objetiva para eliminar o improviso e dar ao dentista um sistema que funciona — do diagnóstico à proservação.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["UNICAMP-SP", "UFU-MG", "CRO/RN 3271", "15 anos de clínica"].map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/60">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PARA QUEM É ── */}
      <section className="bg-classic-light py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-classic-navy mb-12">
            Este curso é para você?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white border border-classic-navy/5 p-8 shadow-sm">
              <h3 className="font-bold text-classic-navy mb-5 flex items-center gap-2">
                <CheckCircle2 className="size-5 text-classic-brown" /> É para você se...
              </h3>
              <ul className="space-y-3">
                {[
                  "Você é clínico geral e quer tratar reabilitações com segurança",
                  "Já tem técnica mas falta um sistema organizado de trabalho",
                  "Quer fechar casos complexos sem depender de encaminhamentos",
                  "Busca previsibilidade de resultado, tempo e precificação",
                  "Quer se posicionar como referência em reabilitação na sua cidade",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-classic-navy/70">
                    <CheckCircle2 className="size-4 text-classic-brown shrink-0 mt-0.5" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white border border-classic-navy/5 p-8 shadow-sm">
              <h3 className="font-bold text-classic-navy mb-5 flex items-center gap-2">
                <XCircle className="size-5 text-classic-wine" /> Não é para você se...
              </h3>
              <ul className="space-y-3">
                {[
                  "Você quer apenas técnica sem entender o método completo",
                  "Não está disposto a rever sua forma atual de diagnosticar",
                  "Busca um curso teórico sem aplicação clínica real",
                  "Espera resultados sem dedicar tempo ao aprendizado",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-classic-navy/50">
                    <XCircle className="size-4 text-classic-wine shrink-0 mt-0.5" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── BÔNUS ── */}
      <section className="bg-classic-navy py-16 px-6 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-pastel mb-3">Incluído na inscrição</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-10">+ Bônus exclusivos</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-left">
              <Users className="size-7 text-classic-pastel mb-3" />
              <h3 className="font-bold mb-2">Comunidade RO 5.0</h3>
              <p className="text-sm text-white/50 leading-relaxed">Acesso à comunidade com profissionais que já aplicam o método, com plantão de dúvidas ativo.</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-left">
              <Youtube className="size-7 text-classic-pastel mb-3" />
              <h3 className="font-bold mb-2">Canal YouTube Exclusivo</h3>
              <p className="text-sm text-white/50 leading-relaxed">Mais de 15 aulas gravadas com conteúdo complementar ao curso.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFERTA ── */}
      <section className="bg-classic-light py-20 px-6">
        <div className="mx-auto max-w-md text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-brown mb-3">Investimento</p>
          <h2 className="text-3xl font-bold text-classic-navy mb-8">Reabilitação Objetiva Online</h2>
          <div className="bg-white rounded-3xl border border-classic-navy/10 shadow-xl p-8">
            <p className="text-sm text-classic-navy/30 line-through mb-1">De R$ 2.997,90</p>
            <p className="text-classic-navy/50 text-sm">por apenas</p>
            <p className="text-5xl font-black text-classic-navy mt-1">12x de R$ 103</p>
            <p className="text-classic-navy/40 text-sm mt-2">ou</p>
            <p className="text-2xl font-bold text-classic-navy mt-1 mb-6">R$ 997,90 à vista</p>
            <a
              href={HOTMART_URL}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-full bg-classic-navy py-4 text-center text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-classic-wine"
            >
              Quero minha vaga <ArrowRight className="inline size-4 ml-1" />
            </a>
            <ul className="mt-6 space-y-2 text-xs text-classic-navy/40 text-left">
              {["Acesso vitalício", "30h de conteúdo + bônus", "Comunidade com plantão de dúvidas", "Plataforma Hotmart"].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-classic-brown shrink-0" />{i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-classic-light pb-20 px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-classic-navy text-center mb-10">Dúvidas frequentes</h2>
          <div className="bg-white rounded-3xl border border-classic-navy/5 shadow-sm px-6">
            {faq.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-classic-navy py-20 px-6 text-white text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comece a tratar com previsibilidade</h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            30 horas de método, 8 módulos e casos reais para você nunca mais improvisar em reabilitação oral.
          </p>
          <a
            href={HOTMART_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-classic-pastel px-10 py-4 text-sm font-bold text-classic-navy shadow-xl transition hover:opacity-90"
          >
            Quero minha vaga <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      <footer className="bg-classic-navy border-t border-white/5 py-6 px-6 text-center text-xs text-white/20">
        © {new Date().getFullYear()} Dr. João Paulo Silva-Neto · CRO/RN 3271 · Reabilitação Objetiva
      </footer>
    </div>
  );
}
