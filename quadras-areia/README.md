# Quintal 127 — Arena & Choperia

Sistema de reserva e locação de quadras de areia para o **Quintal 127**.

**Endereço:** Rua Laureano 127, Campeche — Florianópolis, SC

## Stack

- **Frontend:** React + Vite + Tailwind CSS + Zustand + Axios
- **Backend:** Node.js + Express + Prisma + JWT + bcrypt

## Como rodar

```bash
# Backend
cd backend
npm install
cp .env.example .env
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

## Apresentação

- **PDF (10 slides):** [Quintal127_Apresentacao_Sistema.pdf](./Quintal127_Apresentacao_Sistema.pdf)
- Para regenerar: `python3 scripts/gerar_apresentacao_quintal127_pdf.py`
