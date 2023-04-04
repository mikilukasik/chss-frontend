import { findUser } from "./findUser";
import { insertUser } from "./insertUser";

export const findOrCreateUser = async ({
  name,
  id,
}: {
  name?: string;
  id?: string;
}) => {
  const user = await findUser({ name, id });
  if (user) return user;

  if (!name) throw new Error("Tried to create new user without name");

  const newUser = await insertUser({ name, id });
  return newUser;
};
