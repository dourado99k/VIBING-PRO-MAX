import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { userPublicSelect } from '../utils/userSelect.js';

export async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('Token não fornecido', 401);
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: userPublicSelect,
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

export function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError('Acesso restrito a administradores', 403));
  }
  next();
}
