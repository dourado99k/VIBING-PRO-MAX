import type { NextFunction, Request, Response } from "express";
import createError from "http-errors";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const httpErr = createError.isHttpError(err) ? err : createError(500, "Erro interno");
  res.status(httpErr.statusCode).json({
    error: {
      message: httpErr.message,
      statusCode: httpErr.statusCode,
    },
  });
}

