import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('Token não fornecido', 401);
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        xp: true,
        level: true,
        avatar: true,
        bio: true,
        organizationId: true,
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
    if (!user) throw new AppError('Usuário não encontrado', 401);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Token inválido ou expirado', 401));
    }
    next(err);
  }
}

export function isOrgAdmin(role) {
  return role === 'ORG_ADMIN' || role === 'SUPER_ADMIN';
}

export function requireOrgAdmin(req, res, next) {
  if (!isOrgAdmin(req.user?.role)) {
    return next(new AppError('Acesso restrito a administradores da organização', 403));
  }
  next();
}

/** @deprecated use requireOrgAdmin */
export function requireAdmin(req, res, next) {
  return requireOrgAdmin(req, res, next);
}

export function requireSuperAdmin(req, res, next) {
  if (req.user?.role !== 'SUPER_ADMIN') {
    return next(new AppError('Acesso restrito à plataforma', 403));
  }
  next();
}

export function getOrgId(user) {
  return user.organizationId;
}
