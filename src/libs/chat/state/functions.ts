import { ChatMessagesProps } from "../types";
import {
  Actions,
  AddMessageArgs,
  AddPendingArgs,
  AddSessionArgs,
  ChatActionArgs,
  ChatState,
  DeleteAllSenderMessagesArgs,
  DeleteMessageArgs,
  DeleteSessionArgs,
  EditSessionArgs,
  RemovePendingArgs,
  SelectSessionArgs,
  SetMessagesArgs,
  SliceAddMessagesArgs,
} from "./types";

function selectSession(state: ChatState, action: SelectSessionArgs): ChatState {
  const session = state.sessions.find((s) => s.id === action.sessionId);
  if (!session) return state;
  return {
    ...state,
    selected: session,
  };
}

function unselectSession(state: ChatState): ChatState {
  return {
    ...state,
    selected: null,
  };
}

function addSession(state: ChatState, action: AddSessionArgs): ChatState {
  return {
    ...state,
    chats: {
      ...state.chats,
      [action.session.id]: [],
    },
    sessions: [...state.sessions, action.session],
    selected: action.session,
  };
}

function deleteSession(state: ChatState, action: DeleteSessionArgs): ChatState {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [action.sessionId]: removed, ...newChats } = state.chats;
  return {
    ...state,
    chats: newChats,
    sessions: state.sessions.filter((s) => s.id !== action.sessionId),
    selected: action.sessionId === state.selected?.id ? null : state.selected,
  };
}

function editSession(state: ChatState, action: EditSessionArgs): ChatState {
  return {
    ...state,
    sessions: state.sessions.map((s) =>
      s.id === action.newSession.id ? action.newSession : s,
    ),
    selected:
      state.selected?.id === action.newSession.id
        ? action.newSession
        : state.selected,
  };
}

function addMessage(state: ChatState, action: AddMessageArgs): ChatState {
  if (!(action.sessionId in state.chats)) return state;
  const messages = Array.isArray(action.message)
    ? action.message
    : [action.message];
  return {
    ...state,
    chats: {
      ...state.chats,
      [action.sessionId]: [...state.chats[action.sessionId], ...messages],
    },
  };
}

function setMessages(state: ChatState, action: SetMessagesArgs): ChatState {
  if (!(action.sessionId in state.chats)) return state;
  return {
    ...state,
    chats: {
      ...state.chats,
      [action.sessionId]: action.messages,
    },
  };
}

function sliceAddMessages(
  state: ChatState,
  action: SliceAddMessagesArgs,
): ChatState {
  if (!(action.sessionId in state.chats)) return state;
  const data = state.chats[action.sessionId].slice(...action.slice);
  return {
    ...state,
    chats: {
      ...state.chats,
      [action.sessionId]: [...data, ...action.messages],
    },
  };
}

function deleteSessionMessage(state: ChatState, action: DeleteMessageArgs) {
  if (!(action.sessionId in state.chats)) return state;
  return {
    ...state,
    chats: {
      ...state.chats,
      [action.sessionId]: state.chats[action.sessionId].filter(
        (m) => m.id !== action.messageId,
      ),
    },
  };
}

function deleteAllSessionMessage(
  state: ChatState,
  action: DeleteAllSenderMessagesArgs,
) {
  if (!(action.sessionId in state.chats)) return state;
  return {
    ...state,
    chats: {
      ...state.chats,
      [action.sessionId]: [],
    },
  };
}

function deleteAllMessages(state: ChatState) {
  return {
    ...state,
    chats: Object.keys(state.chats).reduce((acc, sender) => {
      acc[sender] = [];
      return acc;
    }, {} as ChatMessagesProps),
  };
}

function addSessionPending(state: ChatState, action: AddPendingArgs) {
  return {
    ...state,
    pending: [...state.pending, action.sessionId],
  };
}

function removeSessionPending(state: ChatState, action: RemovePendingArgs) {
  return {
    ...state,
    pending: state.pending.filter((p) => p !== action.sessionId),
  };
}

export function reducer(state: ChatState, action: ChatActionArgs): ChatState {
  switch (action.action) {
    case Actions.SELECT_SESSION:
      return selectSession(state, action);
    case Actions.UNSELECT_SESSION:
      return unselectSession(state);
    case Actions.ADD_SESSION:
      return addSession(state, action);
    case Actions.DELETE_SESSION:
      return deleteSession(state, action);
    case Actions.EDIT_SESSION:
      return editSession(state, action);
    case Actions.ADD_MESSAGE:
      return addMessage(state, action);
    case Actions.SET_MESSAGES:
      return setMessages(state, action);
    case Actions.SLICE_ADD_MESSAGES:
      return sliceAddMessages(state, action);
    case Actions.DELETE_SENDER_MESSAGE:
      return deleteSessionMessage(state, action);
    case Actions.DELETE_ALL_SENDER_MESSAGES:
      return deleteAllSessionMessage(state, action);
    case Actions.DELETE_ALL_MESSAGES:
      return deleteAllMessages(state);
    case Actions.ADD_PENDING:
      return addSessionPending(state, action);
    case Actions.REMOVE_PENDING:
      return removeSessionPending(state, action);
  }

  // throw new Error(`Action not found ${action.action}`);
}
