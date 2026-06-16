import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { getLevelTitle, xpProgressInLevel } from '../utils/levelSystem.js';
import { updateRanking } from './gamificationService.js';

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function formatUser(user) {
  const { password, ...safe } = user;
  return {
    ...safe,
    levelTitle: getLevelTitle(user.level),
    xpProgress: xpProgressInLevel(user.xp, user.level),
  };
}

async function initUserGamification(userId, organizationId) {
  await updateRanking(userId, organizationId);
  const skills = await prisma.skill.findMany({
    where: { organizationId },
    take: 5,
  });
  if (skills.length) {
    await prisma.userSkill.createMany({
      data: skills.map((s) => ({ userId, skillId: s.id, unlocked: false })),
      skipDuplicates: true,
    });
  }
}

export async function register({
  email,
  password,
  name,
  accountType = 'USER',
  organizationName,
  organizationSlug,
  industry,
}) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new AppError('E-mail já cadastrado', 409);

  const hashed = await bcrypt.hash(password, 10);

  if (accountType === 'ORG_ADMIN') {
    if (!organizationName) throw new AppError('Nome da organização é obrigatório', 400);
    const slug = slugify(organizationSlug || organizationName);
    const slugTaken = await prisma.organization.findUnique({ where: { slug } });
    if (slugTaken) throw new AppError('Slug da organização já existe', 409);

    const org = await prisma.organization.create({
      data: {
        name: organizationName,
        slug,
        industry: industry || 'Educação',
        welcomeMessage: `Bem-vindo à ${organizationName}!`,
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        role: 'ORG_ADMIN',
        organizationId: org.id,
        streak: { create: {} },
        ranking: { create: { position: 1 } },
      },
      include: { organization: true },
    });

    await seedOrgDefaults(org.id);
    await initUserGamification(user.id, org.id);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    return { user: formatUser(user), token, organization: org };
  }

  if (!organizationSlug) throw new AppError('Código da organização é obrigatório para alunos', 400);
  const org = await prisma.organization.findUnique({
    where: { slug: slugify(organizationSlug) },
  });
  if (!org) throw new AppError('Organização não encontrada. Verifique o código.', 404);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      role: 'USER',
      organizationId: org.id,
      streak: { create: {} },
      ranking: { create: { position: 999 } },
    },
    include: { organization: true },
  });

  await initUserGamification(user.id, org.id);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  return { user: formatUser(user), token, organization: org };
}

async function seedOrgDefaults(organizationId) {
  const badges = [
    { name: 'Primeiro Passo', description: 'Complete a primeira atividade', icon: 'footprints', xpBonus: 25 },
    { name: '7 Dias Seguidos', description: 'Mantenha streak por 7 dias', icon: 'flame', xpBonus: 100 },
    { name: 'Destaque', description: 'Conquista especial da organização', icon: 'star', xpBonus: 150 },
  ];
  for (const b of badges) {
    await prisma.badge.create({ data: { ...b, organizationId } });
  }

  await prisma.skill.create({
    data: {
      name: 'Primeiro Conteúdo',
      description: 'Leia seu primeiro material',
      category: 'CUSTOM',
      requiredLevel: 1,
      xpRequired: 50,
      organizationId,
      positionX: 100,
      positionY: 80,
    },
  });
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          industry: true,
          logoUrl: true,
          gamificationEnabled: true,
          welcomeMessage: true,
        },
      },
    },
  });
  if (!user) throw new AppError('Credenciais inválidas', 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError('Credenciais inválidas', 401);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  return { user: formatUser(user), token };
}

export async function listOrganizations() {
  return prisma.organization.findMany({
    select: { id: true, name: true, slug: true, industry: true },
    orderBy: { name: 'asc' },
  });
}

export { formatUser };
