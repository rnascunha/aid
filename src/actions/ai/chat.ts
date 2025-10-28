"use server";

import { ChatMessage } from "@/components/chat/types";
import { asyncSpawn } from "@/libs/process";
import { pythonPath } from "./constants";
import { MessageContext } from "@/components/chat/types";

const pythonChatScript = "./scripts/chat.py";

export async function chatRequest(
  provider: string,
  model: string,
  message: string,
  context?: MessageContext[]
): Promise<ChatMessage> {
  const pythonChat = (await asyncSpawn(pythonPath, [
    pythonChatScript,
    provider,
    model,
    message,
    ...(context?.map((c) => JSON.stringify(c)) ?? []),
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
