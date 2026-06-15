import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { omitPassword, userPublicSelect } from '../utils/userSelect.js';

export function formatUser(user) {
  return omitPassword(user);
}

export async function register({
  name,
  email,
  password,
  cpf,
  phone,
  cep,
  birthDate,
}) {
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { cpf }] },
  });
  if (exists) throw new AppError('E-mail ou CPF já cadastrado', 409);

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      cpf,
      phone,
      cep,
      birthDate: new Date(birthDate),
      role: 'CLIENTE',
    },
    select: userPublicSelect,
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  return { user, token };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Credenciais inválidas', 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError('Credenciais inválidas', 401);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  return { user: formatUser(user), token };
}

export async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userPublicSelect,
  });
  if (!user) throw new AppError('Usuário não encontrado', 404);
  return user;
}
