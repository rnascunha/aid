import { BaseSender, ChatMessagesProps, MessageProps } from "@/libs/chat/types";

export type SessionType = BaseSender;

export interface ChatState {
  sessions: SessionType[];
  chats: ChatMessagesProps;
  selected: SessionType | null;
}

export enum Actions {
  // Select Session
  SELECT_SESSION = "select_session",
  UNSELECT_SESSION = "unselect_session",
  // Session
  DELETE_SESSION = "delete_session",
  EDIT_SESSION = "edit_session",
  ADD_SESSION = "add_session",
  // Messages
  ADD_MESSAGE = "add_message",
  DELETE_MESSAGE = "delete_message",
}

interface SelectSessionArgs {
  sessionId: string;
}

interface DeleteSessionArgs {
  sessionId: string;
}

interface AddSessionArgs {
  session: SessionType;
}

interface EditSessionArgs {
  newSession: SessionType;
}

interface AddMessageArgs {
  sessionId: string;
  message: MessageProps[] | MessageProps;
}

interface DeleteMessageArgs {
  sessionId: string;
  messageId: string;
}

export type ChatActionArgs =
  | ({
      action: Actions.SELECT_SESSION;
    } & SelectSessionArgs)
  | { action: Actions.UNSELECT_SESSION }
  | ({
      action: Actions.ADD_SESSION;
    } & AddSessionArgs)
  | ({
      action: Actions.EDIT_SESSION;
    } & EditSessionArgs)
  | ({
      action: Actions.DELETE_SESSION;
    } & DeleteSessionArgs)
  | ({
      action: Actions.ADD_MESSAGE;
    } & AddMessageArgs)
  | ({
      action: Actions.DELETE_MESSAGE;
    } & DeleteMessageArgs);
