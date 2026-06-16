import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

/** Anexa usuário se token válido; segue sem erro se ausente */
export async function optionalAuthenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return next();
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationId: true,
        organization: { select: { id: true, name: true, slug: true } },
      },
    });
    if (user) req.user = user;
  } catch {
    /* ignora token inválido em rotas públicas */
  }
  next();
}
