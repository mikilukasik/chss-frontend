import { WorkerApi } from "../../api/workerApi";
import { fen2intArray } from "../../../chss-module-engine/src/engine_new/transformers/fen2intArray";
import { move2moveString } from "../../../chss-module-engine/src/engine_new/transformers/move2moveString";
import { generateLegalMoves } from "../../../chss-module-engine/src/engine_new/moveGenerators/generateLegalMoves";

export const addGetNextMovesHandler = (api: WorkerApi) =>
  api.on("getNextMoves", ({ fen }) => {
    const board = fen2intArray(fen);
    const moves = generateLegalMoves(board);
    const moveStrings = Array.from(moves).map(move2moveString);

    return moveStrings;
  });
