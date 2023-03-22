import { WorkerApi } from "../../api/workerApi";
import { addGetMovedFenHandler } from "./addGetMovedFenHandler";
import { addGetNextMovesHandler } from "./addGetNextMovesHandler";

export const addMainWorkerHandlers = (workerClientApi: WorkerApi) => {
  addGetMovedFenHandler(workerClientApi);
  addGetNextMovesHandler(workerClientApi);
};
