export const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  cpf: true,
  phone: true,
  cep: true,
  birthDate: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export function omitPassword(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}
