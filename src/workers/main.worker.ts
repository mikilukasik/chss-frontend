import { WorkerApi } from "../api/workerApi";
import { addMainWorkerHandlers } from "./mainWorkerHandlers/mainWorkerHandlers";

const workerClientApi = new WorkerApi();
addMainWorkerHandlers(workerClientApi);
