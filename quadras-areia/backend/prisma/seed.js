import bcrypt from 'bcryptjs';
import prisma from '../src/config/db.js';

async function main() {
  console.log('🌴 Seeding Quadras de Areia...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@quadras.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@quadras.com',
      password: adminPassword,
      cpf: '00000000000',
      phone: '11999999999',
      cep: '01310100',
      birthDate: new Date('1990-01-01'),
      role: 'ADMIN',
    },
  });

  const courts = [
    {
      name: 'Quadra Central',
      description: 'Quadra principal com iluminação noturna e vestiários.',
      pricePerHour: 120,
    },
    {
      name: 'Quadra Sunset',
      description: 'Vista privilegiada, ideal para jogos ao entardecer.',
      pricePerHour: 150,
    },
    {
      name: 'Quadra Família',
      description: 'Espaço amplo para grupos e eventos informais.',
      pricePerHour: 100,
    },
  ];

  for (const court of courts) {
    const existing = await prisma.court.findFirst({ where: { name: court.name } });
    if (!existing) {
      await prisma.court.create({ data: court });
    }
  }

  console.log('✅ Seed concluído!');
  console.log('   Admin: admin@quadras.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
