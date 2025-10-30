"use server";

import { ChatMessage } from "@/components/chat/types";
import { asyncSpawn } from "@/libs/process";
import { pythonPath } from "./constants";
import { MessageContext } from "@/components/chat/types";
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
    provider,
    model,
    JSON.stringify(messages),
    JSON.stringify(settings),
  ])) as string;

  try {
    const data = JSON.parse(pythonChat);
    return data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {
      error: "Error parsing data",
      detail: pythonChat,
    };
  }
}
