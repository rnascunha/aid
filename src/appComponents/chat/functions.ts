import { ChatMessagesProps, MessageProps, ModelProps } from "@/libs/chat/types";
import { Dispatch, SetStateAction } from "react";
import { ChatSettings } from "./types";
import { mergeMessages } from "@/libs/chat/functions";
import { fetchChatRequest } from "@/actions/ai/chat";
import { providerMap } from "@/libs/chat/data";

export async function messageResponse(
  message: string,
  newId: string,
  model: ModelProps,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  settings: ChatSettings,
  chats: MessageProps[]
) {
  const messages = mergeMessages(message, settings.context, chats);

  const response = await fetchChatRequest(
    providerMap[model.providerId].provider,
    model.model,
    messages,
    { ...settings.general, ...settings.tools }
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
