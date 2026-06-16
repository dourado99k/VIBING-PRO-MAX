## Gestão de Demandas (SaaS)

Sistema moderno de gerenciamento de demandas inspirado em planilhas operacionais corporativas, com:

- Tabela estilo Excel/Notion com edição inline
- Calendário mensal com arrastar/redimensionar (sincronizado em tempo real)
- Observações (timeline) por demanda
- Dashboard com métricas e previsão inteligente de prazo

### Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + Socket.IO
- **DB**: MySQL 8
- **ORM**: Prisma

### Como rodar (dev)

1) Suba o MySQL:

```bash
cd docker
docker compose up -d
```

2) Instale dependências na raiz:

```bash
cd ..
npm install
```

3) Configure variáveis do backend (crie `server/.env`):

```bash
DATABASE_URL="mysql://app:app@localhost:3306/demandas"
PORT=4000
CORS_ORIGIN="http://localhost:5173"
```

4) Rode migrations:

```bash
npm run db:migrate -w server
```

5) Rode tudo:

```bash
npm run dev
```

### Deploy (futuro)

- Backend: container (Node) + MySQL gerenciado (RDS/Cloud SQL) + variáveis de ambiente
- Frontend: build estático (Vercel/Netlify/S3+CloudFront)

