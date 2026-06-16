import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { isOrgAdmin, getOrgId } from '../middleware/auth.js';
import { contentTypeFromMime, UPLOAD_ROOT } from '../config/upload.js';

export async function list(req, res, next) {
  try {
    const orgId = getOrgId(req.user);
    if (!orgId) throw new AppError('Usuário sem organização', 400);

    const where = { organizationId: orgId };
    if (!isOrgAdmin(req.user.role)) {
      where.isPublished = true;
    }

    const contents = await prisma.content.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: { createdBy: { select: { name: true } } },
    });

    res.json({ success: true, contents });
  } catch (e) {
    next(e);
  }
}

export async function getOne(req, res, next) {
  try {
    const content = await prisma.content.findUnique({
      where: { id: req.params.id },
      include: { organization: { select: { name: true, slug: true } } },
    });
    if (!content) throw new AppError('Conteúdo não encontrado', 404);
    if (content.organizationId !== getOrgId(req.user)) {
      throw new AppError('Sem permissão', 403);
    }
    if (!content.isPublished && !isOrgAdmin(req.user.role)) {
      throw new AppError('Conteúdo não publicado', 403);
    }
    res.json({ success: true, content });
  } catch (e) {
    next(e);
  }
}

export async function upload(req, res, next) {
  try {
    if (!isOrgAdmin(req.user.role)) {
      throw new AppError('Apenas administradores podem enviar conteúdos', 403);
    }
    const orgId = getOrgId(req.user);
    if (!orgId) throw new AppError('Organização não vinculada', 400);
    if (!req.file) throw new AppError('Arquivo é obrigatório', 400);

    const type = contentTypeFromMime(req.file.mimetype);
    if (!type) throw new AppError('Tipo de arquivo não suportado', 400);

    const schema = z.object({
      title: z.string().min(2),
      description: z.string().optional(),
      isPublished: z.enum(['true', 'false']).optional(),
    });
    const body = schema.parse(req.body);
    const fileUrl = `/uploads/${orgId}/${req.file.filename}`;

    const content = await prisma.content.create({
      data: {
        title: body.title,
        description: body.description || '',
        type,
        fileUrl,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        isPublished: body.isPublished === 'true',
        organizationId: orgId,
        createdById: req.user.id,
      },
    });

    res.status(201).json({ success: true, content });
  } catch (e) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function update(req, res, next) {
  try {
    if (!isOrgAdmin(req.user.role)) throw new AppError('Sem permissão', 403);
    const existing = await prisma.content.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.organizationId !== getOrgId(req.user)) {
      throw new AppError('Conteúdo não encontrado', 404);
    }

    const schema = z.object({
      title: z.string().min(2).optional(),
      description: z.string().optional(),
      isPublished: z.boolean().optional(),
      order: z.number().int().optional(),
    });
    const data = schema.parse(req.body);

    const content = await prisma.content.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, content });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function remove(req, res, next) {
  try {
    if (!isOrgAdmin(req.user.role)) throw new AppError('Sem permissão', 403);
    const existing = await prisma.content.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.organizationId !== getOrgId(req.user)) {
      throw new AppError('Conteúdo não encontrado', 404);
    }

    const rel = existing.fileUrl.replace(/^\/uploads\//, '');
    const filePath = path.join(UPLOAD_ROOT, rel);
    await prisma.content.delete({ where: { id: req.params.id } });
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ success: true, message: 'Conteúdo removido' });
  } catch (e) {
    next(e);
  }
}
