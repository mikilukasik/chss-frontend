import { createState } from "../../../../litState/src";
import { getRandomId } from "../../../helpers/utils/getRandomId";

export const statusMessagesState = createState({
  messages: [] as { children: string; id: string; show?: boolean }[],
});

export const addStatusMessage = ({
  children,
  ttl,
}: {
  children: string;
  ttl?: number;
}) => {
  const id = getRandomId();

  const item = {
    children,
    id,
  };

  statusMessagesState.messages = [...statusMessagesState.messages, item];

  setTimeout(() => {
    const item = statusMessagesState.messages.find((m) => m.id === id);
    if (item) item.show = true;

    if (ttl) {
      setTimeout(() => {
        const item = statusMessagesState.messages.find((m) => m.id === id);
        if (item) item.show = false;

        setTimeout(() => {
          statusMessagesState.messages = statusMessagesState.messages.filter(
            (msg) => msg !== item
          );
        }, 300);
      }, ttl);
    }
  }, 1);

  return id;
};

export const removeStatusMessage = async (id: string) => {
  const item = statusMessagesState.messages.find((m) => m.id === id);
  if (item) item.show = false;

  setTimeout(() => {
    statusMessagesState.messages = statusMessagesState.messages.filter(
      (msg) => msg !== item
    );
  }, 300);
};
