// @ts-expect-error worker-loader
import Worker from "./workers/main.worker";
import { WorkerApi } from "./api/workerApi";
import { Config } from "./helpers/types";

declare global {
  interface Window {
    CHSS: any;
  }
}

export const config = {} as Config;

export const init = ({ config: envConfig }: { config: Config }) => {
  console.log({ config });
  Object.assign(config, envConfig);

  const mainWorker = new Worker({ workerOptions: { config } });
  const workerHostApi = new WorkerApi(mainWorker);

  window.CHSS = Object.assign(window.CHSS || {}, { mainWorker: workerHostApi });

  while (window.CHSS.mainWorkerAwaiters.length)
    window.CHSS.mainWorkerAwaiters.pop()(workerHostApi);
};
