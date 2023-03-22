import { MessagePayload, OnHandlers } from "../apiTypes";

export const getDoMessageHandler =
  ({ onHandlers, worker }: { onHandlers: OnHandlers; worker?: any }) =>
  async ({ id, command, data }: MessagePayload) => {
    try {
      if (!onHandlers[command]) {
        const payload = {
          type: "error",
          id,
          data: new Error(`unknown command received: ${command}`),
        };

        if (worker) {
          worker.postMessage(payload);
          return;
        }

        postMessage(payload);
        return;
      }

      const payload = {
        type: "answer",
        id,
        data: await onHandlers[command](data),
      };

      if (worker) {
        worker.postMessage(payload);
        return;
      }

      postMessage(payload);
    } catch (error) {
      const payload = { type: "error", id, data: error };

      if (worker) {
        worker.postMessage(payload);
        return;
      }

      postMessage(payload);
    }
  };
