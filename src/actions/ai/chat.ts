"use server";

import { ChatMessage } from "@/appComponents/chat/types";
import { asyncSpawn } from "@/libs/process";

const pythonPath = "./scripts/.venv/bin/python";
const pythonChatScript = "./scripts/chat.py";

export async function chatRequest(
  provider: string,
  model: string,
  message: string
): Promise<ChatMessage> {
  const pythonChat = (await asyncSpawn(pythonPath, [
    pythonChatScript,
    provider,
    model,
    message,
  ])) as string;

  try {
    const data = JSON.parse(pythonChat);
    return data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {
      error: "Error parsing data",
      detail: pythonChat,
    };
  }
}
