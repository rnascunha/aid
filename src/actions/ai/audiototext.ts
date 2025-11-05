"use server";

import { saveFile } from "@/libs/file";
import { asyncSpawn } from "@/libs/process";
import { mkdir, unlink } from "fs/promises";
import path from "path";
import { pythonPath, serverAPIhost } from "./constants";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";

const pythonChatScript = "./scripts/audiototext.py";
const tempPath = "./tmp";

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

export async function audioToText(
  provider: string,
  model: string,
  file: Blob | null,
  options: AudioToTextSettings
) {
  return await audioToTextBase(provider, model, file, options);
}

async function audioToTextBase(
  provider: string,
  model: string,
  data: Blob | null,
  settings: AudioToTextSettings
): Promise<AudioToTextMessage> {
  if (!data) {
    return {
      code: 9,
      error: "No file sent",
      detail: "No valid file was sent to be transcripted",
    };
  }

  const name = crypto.randomUUID();

  try {
    await mkdir(tempPath, { recursive: true });
    await saveFile(data, tempPath, name);
  } catch (e) {
    return {
      code: 10,
      error: "Error creating file",
      detail: (e as Error).toString(),
    };
  }

  const filePath = path.join(tempPath, name);
  const pythonText = (await asyncSpawn(pythonPath, [
    pythonChatScript,
    provider,
    model,
    filePath,
    JSON.stringify(settings),
  ])) as string;

  try {
    await unlink(filePath);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {}

  try {
    const data = JSON.parse(pythonText);
    return data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {
      code: 11,
      error: "Error parsing data",
      detail: pythonText,
    };
  }
}

export async function fetchAudioToText(
  provider: string,
  model: string,
  file: string,
  settings: AudioToTextSettings
) {
  try {
    const response = await fetch(`${serverAPIhost}/audiototext/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider, model, file, settings }),
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
