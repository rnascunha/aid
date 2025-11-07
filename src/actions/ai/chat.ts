"use server";

import { ChatMessage, ProviderAuth } from "@/libs/chat/types";
import { serverAPIhost } from "./constants";
import { MessageContext } from "@/libs/chat/types";
import { GeneralSettings, ToolsSettings } from "@/appComponents/chat/types";

type ChatSettingsPython = GeneralSettings & ToolsSettings;

export async function fetchChatRequest(
  provider: string,
  model: string,
  messages: MessageContext[],
  settings: ChatSettingsPython,
  auth: ProviderAuth
): Promise<ChatMessage> {
  try {
    const response = await fetch(`${serverAPIhost}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider, model, messages, settings, auth }),
    });
    return await response.json();
  } catch (e) {
    return {
      code: 9,
      error: "Fetch Data Error",
      detail: (e as Error).message,
    };
  }
}
