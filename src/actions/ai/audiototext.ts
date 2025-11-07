"use server";

import { ProviderAuth } from "@/libs/chat/types";
import { serverAPIhost } from "./constants";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";

interface AudioToTextMessageSuccess {
  success: true;
  response: string;
}

interface AudioToTextMessageError {
  code: number;
  error: string;
  detail: string;
}

export type AudioToTextMessage =
  | AudioToTextMessageSuccess
  | AudioToTextMessageError;

export async function fetchAudioToText(
  provider: string,
  model: string,
  file: string,
  settings: AudioToTextSettings,
  auth: ProviderAuth
) {
  try {
    const response = await fetch(`${serverAPIhost}/audiototext/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider, model, file, settings, auth }),
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
