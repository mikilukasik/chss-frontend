import { localDb } from "../localDb/indexedDb";

export const findUser = async ({
  name,
  id,
}: {
  name?: string;
  id?: string;
}) => {
  const userInLocalDb = (
    await localDb.users.findAll({
      ...(name ? { name } : {}),
      ...(id ? { id } : {}),
    })
  )[0];

  return userInLocalDb || null;
};
