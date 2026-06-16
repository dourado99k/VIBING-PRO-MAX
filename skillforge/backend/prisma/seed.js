import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { calculateLevel } from '../src/utils/levelSystem.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SkillForge B2B...');

  await prisma.missionFavorite.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.content.deleteMany();
  await prisma.ranking.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.organization.deleteMany();

  const password = await bcrypt.hash('123456', 10);

  const demoOrg = await prisma.organization.create({
    data: {
      name: 'SkillForge Demo',
      slug: 'skillforge-demo',
      industry: 'Conta de desenvolvimento / testes',
      description: 'Ambiente interno para demonstração da plataforma B2B.',
      welcomeMessage: 'Conta demo — use para testar uploads e gamificação.',
      gamificationEnabled: true,
    },
  });

  const alphaOrg = await prisma.organization.create({
    data: {
      name: 'Alpha Pré-Vestibular',
      slug: 'alpha-prevest',
      industry: 'Pré-vestibular',
      description: 'Cursinho preparatório que gamifica materiais de estudo.',
      welcomeMessage: 'Bem-vindo ao Alpha! Estude, ganhe XP e suba no ranking da turma.',
      gamificationEnabled: true,
    },
  });

  async function seedBadges(orgId) {
    const names = [
      { name: 'Primeiro Passo', description: 'Complete a primeira atividade', xpBonus: 25 },
      { name: '7 Dias Seguidos', description: 'Streak de 7 dias', xpBonus: 100 },
      { name: 'Destaque da Turma', description: 'Top 3 do ranking', xpBonus: 150 },
    ];
    const badges = [];
    for (const b of names) {
      badges.push(await prisma.badge.create({ data: { ...b, organizationId: orgId, icon: 'award' } }));
    }
    return badges;
  }

  async function seedSkills(orgId) {
    const s1 = await prisma.skill.create({
      data: {
        name: 'Material Inicial',
        description: 'Leia o primeiro conteúdo publicado',
        category: 'CUSTOM',
        requiredLevel: 1,
        xpRequired: 50,
        organizationId: orgId,
        positionX: 120,
        positionY: 80,
      },
    });
    const s2 = await prisma.skill.create({
      data: {
        name: 'Atividades em dia',
        description: 'Complete 3 missões',
        category: 'CUSTOM',
        requiredLevel: 2,
        xpRequired: 120,
        organizationId: orgId,
        positionX: 280,
        positionY: 80,
        parentId: s1.id,
      },
    });
    return [s1, s2];
  }

  async function seedContents(orgId, authorId) {
    await prisma.content.createMany({
      data: [
        {
          title: 'Cronograma de Estudos — Semana 1',
          description: 'Planejamento inicial da turma',
          type: 'IMAGE',
          fileUrl: 'https://images.unsplash.com/photo-1434030214721-48bfc93440e9?w=800',
          fileName: 'cronograma.jpg',
          mimeType: 'image/jpeg',
          isPublished: true,
          organizationId: orgId,
          createdById: authorId,
          order: 1,
        },
        {
          title: 'Apostila de Matemática — Introdução',
          description: 'PDF com exercícios básicos',
          type: 'PDF',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          fileName: 'matematica-intro.pdf',
          mimeType: 'application/pdf',
          isPublished: true,
          organizationId: orgId,
          createdById: authorId,
          order: 2,
        },
        {
          title: 'Mapa Mental — Redação',
          description: 'Imagem de apoio para aulas de redação',
          type: 'IMAGE',
          fileUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
          fileName: 'redacao.png',
          mimeType: 'image/jpeg',
          isPublished: true,
          organizationId: orgId,
          createdById: authorId,
          order: 3,
        },
      ],
    });
  }

  const superUser = await prisma.user.create({
    data: {
      email: 'super@skillforge.com',
      password,
      name: 'Super Admin Plataforma',
      role: 'SUPER_ADMIN',
      streak: { create: {} },
      ranking: { create: { position: 1 } },
    },
  });

  const demoAdmin = await prisma.user.create({
    data: {
      email: 'admin@skillforge.com',
      password,
      name: 'Admin Demo',
      role: 'ORG_ADMIN',
      organizationId: demoOrg.id,
      streak: { create: {} },
      ranking: { create: { position: 1 } },
    },
  });

  const demoLearners = [
    { name: 'Aluno Demo', email: 'demo@skillforge.com', xp: 850, streak: 5 },
    { name: 'Ana Silva', email: 'ana.demo@skillforge.com', xp: 2450, streak: 12 },
    { name: 'Carlos Mendes', email: 'carlos.demo@skillforge.com', xp: 1980, streak: 9 },
    { name: 'Julia Costa', email: 'julia.demo@skillforge.com', xp: 1620, streak: 7 },
    { name: 'Pedro Lima', email: 'pedro.demo@skillforge.com', xp: 1340, streak: 4 },
    { name: 'Fernanda Rocha', email: 'fernanda.demo@skillforge.com', xp: 980, streak: 6 },
    { name: 'Lucas Souza', email: 'lucas.demo@skillforge.com', xp: 720, streak: 3 },
    { name: 'Beatriz Alves', email: 'beatriz.demo@skillforge.com', xp: 540, streak: 2 },
  ];

  const demoStudents = [];
  for (const l of demoLearners) {
    const user = await prisma.user.create({
      data: {
        email: l.email,
        password,
        name: l.name,
        role: 'USER',
        organizationId: demoOrg.id,
        xp: l.xp,
        level: calculateLevel(l.xp),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(l.name)}`,
        streak: {
          create: {
            currentStreak: l.streak,
            longestStreak: l.streak + 5,
            lastStudyDate: new Date(),
          },
        },
        ranking: { create: { position: 999 } },
      },
    });
    demoStudents.push(user);
  }

  const alphaLearners = [
    { name: 'Maria Vestibular', email: 'aluno@alpha.com', xp: 2100, streak: 8 },
    { name: 'João Enem', email: 'joao@alpha.com', xp: 1850, streak: 11 },
    { name: 'Camila Redação', email: 'camila@alpha.com', xp: 1560, streak: 6 },
    { name: 'Rafael Mat', email: 'rafael@alpha.com', xp: 920, streak: 4 },
  ];

  const alphaStudents = [];
  for (const l of alphaLearners) {
    const user = await prisma.user.create({
      data: {
        email: l.email,
        password,
        name: l.name,
        role: 'USER',
        organizationId: alphaOrg.id,
        xp: l.xp,
        level: calculateLevel(l.xp),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(l.name)}`,
        streak: {
          create: {
            currentStreak: l.streak,
            longestStreak: l.streak + 3,
            lastStudyDate: new Date(),
          },
        },
        ranking: { create: { position: 999 } },
      },
    });
    alphaStudents.push(user);
  }

  const alphaAdmin = await prisma.user.create({
    data: {
      email: 'admin@alpha.com',
      password,
      name: 'Coordenador Alpha',
      role: 'ORG_ADMIN',
      organizationId: alphaOrg.id,
      streak: { create: {} },
      ranking: { create: { position: 1 } },
    },
  });

  async function refreshOrgRankings(orgId) {
    const users = await prisma.user.findMany({
      where: { organizationId: orgId, role: 'USER' },
      orderBy: [{ xp: 'desc' }, { level: 'desc' }],
    });
    for (let i = 0; i < users.length; i++) {
      await prisma.ranking.upsert({
        where: { userId: users[i].id },
        create: { userId: users[i].id, position: i + 1 },
        update: { position: i + 1 },
      });
    }
  }

  for (const org of [demoOrg, alphaOrg]) {
    const admin = org.id === demoOrg.id ? demoAdmin : alphaAdmin;
    await seedBadges(org.id);
    await seedSkills(org.id);
    await seedContents(org.id, admin.id);
  }

  const missionTemplates = [
    { title: 'Assistir aula introdutória', difficulty: 'EASY', category: 'Conteúdo', xpReward: 40 },
    { title: 'Resolver lista de exercícios', difficulty: 'MEDIUM', category: 'Prática', xpReward: 80 },
    { title: 'Quiz semanal', difficulty: 'HARD', category: 'Avaliação', xpReward: 150 },
    { title: 'Desafio final do módulo', difficulty: 'BOSS', category: 'Boss', xpReward: 400, isBoss: true },
  ];

  for (const { user, org } of [
    ...demoStudents.slice(0, 3).map((user) => ({ user, org: demoOrg })),
    ...alphaStudents.slice(0, 2).map((user) => ({ user, org: alphaOrg })),
  ]) {
    for (const m of missionTemplates) {
      await prisma.mission.create({
        data: {
          ...m,
          description: `Missão: ${m.title}. Conclua para ganhar XP na ${org.name}.`,
          status: Math.random() > 0.5 ? 'PENDING' : 'COMPLETED',
          userId: user.id,
          organizationId: org.id,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  await refreshOrgRankings(demoOrg.id);
  await refreshOrgRankings(alphaOrg.id);

  console.log('✅ Seed B2B concluído!\n');
  console.log('   Conta demo (aluno):     demo@skillforge.com / 123456  [skillforge-demo]');
  console.log('   Admin demo:             admin@skillforge.com / 123456');
  console.log('   Alpha (aluno):          aluno@alpha.com / 123456     [alpha-prevest]');
  console.log('   Alpha (admin):          admin@alpha.com / 123456');
  console.log('   Super plataforma:       super@skillforge.com / 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
