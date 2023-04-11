import { workerClientApi } from "./workerClientApi";

export const workerLogger = {
  info: (...args: any[]) => {
    workerClientApi.do("log", { level: "info", args });
  },
  error: (...args: any[]) => {
    workerClientApi.do("log", { level: "error", args });
  },
};
