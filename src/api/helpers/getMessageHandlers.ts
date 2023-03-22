import { Conversations, MessageHandlers, OnHandlers } from "../apiTypes";
import { getDoMessageHandler } from "./getDoMessageHandler";
import { getResponseMessageHandler } from "./getResponseMessageHandler";

export const getMessageHandlers = ({
  conversations,
  onHandlers,
  worker,
}: {
  conversations: Conversations;
  onHandlers: OnHandlers;
  worker?: any;
}): MessageHandlers => ({
  do: getDoMessageHandler({ onHandlers, worker }),

  answer: getResponseMessageHandler({
    handlerKey: "resolve",
    conversations: conversations,
  }),

  error: getResponseMessageHandler({
    handlerKey: "reject",
    conversations: conversations,
  }),
});
