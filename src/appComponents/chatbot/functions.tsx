import { ChatbotData } from "./types";
import { defaultChatbotData } from "./constants";
import { ChatbotStorageBase } from "@/libs/chat/storage/storageBase";
import { getData } from "@/libs/chat/adk/functions";

export async function getChatbotData({
  storage,
}: {
  storage?: ChatbotStorageBase;
}): Promise<ChatbotData> {
  return await getData({ storage, defaultData: defaultChatbotData });
}
