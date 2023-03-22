// @ts-expect-error worker-loader
import Worker from "./workers/main.worker";
import { WorkerApi } from "./api/workerApi";

const mainWorker = new Worker();
const workerHostApi = new WorkerApi(mainWorker);

workerHostApi.on("test", (data) => ({ echoFromHost: data }));
workerHostApi
  .do("test", { hostToWorker: "ok" })
  .then(console.log)
  .catch(console.error);
