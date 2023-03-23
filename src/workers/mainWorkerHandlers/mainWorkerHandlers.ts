import { WorkerApi } from "../../api/workerApi";
import { addGetAiMovedFenHandler } from "./addGetAiMovedFenHandler";
import { addGetMovedFenHandler } from "./addGetMovedFenHandler";
import { addGetNextMovesHandler } from "./addGetNextMovesHandler";

export const addMainWorkerHandlers = (workerClientApi: WorkerApi) => {
  addGetMovedFenHandler(workerClientApi);
  addGetAiMovedFenHandler(workerClientApi);
  addGetNextMovesHandler(workerClientApi);
};
