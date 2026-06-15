import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Brain,
  Search,
  ClipboardList,
  DollarSign,
  Settings,
  Stethoscope,
  ChevronDown,
  Users,
  Youtube,
  Star,
  Clock,
  BookOpen,
} from "lucide-react";
import doctorPortrait from "@/assets/doctor-portrait.jpg";
import caso1Antes from "@/assets/casos/caso1-antes.jpg";
import caso1Depois from "@/assets/casos/caso1-depois.jpg";
import caso2Antes from "@/assets/casos/caso2-antes.jpg";
import caso2Depois from "@/assets/casos/caso2-depois.jpg";
import caso3Antes from "@/assets/casos/caso3-antes.jpg";
import caso3Depois from "@/assets/casos/caso3-depois.jpg";

export const Route = createFileRoute("/reabilitacao-objetiva-online")({
  component: CursoPage,
});

const HOTMART_URL = "https://pay.hotmart.com/U102790539J";

function BeforeAfterSlider({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const [position, setPosition] = useState(50);

  return (
    <div
      className="relative overflow-hidden rounded-2xl select-none"
      style={{ aspectRatio: "4/3" }}
    >
      <img
        src={after}
        alt="Depois"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <img
        src={before}
        alt="Antes"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.4)] pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-9 rounded-full bg-white shadow-lg flex items-center justify-center gap-0.5">
          <span className="text-[10px] font-black text-classic-navy">◀▶</span>
        </div>
      </div>
      <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-semibold pointer-events-none">
        Antes
      </span>
      <span className="absolute top-3 right-3 bg-white/90 text-classic-navy text-xs px-2.5 py-1 rounded-full font-semibold pointer-events-none">
        Depois
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
      />
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left border-b border-classic-navy/10 py-5 group"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-classic-navy text-base group-hover:text-classic-brown transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`size-5 text-classic-brown shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <p className="mt-3 text-classic-navy/70 text-sm leading-relaxed pr-8">
          {answer}
        </p>
      )}
    </button>
  );
}

const modules = [
  {
    icon: Brain,
    number: "01",
    title: "Mentalidade Reabilitadora",
    desc: "A base que nenhum curso de técnica ensina. O que separa o dentista que improvisa do que planeja com previsibilidade.",
  },
  {
    icon: Search,
    number: "02",
    title: "Diagnóstico",
    desc: "Protocolo completo de diagnóstico: estética, função, sinais vitais e documentação fotográfica. 12 aulas.",
  },
  {
    icon: ClipboardList,
    number: "03",
    title: "Planejamento",
    desc: "Mãos na massa com 3 casos reais do início ao fim. Você aprende planejando, não apenas assistindo.",
  },
  {
    icon: DollarSign,
    number: "04",
    title: "Precificação e Apresentação",
    desc: "Como calcular sua hora clínica, precificar reabilitações e apresentar o plano de tratamento ao paciente.",
  },
  {
    icon: Settings,
    number: "05",
    title: "Gestão Clínica",
    desc: "Protocolos de atendimento, documentação e materiais prontos para implementar no seu consultório.",
  },
  {
    icon: Stethoscope,
    number: "06",
    title: "Tratamento e Proservação",
    desc: "Execução de 3 casos completos e protocolo de acompanhamento a longo prazo — fechando o ciclo do método.",
  },
];

const faq = [
  {
    question: "Sou clínico geral. O curso funciona para mim?",
    answer:
      "Sim. O método foi desenvolvido exatamente para o clínico geral que quer tratar reabilitações com segurança, sem depender de encaminhamentos desnecessários. A maioria dos alunos são clínicos gerais.",
  },
  {
    question: "Já fiz pós-graduação em prótese. Vale a pena?",
    answer:
      "A pós te dá técnica. O método RO te dá um sistema — checklist, raciocínio clínico e protocolo do diagnóstico até a proservação. Muitos alunos com pós relatam que faltava exatamente isso: um fluxo organizado.",
  },
  {
    question: "Quanto tempo preciso dedicar por semana?",
    answer:
      "O curso tem 30h de conteúdo e é 100% no seu ritmo. Não há turmas com prazo. Você assiste quando e onde quiser.",
  },
  {
    question: "Por quanto tempo tenho acesso?",
    answer:
      "Acesso vitalício. Uma vez inscrito, o conteúdo é seu para sempre, incluindo todas as atualizações futuras.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "Pelo cartão de crédito em até 12x ou à vista com desconto. A plataforma é a Hotmart, referência nacional em cursos online.",
  },
];

