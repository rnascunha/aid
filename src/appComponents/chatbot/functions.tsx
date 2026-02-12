import { ChatbotData } from "./types";
import { adk_api_chatbot, app_name, defaultChatbotData } from "./constants";
import { generateUUID } from "@/libs/uuid";
import { MessageProps, TypeMessage } from "@/libs/chat/types";
import { PartialDataAggregator, readQuerySSE } from "@/libs/adk/base";
import { ADKEvent } from "@/libs/adk/types";
import { ActionDispatch } from "react";
import { Actions, ChatActionArgs } from "@/libs/chat/state/types";
import { ChatbotStorageBase } from "@/libs/chat/storage/storageBase";
import { SessionType } from "@/libs/chat/adk/types";

export function createNewSession(name: string = ""): SessionType {
  return {
    name: name || `Session-${Math.floor(Math.random() * 100)}`,
    id: generateUUID(),
    state: {},
  };
}

async function getResponseBodyError(response: Response) {
  try {
    return await response.json();
  } catch {
    return {
      status: response.status,
      statusText: response.statusText,
    };
  }
}

export async function messageResponse(
  {
    message,
    newId,
    user,
    session,
  }: {
    message: string;
    newId: string;
    user: string;
    session: SessionType;
  },
  dispatch: ActionDispatch<[action: ChatActionArgs]>,
) {
  const response = await fetch(adk_api_chatbot, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_name,
      user,
      session: session.id,
      parts: [{ text: message }],
      streaming: true,
    }),
  });

  if (response.status !== 200 || !response.body) {
    const raw = await getResponseBodyError(response);
    const errorMessage = {
      id: `${newId}:r`,
      senderId: session.id,
      content: {
        name: "Query Error",
        text: `Request status [${response.status} / ${response.statusText}]`,
      },
      timestamp: Date.now(),
      type: TypeMessage.ERROR,
      raw,
      origin: "received",
    } as MessageProps;
    dispatch({
      action: Actions.ADD_MESSAGE,
      sessionId: session.id,
      message: errorMessage,
    });
    return errorMessage;
  }

  const msgs: MessageProps[] = [];
  let count = 0;
  const partial = new PartialDataAggregator();

  await readQuerySSE(response, (data, error) => {
    if (error) {
      console.error(data);
      return;
    }

    const event = data as ADKEvent;
    const was_partial = partial.addMessage(event);

    const newMessage: MessageProps = {
      id: `${newId}:r${count++}`,
      senderId: session.id,
      content:
        was_partial && event.partial ? partial.parts : event.content!.parts,
      timestamp: Date.now(),
      type: TypeMessage.MESSAGE,
      raw: event,
      origin: "received",
    } as MessageProps;

    if (was_partial) {
      dispatch({
        action: Actions.SLICE_ADD_MESSAGES,
        messages: [newMessage],
        slice: [0, -1],
        sessionId: session.id,
      });
    } else {
      dispatch({
        action: Actions.ADD_MESSAGE,
        sessionId: session.id,
        message: newMessage,
      });
    }

    if (!event.partial) {
      msgs.push(newMessage);
    }
  });

  return msgs;
}

export async function getChatbotData({
  storage,
  defaultData = defaultChatbotData,
}: {
  storage?: ChatbotStorageBase;
  defaultData?: ChatbotData;
}): Promise<ChatbotData> {
  if (!storage) return defaultData;

  const sessions = (await storage.getSenders()) as SessionType[];
  const chats = await storage.getMessages(sessions.map((m) => m.id));
  return {
    sessions,
    chats,
  };
}
