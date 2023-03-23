import { WorkerApi } from "../../api/workerApi";
import { getMovedBoard } from "../../../chss-module-engine/src/engine_new/utils/getMovedBoard";
import { getMovedLmfLmt } from "../../../chss-module-engine/src/engine_new/utils/getMovedLmfLmt";
import { moveString2move } from "../../../chss-module-engine/src/engine_new/transformers/moveString2move";
import { board2fen } from "../../../chss-module-engine/src/engine_new/transformers/board2fen";
import { fen2intArray } from "../../../chss-module-engine/src/engine_new/transformers/fen2intArray";
import { predict } from "../../../chss-module-engine/src/engine_new/tfHelpers/predict";

import * as tf from "@tensorflow/tfjs";
const modelPromise = tf.loadLayersModel("tfjs_model/model.json");

export const addGetAiMovedFenHandler = (api: WorkerApi) =>
  api.on("getAiMovedFen", async ({ fen, lmf, lmt }) => {
    const board = fen2intArray(fen);
    const model = await modelPromise;
    const { winningMoveString } = await predict({ board, lmf, lmt, model, tf });

    const move = moveString2move(winningMoveString);
    const movedBoard = getMovedBoard(move, board);
    const { lmf: movedLmf, lmt: movedLmt } = getMovedLmfLmt({ lmf, lmt, move });
    const movedFen = board2fen(movedBoard);

    return { fen: movedFen, lmf: movedLmf, lmt: movedLmt };
  });
