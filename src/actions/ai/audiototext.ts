"use server";

import { ProviderAuth, ProviderConfig } from "@/libs/chat/types";
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

export async function fetchAudioToText(data: {
  provider: string;
  model: string;
  file: string;
  settings: AudioToTextSettings;
  auth: ProviderAuth | undefined;
  config: ProviderConfig | undefined;
}) {
  try {
    const response = await fetch(`${serverAPIhost}/audiototext/`, {
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
      response: raw.data.text,
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
