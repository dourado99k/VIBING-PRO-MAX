import { AppError } from '../utils/AppError.js';

export function errorHandler(err, req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Erro interno do servidor';
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && !err.isOperational && { stack: err.stack }),
  });
}

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Rota ${req.method} ${req.path} não encontrada` });
}
