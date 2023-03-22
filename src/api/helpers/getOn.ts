import { OnHandler, OnHandlers } from "../apiTypes";

export const getOn =
  ({ onHandlers }: { onHandlers: OnHandlers }) =>
  (command: string, handler: OnHandler) =>
    (onHandlers[command] = handler);
