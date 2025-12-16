"use server";

import { ChatMessage, ToolsProps } from "@/libs/chat/types";
import { serverAPIhost } from "./constants";
import { MessageContext } from "@/libs/chat/types";
import { GeneralSettings, ToolsSettings } from "@/appComponents/chat/types";
import { ProviderAuth, ProviderConfig } from "@/components/chat/model/types";

type ChatSettingsPython = GeneralSettings & ToolsSettings;
interface ChatInfo {
  tool: ToolsProps;
}

export async function fetchChatRequest(data: {
  provider: string;
  model: string;
  messages: MessageContext[];
  settings: ChatSettingsPython;
  info: ChatInfo;
  config: ProviderConfig | undefined;
  auth: ProviderAuth | undefined;
}): Promise<ChatMessage> {
  try {
    const response = await fetch(`${serverAPIhost}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
