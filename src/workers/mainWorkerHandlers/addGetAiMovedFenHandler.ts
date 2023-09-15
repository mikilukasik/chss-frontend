import { WorkerApi } from "../../../chss-shared/workerApi/workerApi";
import { getMovedBoard } from "../../../chss-module-engine/src/engine_new/utils/getMovedBoard";
import { getMovedLmfLmt } from "../../../chss-module-engine/src/engine_new/utils/getMovedLmfLmt";
import { moveString2move } from "../../../chss-module-engine/src/engine_new/transformers/moveString2move";
import { board2fen } from "../../../chss-module-engine/src/engine_new/transformers/board2fen";
import { fen2intArray } from "../../../chss-module-engine/src/engine_new/transformers/fen2intArray";
import {
  getDbUpdate,
  processDbUpdateResult,
} from "../../helpers/localDb/indexedDb";

const DISPLAY_HOLDING_MSG_AFTER = 1000;

declare global {
  interface Window {
    CHSS_config: any;
  }
}

const holdingMessage = 'Please wait <div class="spinner"></div>';

export const addGetAiMovedFenHandler = (api: WorkerApi) =>
  api.on(
    "getAiMovedFen",
    async ({ fen, lmf, lmt, gameId, moveIndex, engineConfig }) => {
      let holdingMessageId: string | null = null;
      const holdingMessageTimeout = setTimeout(async () => {
        holdingMessageId = (await api.do("addStatusMessage", {
          children: holdingMessage,
        })) as string;
      }, DISPLAY_HOLDING_MSG_AFTER);

      const board = fen2intArray(fen);

      const dbUpdate = await getDbUpdate();

      const apiResponse = await (
        await fetch(self.CHSS_config.urls.lambdaAi, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://mikilukasik.github.io",
          },
          body: JSON.stringify({
            command: "getMove",
            data: {
              fen,
              lmf,
              lmt,
              gameId,
              moveIndex,
              engineConfig,
              dbUpdate,
            },
          }),
        })
      ).json();

      const { winningMoveString, updateResult, moveUpdateId } = apiResponse;

      clearTimeout(holdingMessageTimeout);
      if (holdingMessageId) api.do("removeStatusMessage", holdingMessageId);

      await processDbUpdateResult({ dbUpdate, updateResult });

      const move = moveString2move(winningMoveString);
      const movedBoard = getMovedBoard(move, board);
      const { lmf: movedLmf, lmt: movedLmt } = getMovedLmfLmt({
        lmf,
        lmt,
        move,
      });
      const movedFen = board2fen(movedBoard);

      return {
        apiResponse,
        fen: movedFen,
        lmf: movedLmf,
        lmt: movedLmt,
        move,
        moveUpdateId,
      };
    }
  );
