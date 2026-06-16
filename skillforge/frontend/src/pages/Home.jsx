import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Upload,
  Gamepad2,
  Users,
  Sparkles,
  ArrowRight,
  FileImage,
  Settings2,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const steps = [
  {
    icon: Building2,
    title: 'Crie sua organização',
    desc: 'Cursinho, empresa, escola ou qualquer negócio que queira engajar alunos e equipes.',
  },
  {
    icon: Upload,
    title: 'Suba seus conteúdos',
    desc: 'PDFs, imagens e materiais próprios — você define o que o público vai consumir.',
  },
  {
    icon: Settings2,
    title: 'Configure a gamificação',
    desc: 'Missões, XP, níveis, badges e ranking personalizados para sua marca.',
  },
  {
    icon: Users,
    title: 'Alunos participam',
    desc: 'Contas de usuário leem conteúdos, fazem atividades e evoluem na trilha gamificada.',
  },
];

const useCases = [
  'Pré-vestibular e cursinhos',
  'Treinamentos corporativos',
  'Escolas técnicas e SENAI',
  'Onboarding de equipes',
  'Comunidades e memberships',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-app">
      <Navbar />

      <section className="relative flex min-h-screen items-center justify-center px-4 pt-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-accent-bg blur-3xl opacity-80" />
        </div>
        <motion.div
          className="relative z-10 mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="pill-badge mb-6">
            <Sparkles size={16} className="icon-accent" /> Plataforma B2B de gamificação
          </div>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
            Gamifique <span className="gradient-text">qualquer conteúdo</span> do seu cliente
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            SkillForge é uma plataforma white-label para empresas e instituições transformarem
            materiais (PDFs, imagens, aulas) em jornadas com XP, missões, ranking e engajamento
            real — sem precisar desenvolver um sistema do zero.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register?tipo=empresa" className="btn-primary">
              <Building2 size={20} /> Sou empresa / cursinho
            </Link>
            <Link to="/register?tipo=aluno" className="btn-ghost">
              <Users size={20} /> Sou aluno
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold">Como funciona</h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-muted">
          Dois tipos de conta: <strong className="text-accent">administradora</strong> (sobe conteúdo
          e configura) e <strong className="text-accent">usuário</strong> (estuda e joga).
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <s.icon className="icon-accent mb-4" size={32} />
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-surface/50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold">
              Exemplo: <span className="gradient-text">cursinho pré-vestibular</span>
            </h2>
            <p className="mt-4 text-muted">
              O coordenador cria a organização &quot;Alpha Pré-Vestibular&quot;, envia apostilas em PDF,
              cartazes em imagem e configura missões semanais. Os alunos entram com o código da turma,
              leem os materiais e disputam o ranking da sala.
            </p>
            <ul className="mt-6 space-y-2">
              {useCases.map((u) => (
                <li key={u} className="flex items-center gap-2 text-muted">
                  <ArrowRight size={16} className="text-accent" /> {u}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card neon-border mt-10 p-8 lg:mt-0">
            <div className="flex items-center gap-3">
              <FileImage className="icon-accent" size={28} />
              <div>
                <p className="font-semibold">Upload de conteúdos</p>
                <p className="text-sm text-muted">PDF e imagens (JPG, PNG, WebP)</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Gamepad2 className="text-accent-secondary" size={28} />
              <div>
                <p className="font-semibold">Gamificação por organização</p>
                <p className="text-sm text-muted">Cada cliente com sua trilha e regras</p>
              </div>
            </div>
            <Link to="/login" className="btn-primary mt-8 w-full">
              Ver demonstração <ArrowRight size={18} />
            </Link>
            <p className="mt-3 text-center text-xs text-subtle">
              Demo: demo@skillforge.com / 123456 · Alpha: aluno@alpha.com / 123456
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold">Pronto para gamificar sua base de conteúdos?</h2>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          Comece grátis. Escale com plano premium, analytics e badges exclusivas.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/register?tipo=empresa" className="btn-primary">
            Criar minha organização
          </Link>
          <Link to="/planos" className="btn-ghost">
            Ver planos B2B
          </Link>
        </div>
      </section>

      <footer className="border-t border-app py-10 text-center text-sm text-muted">
        SkillForge © 2026 — Gamificação B2B para educação e negócios
      </footer>
    </div>
  );
}
