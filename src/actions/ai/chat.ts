"use server";

import { ChatMessage, ProviderAuth, ToolsProps } from "@/libs/chat/types";
import { serverAPIhost } from "./constants";
import { MessageContext } from "@/libs/chat/types";
import { GeneralSettings, ToolsSettings } from "@/appComponents/chat/types";

type ChatSettingsPython = GeneralSettings & ToolsSettings;
interface ChatInfo {
  tool: ToolsProps;
}

export async function fetchChatRequest(
  provider: string,
  model: string,
  messages: MessageContext[],
  settings: ChatSettingsPython,
  info: ChatInfo,
  auth?: ProviderAuth
): Promise<ChatMessage> {
  try {
    const response = await fetch(`${serverAPIhost}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider, model, messages, settings, auth, info }),
    });
    const raw = await response.json();
    if ("error" in raw) return raw;
    return {
      ...raw,
      response: raw.data.choices[0].message.content,
      data: raw.data,
    };
  } catch (e) {
    return {
      code: 9,
      error: "Fetch Data Error",
      detail: (e as Error).message,
    };
  }
}
