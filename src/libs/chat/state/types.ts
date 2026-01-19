import { BaseSender, ChatMessagesProps, MessageProps } from "../types";

export interface ChatState {
  sessions: BaseSender[];
  chats: ChatMessagesProps;
  selected: BaseSender | null;
  pending: string[];
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
  DELETE_SENDER_MESSAGE = "delete_sender_message",
  DELETE_ALL_SENDER_MESSAGES = "delete_all_sender_messages",
  DELETE_ALL_MESSAGES = "delete_all_messages",
  // Pending
  ADD_PENDING = "add_pending",
  REMOVE_PENDING = "remove_pending",
}

interface SelectSessionArgs {
  sessionId: string;
}

interface DeleteSessionArgs {
  sessionId: string;
}

interface AddSessionArgs {
  session: BaseSender;
}

interface EditSessionArgs {
  newSession: BaseSender;
}

interface AddMessageArgs {
  sessionId: string;
  message: MessageProps[] | MessageProps;
}

interface DeleteMessageArgs {
  sessionId: string;
  messageId: string;
}

interface DeleteAllSenderMessagesArgs {
  sessionId: string;
}

interface AddPendingArgs {
  sessionId: string;
}

type RemovePendingArgs = AddPendingArgs;

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
      action: Actions.DELETE_SENDER_MESSAGE;
    } & DeleteMessageArgs)
  | ({
      action: Actions.DELETE_ALL_SENDER_MESSAGES;
    } & DeleteAllSenderMessagesArgs)
  | {
      action: Actions.DELETE_ALL_MESSAGES;
    }
  | ({
      action: Actions.ADD_PENDING;
    } & AddPendingArgs)
  | ({
      action: Actions.REMOVE_PENDING;
    } & RemovePendingArgs);
