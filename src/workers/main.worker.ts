import * as tf from "@tensorflow/tfjs";
import { WorkerApi } from "../api/workerApi";

const workerClientApi = new WorkerApi();
workerClientApi.on("test", (data) => ({ echoFromClient: data }));

workerClientApi
  .do("test", { workerToHost: "ok" })
  .then(console.log)
  .catch(console.error);

(async () => {
  tf.loadLayersModel("tfjs_model/model.json");
})();
