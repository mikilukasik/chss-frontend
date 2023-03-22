// @ts-expect-error worker-loader
import Worker from "./workers/main.worker";

const mainWorker = new Worker();
mainWorker.onmessage = (...args: any) => console.log(args);

console.log("main thread");
