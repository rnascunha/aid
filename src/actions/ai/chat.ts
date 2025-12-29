"use server";

import { TypeMessage } from "@/libs/chat/types";
import { serverAPIhost } from "./constants";
import { MessageContext } from "@/libs/chat/types";

import { ProviderAuth, ProviderConfig } from "@/libs/chat/models/types";
import { ChatInfo, ChatResponse, ChatSettingsPython } from "./types";
import { getResponseParts } from "./function";

export async function fetchChatRequest(data: {
  provider: string;
  model: string;
  messages: MessageContext[];
  settings: ChatSettingsPython;
  info: ChatInfo;
  config: ProviderConfig | undefined;
  auth: ProviderAuth | undefined;
}): Promise<ChatResponse> {
  try {
    const response = await fetch(`${serverAPIhost}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const raw = await response.json();

    if ("error" in raw)
      return {
        type: TypeMessage.ERROR,
        content: {
          name: raw.error,
          text: raw.detail,
        },
        raw,
      };

    return {
      type: TypeMessage.MESSAGE,
      content: getResponseParts(raw.data),
      // content: [
      //   {
      //     text: raw.data.choices[0].message.content,
      //   },
      // ],
      raw: raw,
    };
  } catch (e) {
    return {
      type: TypeMessage.ERROR,
      content: {
        name: "Fetch Data Error",
        text: (e as Error).message,
      },
      raw: e as Error,
    };
  }
}
