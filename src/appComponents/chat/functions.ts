import {
  ChatMessagesProps,
  MessageProps,
  ModelProps,
  ProviderProps,
  ToolsProps,
} from "@/libs/chat/types";
import { Dispatch, SetStateAction } from "react";
import { ChatSettings } from "./types";
import { mergeMessages } from "@/libs/chat/functions";
import { fetchChatRequest } from "@/actions/ai/chat";
import { providerBaseMap } from "@/libs/chat/data";
import { toolsMap } from "./data";

export async function messageResponse(
  message: string,
  newId: string,
  model: ModelProps,
  provider: ProviderProps,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  settings: ChatSettings,
  chats: MessageProps[],
  toolInfo: ToolsProps
) {
  const messages = mergeMessages(message, settings.context, chats);

  const response = await fetchChatRequest(
    providerBaseMap[model.providerId].provider,
    model.model,
    messages,
    {
      ...settings.general,
      ...{
        ...settings.tools,
        tools: settings.tools.tools.filter(
          (f) =>
            toolsMap[f].validade?.(f, toolInfo, settings.tools.tools).allowed ??
            true
        ),
      },
    },
    { tool: toolInfo },
    provider.auth
  );
  const newIdString = `${newId}:r`;
  const newMessage = {
    id: newIdString,
    sender: model,
    content: response,
    timestamp: Date.now(),
  };
  setChats((prev) => ({
    ...prev,
    [model.id]: [...prev[model.id], newMessage],
  }));
  return newMessage;
}
