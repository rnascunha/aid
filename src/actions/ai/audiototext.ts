"use server";

import { saveFile } from "@/libs/file";
import { asyncSpawn } from "@/libs/process";
import { mkdir, unlink } from "fs/promises";
import path from "path";
import { pythonPath } from "./constants";

const pythonChatScript = "./scripts/audiototext.py";
const tempPath = "./tmp";

interface AudioToTextMessageSuccess {
  success: true;
  response: string;
}

interface AudioToTextMessageError {
  error: string;
  detail: string;
}

export type AudioToTextMessage =
  | AudioToTextMessageSuccess
  | AudioToTextMessageError;

export async function audioToText(
  state: AudioToTextMessage | null,
  formData: FormData
) {
  const file = formData.get("audio") as File | null;
  return await audioToTextBase(file, "deepgram", "nova-2");
}

export async function audioToText2(
  file: File | null,
  provider: string,
  model: string
) {
  return await audioToTextBase(file, provider, model);
}

async function audioToTextBase(
  file: File | null,
  provider: string,
  model: string
): Promise<AudioToTextMessage> {
  if (!file) {
    return {
      error: "No file sent",
      detail: "No valid file was sent to be transcripted",
    };
  }

  try {
    await mkdir(tempPath, { recursive: true });
    await saveFile(file, tempPath);
  } catch (e) {
    return {
      error: "Error creating file",
      detail: (e as Error).toString(),
    };
  }

  const filePath = path.join(tempPath, file.name);
  const pythonText = (await asyncSpawn(pythonPath, [
    pythonChatScript,
    provider,
    model,
    filePath,
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
      error: "Error parsing data",
      detail: pythonText,
    };
  }
}
