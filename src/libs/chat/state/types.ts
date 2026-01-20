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
  SET_MESSAGES = "set_messages",
  SLICE_ADD_MESSAGES = "slice_add_messages",
  DELETE_SENDER_MESSAGE = "delete_sender_message",
  DELETE_ALL_SENDER_MESSAGES = "delete_all_sender_messages",
  DELETE_ALL_MESSAGES = "delete_all_messages",
  // Pending
  ADD_PENDING = "add_pending",
  REMOVE_PENDING = "remove_pending",
}

export interface SelectSessionArgs {
  sessionId: string;
}

export interface DeleteSessionArgs {
  sessionId: string;
}

export interface AddSessionArgs {
  session: BaseSender;
}

export interface EditSessionArgs {
  newSession: BaseSender;
}

export interface AddMessageArgs {
  sessionId: string;
  message: MessageProps[] | MessageProps;
}

export interface SetMessagesArgs {
  sessionId: string;
  messages: MessageProps[];
}

export interface SliceAddMessagesArgs {
  sessionId: string;
  slice: [number, number];
  messages: MessageProps[];
}

export interface DeleteMessageArgs {
  sessionId: string;
  messageId: string;
}

export interface DeleteAllSenderMessagesArgs {
  sessionId: string;
}

export interface AddPendingArgs {
  sessionId: string;
}

export type RemovePendingArgs = AddPendingArgs;

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
      action: Actions.SET_MESSAGES;
    } & SetMessagesArgs)
  | ({
      action: Actions.SLICE_ADD_MESSAGES;
    } & SliceAddMessagesArgs)
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
