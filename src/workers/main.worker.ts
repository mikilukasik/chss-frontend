import * as tf from "@tensorflow/tfjs";

console.log("im the worker");

postMessage("this is the message to main");

(async () => {
  tf.loadLayersModel("tfjs_model/model.json");
})();
