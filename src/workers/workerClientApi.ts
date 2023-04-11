import { WorkerApi } from "../api/workerApi";
import { catchErrors } from "../helpers/utils/catchErrors";
import { addMainWorkerHandlers } from "./mainWorkerHandlers/mainWorkerHandlers";

export const workerClientApi = new WorkerApi();

export const initWorkerApi = () => {
  addMainWorkerHandlers(workerClientApi);

  catchErrors({
    logger: (e) => workerClientApi.do("dealWithError", e).catch(console.error),
  });
};
