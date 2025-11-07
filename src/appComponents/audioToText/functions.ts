import {
  Attachment,
  ChatMessagesProps,
  MessageProps,
  ModelProps,
  ProviderAuth,
} from "@/libs/chat/types";
import { Dispatch, SetStateAction } from "react";
import { AudioToTextSettings } from "./types";
import { filePathToBase64 } from "@/libs/base64";
import { fetchAudioToText } from "@/actions/ai/audiototext";
import { providerMap } from "@/libs/chat/data";

export async function attachmentResponse(
  file: Attachment,
  newId: string,
  model: ModelProps,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  settings: AudioToTextSettings,
  providerAuth: ProviderAuth
) {
  const base64 = await filePathToBase64(file.data, file.type);
  const response = await fetchAudioToText(
    providerMap[model.providerId].provider,
    model.model,
    base64,
    settings,
    providerAuth
  );
  const responseMessage = {
    id: `${newId}:r`,
    sender: model,
    content: response,
    timestamp: Date.now(),
  } as MessageProps;
  setChats((prev) => ({
    ...prev,
    [model.id]: [...prev[model.id], responseMessage],
  }));
  return responseMessage;
}
