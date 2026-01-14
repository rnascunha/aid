import { Actions, ChatActionArgs, ChatState, SessionType } from "./types";
import { generateUUID } from "@/libs/uuid";
import { MessageProps, PartInlineData, TypeMessage } from "@/libs/chat/types";
import { delay } from "@/libs/time";
import { calculateBase64SizeInBytes, unicodeToBase64 } from "@/libs/base64";

export function createNewSession(name: string = ""): SessionType {
  return {
    name: name || `Session-${Math.floor(Math.random() * 100)}`,
    id: generateUUID(),
  };
}

function createInlineData(
  session: SessionType,
  message: string
): { inlineData: PartInlineData } {
  const base64 = unicodeToBase64(
    JSON.stringify({
      session,
      message,
    })
  );
  return {
    inlineData: {
      mimeType: "application/json",
      displayName: "file.json",
      data: base64,
      size: calculateBase64SizeInBytes(base64),
    },
  };
}

async function getFakeData(
  newId: string,
  session: SessionType,
  message: string
): Promise<MessageProps[]> {
  const delayMs = 1000 + Math.floor(Math.random() * 100);
  await delay(delayMs);
  return [
    {
      id: `${newId}:r`,
      senderId: session.id,
      timestamp: Date.now(),
      origin: "received",
      type: TypeMessage.MESSAGE,
      content: [
        {
          text: `This is a fake message. Fake replaying`,
          thought: true,
        },
        {
          text: `The delay was of ${delayMs} ms`,
          thought: true,
        },
        /file/i.test(message) ? createInlineData(session, message) : undefined,
        {
          text: `**Replaying:**\n\n${message}`,
        },
      ].filter((f) => !!f),
    },
  ];
}

export async function messageResponse({
  message,
  newId,
  session,
}: {
  message: string;
  newId: string;
  session: SessionType;
}) {
  const response = await getFakeData(newId, session, message);
  return response;
}

/**
 * Actions
 */
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
        chats: newChats,
        sessions: state.sessions.filter((s) => s.id !== action.sessionId),
        selected:
          action.sessionId === state.selected?.id ? null : state.selected,
      };
    case Actions.EDIT_SESSION:
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === action.newSession.id ? action.newSession : s
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
    case Actions.DELETE_MESSAGE: {
      if (!(action.sessionId in state.chats)) return state;
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.sessionId]: state.chats[action.sessionId].filter(
            (m) => m.id !== action.messageId
          ),
        },
      };
    }
  }

  // throw new Error(`Action not found ${action.action}`);
}
