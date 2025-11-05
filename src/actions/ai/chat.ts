"use server";

import { ChatMessage } from "@/libs/chat/types";
import { asyncSpawn } from "@/libs/process";
import { pythonPath, serverAPIhost } from "./constants";
import { MessageContext } from "@/libs/chat/types";
import { GeneralSettings, ToolsSettings } from "@/appComponents/chat/types";

const pythonChatScript = "./scripts/chat.py";

type ChatSettingsPython = GeneralSettings & ToolsSettings;

export async function chatRequest(
  provider: string,
  model: string,
  messages: MessageContext[],
  settings: ChatSettingsPython
): Promise<ChatMessage> {
  const pythonChat = (await asyncSpawn(pythonPath, [
    pythonChatScript,
    JSON.stringify({ provider, model, messages, settings }),
  ])) as string;

  try {
    const data = JSON.parse(pythonChat);
    return data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {
      code: 9,
      error: "Error parsing data",
      detail: pythonChat,
    };
  }
}

export async function fetchChatRequest(
  provider: string,
  model: string,
  messages: MessageContext[],
  settings: ChatSettingsPython
): Promise<ChatMessage> {
  try {
    const response = await fetch(`${serverAPIhost}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider, model, messages, settings }),
    });
    if (!response.ok)
      return {
        code: 8,
        error: "HTTP Request Error",
        detail: `Status: ${response.status}, `,
      };
    return await response.json();
  } catch (e) {
    return {
      code: 9,
      error: "Fetch Data Error",
      detail: (e as Error).message,
    };
  }
}
