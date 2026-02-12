import { BaseSender, ChatMessagesProps } from "../types";

export interface SessionType extends BaseSender {
  state: Record<string, unknown>;
}

export interface ADKData {
  chats: ChatMessagesProps;
  sessions: SessionType[];
}
