import { WorkerApi } from "../../api/workerApi";
import { getMovedBoard } from "../../../chss-module-engine/src/engine_new/utils/getMovedBoard";
import { moveString2move } from "../../../chss-module-engine/src/engine_new/transformers/moveString2move";
import { board2fen } from "../../../chss-module-engine/src/engine_new/transformers/board2fen";
import { fen2intArray } from "../../../chss-module-engine/src/engine_new/transformers/fen2intArray";

export const addGetMovedFenHandler = (api: WorkerApi) =>
  api.on("getMovedFen", ({ fen, moveString }) => {
    const move = moveString2move(moveString);
    const movedBoard = getMovedBoard(move, fen2intArray(fen));
    const movedFen = board2fen(movedBoard);

    return movedFen;
  });
