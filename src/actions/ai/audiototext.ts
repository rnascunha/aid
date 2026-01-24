"use server";

import { ProviderAuth, ProviderConfig } from "@/libs/chat/models/types";
import { serverAPIhost } from "./constants";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { MessageContentStatus, Part, TypeMessage } from "@/libs/chat/types";

interface AudioToTextResponse {
  type: TypeMessage;
  content: MessageContentStatus | Part[];
  raw: object | string;
}

export async function fetchAudioToText(data: {
  provider: string;
  model: string;
  file: string;
  settings: AudioToTextSettings;
  auth: ProviderAuth | undefined;
  config: ProviderConfig | undefined;
}): Promise<AudioToTextResponse> {
  try {
    const response = await fetch(`${serverAPIhost}/audiototext/`, {
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
      content: [
        {
          text: raw.data.text,
        },
      ],
      raw: raw,
    };
  } catch (e) {
    return {
      type: TypeMessage.ERROR,
      content: {
        name: "Fetch Data Error",
        text: (e as Error).message,
      },
      raw: JSON.stringify(e as Error),
    };
  }
}
