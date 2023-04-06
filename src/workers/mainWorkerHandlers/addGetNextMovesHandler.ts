import { WorkerApi } from "../../api/workerApi";
import { fen2intArray } from "../../../chss-module-engine/src/engine_new/transformers/fen2intArray";
import { move2moveString } from "../../../chss-module-engine/src/engine_new/transformers/move2moveString";
import { generateLegalMoves } from "../../../chss-module-engine/src/engine_new/moveGenerators/generateLegalMoves";
import { isCheck } from "../../../chss-module-engine/src/engine_new/utils/isCheck";

export const addGetNextMovesHandler = (api: WorkerApi) =>
  api.on("getNextMoves", ({ fen }) => {
    const board = fen2intArray(fen);
    const moves = generateLegalMoves(board);

    if (!moves.length) {
      if (isCheck(board)) {
        return { nextMoves: [], gameEnded: true, result: board[64] ? -1 : 1 };
      }

      return { nextMoves: [], gameEnded: true, result: 0 };
    }

    // todo: deal with dead positions, 50moves rule, 3fold repetion, etc here

    const moveStrings = Array.from(moves).map(move2moveString);
    return { nextMoves: moveStrings, gameEnded: false };
  });
