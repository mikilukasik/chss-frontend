import { localDb } from "../localDb/indexedDb";

export const addMove = async ({
  gameId,
  moveIndex,
  fen,
  move = null,
  updateId,
}: {
  gameId: string;
  moveIndex: number;
  fen: string;
  move: number | null;
  updateId?: number;
}) => {
  await localDb.fens.insert({
    id: `${gameId}/${moveIndex}`,
    game: gameId,
    index: moveIndex,
    fen,
    move,
    updateId,
  });
};
