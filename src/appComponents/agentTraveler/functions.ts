"use client";

import { AgentTravelerData } from "./types";
import {
  ChatbotStorageBase,
  StorageBase,
} from "@/libs/chat/storage/storageBase";
import { adk_api_agenttraveler, defaultAgentTravelerData } from "./constants";
import { getData, updateSession } from "@/libs/chat/adk/functions";
import { Actions, ChatActionArgs } from "@/libs/chat/state/types";
import { ADKState, SessionType } from "@/libs/chat/adk/types";
import { ActionDispatch } from "react";
import { TypeMessage } from "@/libs/chat/types";
import { makeMessageStatusSend } from "@/libs/chat/functions";

export async function getAgentTravelerData({
  storage,
}: {
  storage?: ChatbotStorageBase;
  defaultData?: AgentTravelerData;
}): Promise<AgentTravelerData> {
  return await getData({ storage, defaultData: defaultAgentTravelerData });
}

export async function getSessionState(
  {
    session,
    userId,
  }: {
    session: SessionType;
    userId: string;
  },
  dispatch: ActionDispatch<[action: ChatActionArgs]>,
  storage?: StorageBase,
) {
  const query = new URLSearchParams({
    session: session.id,
    user: userId,
  }).toString();
  const url = `${adk_api_agenttraveler}?${query}`;

  const response = await fetch(url);

  if (!response.ok) {
    const message = makeMessageStatusSend({
      type: TypeMessage.ERROR,
      content: {
        name: "[Get Session] Fetch Error",
        text: `[${response.status}] ${response.statusText}`,
      },
      senderId: session.id,
    });
    dispatch({
      action: Actions.ADD_MESSAGE,
      message,
      sessionId: session.id,
    });
    await storage?.addMessage(message);
    return;
  }
  const data = await response.json();

  if (data.type !== TypeMessage.SUCCESS) {
    const message = makeMessageStatusSend({
      type: data.type,
      content: data.content,
      raw: data.raw as Record<string, unknown>,
      senderId: session.id,
    });
    dispatch({
      action: Actions.ADD_MESSAGE,
      message,
      sessionId: session.id,
    });
    await storage?.addMessage(message);
    return;
  }
  // Success receiving data
  await updateSession(
    {
      session: {
        ...session,
        state: data.raw as unknown as ADKState,
      },
    },
    dispatch,
    storage,
  );
  return response;
}
