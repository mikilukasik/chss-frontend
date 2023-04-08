import { localDb } from "../localDb/indexedDb";
import { getUUID } from "../utils/getUUID";

const engineName = "engine1";

export const createGame = async ({
  user: { id: userId },
  gameStateUpdate: { computerPlaysDark, computerPlaysLight, fen },
}: {
  user: { id: string };
  gameStateUpdate: {
    computerPlaysDark: boolean;
    computerPlaysLight: boolean;
    fen: string;
  };
}) => {
  const game = {
    id: getUUID(),
    createdAt: new Date().toISOString(),
    computerPlaysDark,
    computerPlaysLight,
    startingFen: fen,
    ...(computerPlaysDark
      ? { wPlayer: userId, bPlayer: engineName }
      : { wPlayer: engineName, bPlayer: userId }),
  };

  await localDb.games.insert(game);

  return game;
};
