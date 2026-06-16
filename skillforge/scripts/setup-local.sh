#!/bin/bash
set -e
cd "$(dirname "$0")/.."

echo "⚔️  SkillForge — setup local (SQLite, sem Docker)"

cd backend
npm install
npm run db:generate
npx prisma db push
npm run db:seed

cd ../frontend
npm install

echo ""
echo "✅ Pronto! Rode na raiz do projeto:"
echo "   npm run dev"
echo ""
echo "   Demo: demo@skillforge.com / 123456"
echo "   Admin: admin@skillforge.com / 123456"
