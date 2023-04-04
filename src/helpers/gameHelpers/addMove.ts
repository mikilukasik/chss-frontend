import { localDb } from "../localDb/indexedDb";

export const addMove = async ({
  gameId,
  moveIndex,
  fen,
  move = null,
}: {
  gameId: string;
  moveIndex: number;
  fen: string;
  move: number | null;
}) => {
  await localDb.activeGameFens.insert({
    id: `${gameId}/${moveIndex}`,
    game: gameId,
    index: moveIndex,
    fen,
    move,
  });
};
