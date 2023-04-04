import { localDb } from "../localDb/indexedDb";
import { getUUID } from "../utils/getUUID";

export const insertUser = async ({
  name,
  id: _id,
}: {
  name: string;
  id?: string;
}) => {
  const id = _id || getUUID();
  await localDb.users.insert({ name, id });

  return { name, id };
};
