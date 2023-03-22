import { Conversations, MessageHandlers, OnHandlers } from "./apiTypes";
import { getDo } from "./helpers/getDo";
import { getOn } from "./helpers/getOn";
import { getMessageHandlers } from "./helpers/getMessageHandlers";
import { setOnmessage } from "./helpers/setOnmessage";

export class WorkerApi {
  private conversations: Conversations = {};
  private onHandlers: OnHandlers = {};
  private messageHandlers: MessageHandlers;

  public do;
  public on;

  constructor(worker?: any) {
    this.messageHandlers = getMessageHandlers({
      conversations: this.conversations,
      onHandlers: this.onHandlers,
      worker,
    });

    setOnmessage({ messageHandlers: this.messageHandlers, worker });

    this.do = getDo({ conversations: this.conversations, worker });
    this.on = getOn({ onHandlers: this.onHandlers });
  }
}
