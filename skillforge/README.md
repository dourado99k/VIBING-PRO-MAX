# SkillForge

**Plataforma B2B de gamificação de conteúdos educacionais e corporativos.**

**Equipe:** Felipe Dourado Deczka · Ygor Passos Luciano · Andrei Camargo · Mateus Mathias · Nicolas Carlos

Desenvolvido para o Hackathon **SENAI DESI** — permite que qualquer organização (cursinho, escola, empresa) faça upload de **PDFs e imagens**, configure **gamificação** (XP, missões, ranking, badges) e engaje alunos com experiência visual moderna.

![Stack](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square)
![Stack](https://img.shields.io/badge/Node-Express-339933?style=flat-square)
![Stack](https://img.shields.io/badge/Prisma-SQLite/MySQL-2D3748?style=flat-square)

**Repositório:** https://github.com/dourado99k/HACKATON

---

## Índice da documentação de entrega

| Documento | Descrição |
|-----------|-----------|
| [README.md](./README.md) | Este arquivo (obrigatório) |
| [docs/ENTREGA.md](./docs/ENTREGA.md) | Checklist completo da entrega |
| [docs/DOCUMENTACAO-SOLUCAO.md](./docs/DOCUMENTACAO-SOLUCAO.md) | Documentação da solução |
| [docs/BANCO-DE-DADOS.md](./docs/BANCO-DE-DADOS.md) | Diagrama ER, scripts e config |
| [docs/MATERIAIS-COMPLEMENTARES.md](./docs/MATERIAIS-COMPLEMENTARES.md) | Wireframes, assets, protótipos |

---

## Problema / desafio abordado

Organizações educacionais e corporativas possuem **conteúdos estáticos** (apostilas PDF, imagens, materiais) que **não engajam** alunos e colaboradores. Plataformas tradicionais são complexas, caras ou não permitem **gamificação personalizada por cliente**.

**Desafio:** criar uma solução onde **qualquer cliente B2B** gamifique seus próprios conteúdos, com dois perfis claros — **administrador** (sobe e configura) e **usuário** (consome e participa da gamificação).

---

## Integrantes da equipe

| Nome |
|------|
| Felipe Dourado Deczka |
| Ygor Passos Luciano |
| Andrei Camargo |
| Mateus Mathias |
| Nicolas Carlos |

---

## Tecnologias utilizadas

### Front-end
React 19 · Vite 8 · Tailwind CSS 4 · React Router DOM 7 · Zustand · Framer Motion · Lucide React · React Hot Toast · Recharts · Axios · ESLint

### Back-end
Node.js · Express 5 · Prisma 6 · JWT · bcryptjs · Zod · Multer · CORS · dotenv

### Banco de dados
SQLite (desenvolvimento local) · MySQL 8 (produção via Docker Compose)

### Ferramentas
Git · GitHub · Docker Compose · Concurrently · Prisma Studio

---

## Funcionalidades implementadas

### Plataforma B2B
- [x] Multi-tenant por **Organização** (cada cliente isolado)
- [x] Cadastro **ORG_ADMIN** (cria organização) e **USER** (aluno com código)
- [x] Upload de **PDF e imagens** (Multer)
- [x] Publicação / despublicação de conteúdos
- [x] Biblioteca de leitura para alunos (iframe PDF + preview imagem)

### Gamificação
- [x] XP, níveis e títulos (Aprendiz → Mestre Industrial)
- [x] Missões CRUD + concluir + boss fights
- [x] Favoritos em missões
- [x] Skill Tree visual por organização
- [x] Badges e streak
- [x] Ranking da turma (top 3 + tabela)
- [x] Popup animado de XP / level up
- [x] Dashboard com gráficos (Recharts)

### UX / Interface
- [x] Landing page B2B
- [x] Tema claro e escuro (persistente)
- [x] Layout responsivo (sidebar + mobile nav)
- [x] Toasts, modais, skeletons, empty states

### API REST
- [x] Auth (JWT), users, missions, skills, badges, rankings
- [x] Contents (upload), organizations (config)
- [x] Validação Zod, middlewares, seed completo

---

## Estrutura do banco de dados

### Models principais

| Model | Descrição |
|-------|-----------|
| `Organization` | Cliente B2B (nome, slug, gamificação) |
| `User` | SUPER_ADMIN, ORG_ADMIN ou USER |
| `Content` | PDF / IMAGE uploadados |
| `Mission` | Atividades gamificadas |
| `MissionFavorite` | Favoritos do aluno |
| `Skill` | Árvore de habilidades |
| `Badge` | Conquistas |
| `UserSkill` / `UserBadge` | Progresso |
| `Ranking` | Posição no leaderboard |
| `Streak` | Sequência diária |

Diagrama ER completo: [docs/BANCO-DE-DADOS.md](./docs/BANCO-DE-DADOS.md)

Schema: [`backend/prisma/schema.prisma`](./backend/prisma/schema.prisma)

---

## Modelo de monetização

| Plano | Público | Recursos |
|-------|---------|----------|
| **Free** | Cursinhos pequenos | Org básica, conteúdos limitados, ranking |
| **Premium** | R$ 29,90/mês | Analytics, badges exclusivas, boss ilimitado, streak 2x |
| **Enterprise** | SENAI / redes | White-label, multi-unidade, SLA |

Modelo **freemium B2B SaaS** — barreira baixa + receita recorrente + licenciamento institucional.

Detalhes: [docs/DOCUMENTACAO-SOLUCAO.md](./docs/DOCUMENTACAO-SOLUCAO.md)

---

## Instruções para execução local

### Pré-requisitos
- Node.js 18+
- npm

### Setup rápido

```bash
git clone git@github.com:dourado99k/HACKATON.git skillforge
cd skillforge
npm run install:all
cd backend && cp .env.example .env && npm run db:generate && npm run db:push && npm run db:seed
cd .. && npm run dev
```

Ou:

```bash
chmod +x scripts/setup-local.sh && ./scripts/setup-local.sh && npm run dev
```

### URLs

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3001/api |
| Health | http://localhost:3001/api/health |

### Contas de demonstração

| E-mail | Senha | Papel | Organização |
|--------|-------|-------|-------------|
| `demo@skillforge.com` | `123456` | Aluno | skillforge-demo |
| `admin@skillforge.com` | `123456` | Admin | skillforge-demo |
| `aluno@alpha.com` | `123456` | Aluno | alpha-prevest |
| `admin@alpha.com` | `123456` | Admin | alpha-prevest |
| `super@skillforge.com` | `123456` | Super admin | — |

Cadastro aluno: use código `skillforge-demo` ou `alpha-prevest`.

### MySQL (opcional)

```bash
docker compose up -d
# Altere provider para mysql em schema.prisma
# Configure DATABASE_URL no backend/.env
cd backend && npm run db:push && npm run db:seed
```

---

## Link do deploy

**Deploy em produção:** não publicado — demonstração via **execução local**.

*(Se publicar no Vercel/Render/Railway, atualize esta seção com a URL.)*

---

## Estrutura do projeto

```
skillforge/
├── frontend/                 # React + Vite
│   └── src/
│       ├── components/       # UI, layout, gamificação
│       ├── pages/            # Telas
│       ├── services/         # API client
│       └── store/            # Zustand
├── backend/                  # Express API
│   ├── prisma/
│   │   ├── schema.prisma     # Schema do banco
│   │   └── seed.js         # Dados demo
│   ├── uploads/              # PDFs/imagens (runtime)
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       └── middleware/
├── docs/                     # Documentação de entrega
├── scripts/setup-local.sh
├── docker-compose.yml
└── README.md
```

---

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Frontend + backend |
| `npm run dev:frontend` | Apenas React |
| `npm run dev:backend` | Apenas API |
| `npm run db:push` | Sincroniza schema |
| `npm run db:seed` | Popula dados demo |
| `npm run db:up` | Sobe MySQL (Docker) |
| `npm run setup:local` | Setup completo |

---

## Variáveis de ambiente

### Backend (`backend/.env`)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="skillforge-hackathon-secret-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3001/api
```

---

## Arquitetura

```
React (Vite) ──HTTP──► Express API ──Prisma──► SQLite / MySQL
                           │
                    JWT + Multer (uploads)
                           │
                    Organizações (multi-tenant)
```

---

## Licença

Projeto acadêmico — Hackathon SENAI DESI 2026.
