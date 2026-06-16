import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import missionRoutes from './routes/missionRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import rankingRoutes from './routes/rankingRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { UPLOAD_ROOT } from './config/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_ROOT));

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'SkillForge B2B API online',
    version: '2.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/organizations', organizationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
