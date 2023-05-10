import { WorkerApi } from "../../../chss-shared/workerApi/workerApi";
import { getMovedBoard } from "../../../chss-module-engine/src/engine_new/utils/getMovedBoard";
import { getMovedLmfLmt } from "../../../chss-module-engine/src/engine_new/utils/getMovedLmfLmt";
import { moveString2move } from "../../../chss-module-engine/src/engine_new/transformers/moveString2move";
import { board2fen } from "../../../chss-module-engine/src/engine_new/transformers/board2fen";
import { fen2intArray } from "../../../chss-module-engine/src/engine_new/transformers/fen2intArray";

export const addGetMovedFenHandler = (api: WorkerApi) =>
  api.on("getMovedFen", ({ fen, moveString, lmf, lmt }) => {
    const move = moveString2move(moveString);
    const movedBoard = getMovedBoard(move, fen2intArray(fen));
    const { lmf: movedLmf, lmt: movedLmt } = getMovedLmfLmt({ lmf, lmt, move });
    const movedFen = board2fen(movedBoard);

    return { fen: movedFen, lmf: movedLmf, lmt: movedLmt };
  });
