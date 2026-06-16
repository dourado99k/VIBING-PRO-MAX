import createError from "http-errors";

export const badRequest = (message: string) => createError(400, message);
export const notFound = (message: string) => createError(404, message);

