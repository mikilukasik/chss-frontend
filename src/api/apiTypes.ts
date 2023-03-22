export type Conversation = {
  id: string | number;
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
};

export type Conversations = Record<string | number, Conversation>;

export type MessagePayload = {
  type: "do" | "answer" | "error";
  id: string | number;
  command: string;
  data: any;
};

export type MessageHandlers = Record<string, (msg: MessagePayload) => void>;

export type OnHandler = (
  data: Record<string | number, any>
) => any | PromiseLike<any>;

export type OnHandlers = Record<string | number, OnHandler>;
