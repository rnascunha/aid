import { ChatMessagesProps } from "../types";
import { Actions, ChatActionArgs, ChatState } from "./types";

export function reducer(state: ChatState, action: ChatActionArgs): ChatState {
  switch (action.action) {
    case Actions.SELECT_SESSION: {
      const session = state.sessions.find((s) => s.id === action.sessionId);
      if (!session) return state;
      return {
        ...state,
        selected: session,
      };
    }
    case Actions.UNSELECT_SESSION:
      return {
        ...state,
        selected: null,
      };
    case Actions.ADD_SESSION: {
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
    case Actions.DELETE_SESSION:
      const newChats = { ...state.chats };
      delete newChats[action.sessionId];
      return {
        ...state,
        chats: newChats,
        sessions: state.sessions.filter((s) => s.id !== action.sessionId),
        selected:
          action.sessionId === state.selected?.id ? null : state.selected,
      };
    case Actions.EDIT_SESSION:
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
    case Actions.ADD_MESSAGE: {
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
    case Actions.DELETE_SENDER_MESSAGE: {
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
    case Actions.DELETE_ALL_SENDER_MESSAGES:
      if (!(action.sessionId in state.chats)) return state;
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.sessionId]: [],
        },
      };
    case Actions.DELETE_ALL_MESSAGES:
      return {
        ...state,
        chats: Object.keys(state.chats).reduce((acc, sender) => {
          acc[sender] = [];
          return acc;
        }, {} as ChatMessagesProps),
      };
    case Actions.ADD_PENDING: {
      return {
        ...state,
        pending: [...state.pending, action.sessionId],
      };
    }
    case Actions.REMOVE_PENDING: {
      return {
        ...state,
        pending: state.pending.filter((p) => p !== action.sessionId),
      };
    }
  }

  // throw new Error(`Action not found ${action.action}`);
}
