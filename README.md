# ArenaSand — Locação de Quadras de Areia

Sistema completo de gerenciamento e locação de quadras de areia.

## Stack

- **Frontend:** React + Vite + Tailwind CSS + Zustand + Axios
- **Backend:** Node.js + Express + Prisma + JWT + bcrypt

## Como rodar

```bash
# Backend
cd backend
npm install
cp .env.example .env   # se ainda não tiver .env
npx prisma db push
npm run db:seed
npm run dev

# Frontend (outro terminal)
cd frontend
npm install
npm run dev
```

- API: http://localhost:3001
- App: http://localhost:5173

## Credenciais admin (seed)

- **E-mail:** admin@quadras.com
- **Senha:** admin123
