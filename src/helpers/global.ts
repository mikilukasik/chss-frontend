import { OnHandler } from "../api/apiTypes";
import { WorkerApi } from "../api/workerApi";
import { chessboardState } from "../components/chessboard/helpers/chessboardState";

export const CHSS = {
  handlers: {} as { [key: string]: any },
  setFen: (fen: string) => (chessboardState.fen = fen),
  mainWorkerAwaiters: [],
};

window.CHSS = Object.assign(window.CHSS || {}, CHSS);

if (!window.CHSS.mainWorker) {
  window.CHSS.mainWorker = {
    do: (command: string, data: Record<string, any>) =>
      new Promise((resolve, reject) =>
        window.CHSS.mainWorkerAwaiters.push((mainWorker: WorkerApi) =>
          mainWorker.do(command, data).then(resolve).catch(reject)
        )
      ),
    on: (command: string, handler: OnHandler) =>
      window.CHSS.mainWorkerAwaiters.push((mainWorker: WorkerApi) =>
        mainWorker.on(command, handler)
      ),
  };
}
