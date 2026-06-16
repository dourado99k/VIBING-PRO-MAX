Backend — hotel-gestao

1) Copie .env.example para .env e ajuste DATABASE_URL (MySQL) e JWT_SECRET.
2) npm install
3) npx prisma db push
4) npm run db:seed   (opcional — dados demo)
5) npm run dev

API em PORT (padrão 4000). Endpoints principais:
- POST /auth/register, /auth/login
- CRUD /rooms, /guests, /reservations
- GET /alerts, POST /alerts/:id/ack
- GET /audit
- GET/PATCH /settings
- GET /dashboard/summary
