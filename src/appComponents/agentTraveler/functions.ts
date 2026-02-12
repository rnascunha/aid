"use client";

import { AgentTravelerData } from "./types";
import { ChatbotStorageBase } from "@/libs/chat/storage/storageBase";
import { defaultAgentTravelerData } from "./constants";
import { getData } from "@/libs/chat/adk/functions";

export async function getAgentTravelerData({
  storage,
}: {
  storage?: ChatbotStorageBase;
  defaultData?: AgentTravelerData;
}): Promise<AgentTravelerData> {
  return await getData({ storage, defaultData: defaultAgentTravelerData });
}
