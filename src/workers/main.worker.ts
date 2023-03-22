import * as tf from "@tensorflow/tfjs";
import { WorkerApi } from "../api/workerApi";
import { addMainWorkerHandlers } from "./mainWorkerHandlers/mainWorkerHandlers";

const workerClientApi = new WorkerApi();
addMainWorkerHandlers(workerClientApi);

(async () => {
  tf.loadLayersModel("tfjs_model/model.json");
})();
