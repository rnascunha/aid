"use client";

import { AgentTravelerData } from "./types";
import { generateUUID } from "@/libs/uuid";
import { MessageProps, Part, PartType, TypeMessage } from "@/libs/chat/types";
import { PartialDataAggregator, readQuerySSE } from "@/libs/adk/base";
import { ADKEvent } from "@/libs/adk/types";
import { ActionDispatch } from "react";
import { Actions, ChatActionArgs } from "@/libs/chat/state/types";
import { ChatbotStorageBase } from "@/libs/chat/storage/storageBase";
import {
  adk_api_agenttraveler,
  app_name,
  defaultAgentTravelerData,
} from "./constants";
import { InputOutput } from "@/components/chat/input/types";
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
    messages,
    newId,
    user,
    session,
  }: {
    messages: InputOutput;
    newId: string;
    user: string;
    session: SessionType;
  },
  dispatch: ActionDispatch<[action: ChatActionArgs]>,
) {
  const files = messages.files.map((f) => ({
    [PartType.INLINE_DATA]: { mimeType: f.mimeType, data: f.data },
  }));
  const parts: Part[] = [
    messages.text ? { [PartType.TEXT]: messages.text } : undefined,
    ...files,
  ].filter((f) => f) as Part[];

  const response = await fetch(adk_api_agenttraveler, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_name,
      user,
      session: session.id,
      parts,
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
    const content =
      was_partial && event.partial ? partial.parts : event.content?.parts;

    if (!content) return msgs;

    const newMessage: MessageProps = {
      id: `${newId}:r${count++}`,
      senderId: session.id,
      content,
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

export async function getAgentTravelerData({
  storage,
  defaultData = defaultAgentTravelerData,
}: {
  storage?: ChatbotStorageBase;
  defaultData?: AgentTravelerData;
}): Promise<AgentTravelerData> {
  if (!storage) return defaultData;

  const sessions = (await storage.getSenders()) as SessionType[];
  const chats = await storage.getMessages(sessions.map((m) => m.id));
  return {
    sessions,
    chats,
  };
}