function CursoPage() {
  return (
    <div className="min-h-screen bg-classic-light font-sans text-classic-navy selection:bg-classic-pastel/50">
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="bg-classic-navy text-white pt-16 pb-20 px-6 overflow-hidden">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-classic-pastel mb-4">
              Curso Online · Dr. João Paulo Silva-Neto
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight">
              Chega de improvisar em{" "}
              <span className="text-classic-pastel">reabilitação oral.</span>
            </h1>
            <p className="mt-4 text-xl text-white/80 leading-relaxed font-light">
              Aprenda a conduzir qualquer caso com previsibilidade.
            </p>
            <p className="mt-4 text-white/60 leading-relaxed text-sm max-w-md">
              O método que transforma diagnóstico, planejamento e tratamento em
              um sistema que você repete — com segurança e resultado.
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
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Ver o conteúdo
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-white/50">
              <span className="flex items-center gap-1.5"><Clock className="size-4" /> 30h de conteúdo</span>
              <span className="flex items-center gap-1.5"><BookOpen className="size-4" /> 6 módulos</span>
              <span className="flex items-center gap-1.5"><Star className="size-4" /> Acesso vitalício</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-classic-pastel/10 blur-2xl" />
            <img
              src={doctorPortrait}
              alt="Dr. João Paulo Silva-Neto"
              className="relative rounded-3xl w-full object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── O PROBLEMA ────────────────────────────────────────────── */}
      <section className="bg-classic-light py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-brown text-center mb-3">
            Você se reconhece aqui?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-classic-navy leading-tight mb-12">
            A maioria dos dentistas trata reabilitação{" "}
            <span className="text-classic-wine">no improviso</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Aceita casos complexos e só percebe a dificuldade no meio do tratamento",
              "Planeja na consulta, sem um protocolo claro de diagnóstico",
              "Usa o modelo DVO: Dinheiro, Vontade e Osso — e o resultado é imprevisível",
              "Sente que falta um sistema, não conhecimento técnico",
              "Tem dificuldade em apresentar e precificar reabilitações para o paciente",
              "Termina casos sem saber exatamente como vai fazer a proservação",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-classic-navy/5"
              >
                <XCircle className="size-5 text-classic-wine shrink-0 mt-0.5" />
                <p className="text-sm text-classic-navy/80 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── O MÉTODO ──────────────────────────────────────────────── */}
      <section className="bg-classic-navy py-20 px-6 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-pastel mb-3">
            A solução
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
            O método Reabilitação Objetiva
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed mb-12">
            Desenvolvido por 15 anos de prática clínica real, o método RO é um
            sistema que elimina o improviso e organiza seu raciocínio — do
            primeiro diagnóstico até o acompanhamento a longo prazo.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "Contra o modelo DVO",
                desc: 'Dinheiro, Vontade e Osso é o modelo que gera casos imprevisíveis. O método RO substitui isso por checklists e protocolos.',
              },
              {
                title: "Regra do Semáforo",
                desc: "Um sistema visual para classificar e priorizar decisões clínicas. Você sempre sabe o que fazer — e por quê.",
              },
              {
                title: "O Dentista Guardião",
                desc: "Você não apenas trata. Você guia o paciente com previsibilidade, construindo confiança e tratamentos duradouros.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white/5 border border-white/10 p-6"
              >
                <h3 className="font-bold text-classic-pastel mb-2">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUEM É ───────────────────────────────────────────── */}
      <section className="bg-classic-light py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-classic-navy mb-12">
            Este curso é para você?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white border border-classic-navy/5 p-8 shadow-sm">
              <h3 className="font-bold text-classic-navy mb-4 flex items-center gap-2">
                <CheckCircle2 className="size-5 text-classic-brown" /> É para você se...
              </h3>
              <ul className="space-y-3">
                {[
                  "Você é clínico geral e quer tratar reabilitações com segurança",
                  "Já tem técnica mas falta um sistema organizado de trabalho",
                  "Quer fechar casos mais complexos sem depender de encaminhamentos",
                  "Busca previsibilidade — de resultado, de tempo e de precificação",
                  "Quer se posicionar como referência em reabilitação oral na sua cidade",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-classic-navy/80">
                    <CheckCircle2 className="size-4 text-classic-brown shrink-0 mt-0.5" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white border border-classic-navy/5 p-8 shadow-sm">
              <h3 className="font-bold text-classic-navy mb-4 flex items-center gap-2">
                <XCircle className="size-5 text-classic-wine" /> Não é para você se...
              </h3>
              <ul className="space-y-3">
                {[
                  "Você quer apenas técnica de prótese sem entender o método completo",
                  "Não está disposto a rever sua forma atual de diagnosticar e planejar",
                  "Busca um curso teórico sem aplicação clínica real",
                  "Espera resultados sem dedicar tempo ao aprendizado",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-classic-navy/60">
                    <XCircle className="size-4 text-classic-wine shrink-0 mt-0.5" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CASOS CLÍNICOS ────────────────────────────────────────── */}
      <section className="bg-classic-navy py-20 px-6 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-pastel text-center mb-3">
            Resultados reais
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Casos tratados com o método
          </h2>
          <p className="text-center text-white/50 text-sm mb-12">
            Arraste a linha para comparar antes e depois
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <BeforeAfterSlider before={caso1Antes} after={caso1Depois} />
            <BeforeAfterSlider before={caso2Antes} after={caso2Depois} />
            <BeforeAfterSlider before={caso3Antes} after={caso3Depois} />
          </div>
          <p className="text-center text-white/30 text-xs mt-6">
            Casos clínicos do Dr. João Paulo Silva-Neto · CRO/RN 3271
          </p>
        </div>
      </section>

      {/* ── MÓDULOS ───────────────────────────────────────────────── */}
      <section id="modulos" className="bg-classic-light py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-brown text-center mb-3">
            Conteúdo
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-classic-navy mb-3">
            O que você vai aprender
          </h2>
          <p className="text-center text-classic-navy/50 text-sm mb-12">
            30 horas de conteúdo · 6 módulos · Acesso vitalício
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((mod) => (
              <div
                key={mod.number}
                className="bg-white rounded-2xl p-6 border border-classic-navy/5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-classic-navy text-white">
                    <mod.icon className="size-5" />
                  </div>
                  <span className="text-3xl font-black text-classic-navy/5">
                    {mod.number}
                  </span>
                </div>
                <h3 className="font-bold text-classic-navy mb-2">{mod.title}</h3>
                <p className="text-sm text-classic-navy/60 leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTORIDADE ────────────────────────────────────────────── */}
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
            <h2 className="text-3xl font-bold mb-6">
              Dr. João Paulo Silva-Neto
            </h2>
            <div className="space-y-4 text-white/70 text-sm leading-relaxed">
              <p>
                Clínico, professor e pesquisador em Reabilitação Oral. Doutor em
                Prótese Dental pela{" "}
                <span className="text-white font-semibold">UNICAMP-SP</span> e
                Mestre em Reabilitação Oral pela{" "}
                <span className="text-white font-semibold">UFU-MG</span>.
              </p>
              <p>
                A base do método não é a teoria acadêmica — são{" "}
                <span className="text-white font-semibold">
                  15 anos de prática clínica real
                </span>
                , com centenas de casos de reabilitação tratados.
              </p>
              <p>
                Desenvolveu a Reabilitação Objetiva para ser o mapa de
                segurança do dentista: um sistema que elimina o improviso e
                organiza o raciocínio clínico.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["UNICAMP-SP", "UFU-MG", "CRO/RN 3271", "15 anos de clínica"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ───────────────────────────────────────────── */}
      <section className="bg-classic-light py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-brown text-center mb-3">
            Quem já aplicou o método
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-classic-navy mb-12">
            O que os alunos dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Dra. Amanda Bellão",
                text: "O Curso é excelente! Contempla bem as necessidades de quem está iniciando na profissão, como também de quem já tem anos nela.",
              },
              {
                name: "Dra. Ana Clara Soares",
                text: "Depois dele mudei minha dinâmica de planejamento e a forma como conduzo meus casos. A clareza do método faz toda diferença.",
              },
              {
                name: "Dra. Lariane Raulino",
                text: "Curso transformador. Aumentou minha segurança para apresentar e fechar grandes tratamentos com previsibilidade.",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 border border-classic-navy/5 shadow-sm"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-classic-brown text-classic-brown"
                    />
                  ))}
                </div>
                <p className="text-sm text-classic-navy/70 leading-relaxed mb-4 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-classic-navy/5">
                  <div className="size-9 rounded-full bg-classic-pastel/30 flex items-center justify-center text-classic-navy font-bold text-sm">
                    {t.name.split(" ")[1][0]}
                  </div>
                  <span className="text-sm font-semibold text-classic-navy">
                    {t.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BÔNUS ─────────────────────────────────────────────────── */}
      <section className="bg-classic-navy py-16 px-6 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-pastel mb-3">
            Incluído na inscrição
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-10">
            + Bônus exclusivos
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-left">
              <Users className="size-7 text-classic-pastel mb-3" />
              <h3 className="font-bold mb-2">Comunidade Reabilitação Objetiva 5.0</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Acesso à comunidade com profissionais que já aplicam o método,
                com plantão de dúvidas ativo.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-left">
              <Youtube className="size-7 text-classic-pastel mb-3" />
              <h3 className="font-bold mb-2">Canal YouTube Exclusivo</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Mais de 15 aulas gravadas na comunidade do YouTube, com
                conteúdo complementar ao curso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFERTA ────────────────────────────────────────────────── */}
      <section className="bg-classic-light py-20 px-6">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-classic-brown mb-3">
            Investimento
          </p>
          <h2 className="text-3xl font-bold text-classic-navy mb-8">
            Reabilitação Objetiva Online
          </h2>
          <div className="bg-white rounded-3xl border border-classic-navy/10 shadow-xl p-8">
            <p className="text-sm text-classic-navy/40 line-through mb-1">
              De R$ 2.997,90
            </p>
            <p className="text-classic-navy/60 text-sm mb-1">por apenas</p>
            <p className="text-5xl font-black text-classic-navy mb-1">
              12x de R$ 103
            </p>
            <p className="text-classic-navy/50 text-sm mb-1">ou</p>
            <p className="text-2xl font-bold text-classic-navy mb-6">
              R$ 997,90 à vista
            </p>
            <a
              href={HOTMART_URL}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-full bg-classic-navy py-4 text-center text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-classic-wine"
            >
              Quero minha vaga <ArrowRight className="inline size-4 ml-1" />
            </a>
            <ul className="mt-6 space-y-2 text-xs text-classic-navy/50 text-left">
              {[
                "Acesso vitalício ao conteúdo",
                "30h de conteúdo + bônus",
                "Comunidade com plantão de dúvidas",
                "Plataforma Hotmart — segura e confiável",
              ].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-classic-brown shrink-0" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="bg-classic-light pb-20 px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-classic-navy text-center mb-10">
            Dúvidas frequentes
          </h2>
          <div className="bg-white rounded-3xl border border-classic-navy/5 shadow-sm px-6 divide-y divide-classic-navy/10">
            {faq.map((item) => (
              <FaqItem key={item.question} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────── */}
      <section className="bg-classic-navy py-20 px-6 text-white text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comece a tratar com previsibilidade
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Mais de 30 horas de método, casos reais e sistema completo para
            você nunca mais improvisar em reabilitação oral.
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

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="bg-classic-navy border-t border-white/5 py-6 px-6 text-center text-xs text-white/20">
        © {new Date().getFullYear()} Dr. João Paulo Silva-Neto · CRO/RN 3271 ·
        Reabilitação Objetiva
      </footer>
    </div>
  );
}
