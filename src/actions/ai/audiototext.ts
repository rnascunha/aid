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
  provider: string,
  model: string,
  file: Blob | null,
  language: string
) {
  return await audioToTextBase(provider, model, file, language);
}

async function audioToTextBase(
  provider: string,
  model: string,
  data: Blob | null,
  language: string
): Promise<AudioToTextMessage> {
  if (!data) {
    return {
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
    language,
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
