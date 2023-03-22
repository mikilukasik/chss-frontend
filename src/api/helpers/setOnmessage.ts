import { MessageHandlers, MessagePayload } from "../apiTypes";

export const setOnmessage = ({
  messageHandlers,
  worker,
}: {
  messageHandlers: MessageHandlers;
  worker?: any;
}) => {
  const messageHandler = ({ data }: { data: MessagePayload }) => {
    const { type } = data as { type: string };
    messageHandlers[type](data);
  };

  if (worker) {
    worker.onmessage = messageHandler;
    return;
  }

  onmessage = messageHandler;
};
