import { WorkerApi } from "../api/workerApi";
import { addMainWorkerHandlers } from "./mainWorkerHandlers/mainWorkerHandlers";

self.importScripts("config.js");

const workerClientApi = new WorkerApi();
addMainWorkerHandlers(workerClientApi);
