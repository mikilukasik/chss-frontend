// @ts-expect-error worker-loader
import Worker from "./workers/main.worker";
import { WorkerApi } from "./api/workerApi";

declare global {
  interface Window {
    CHSS: any;
  }
}

const mainWorker = new Worker();
const workerHostApi = new WorkerApi(mainWorker);

window.CHSS = Object.assign(window.CHSS || {}, { mainWorker: workerHostApi });

while (window.CHSS.mainWorkerAwaiters.length)
  window.CHSS.mainWorkerAwaiters.pop()(workerHostApi);
