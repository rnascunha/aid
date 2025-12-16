import { Attachment } from "@/libs/chat/types";
import { Dispatch, SetStateAction } from "react";
import { AudioToTextSettings } from "./types";
import { filePathToBase64 } from "@/libs/base64";
import { fetchAudioToText } from "@/actions/ai/audiototext";
import { providerBaseMap } from "@/libs/chat/data";
import {
  ChatMessagesModelProps,
  MessageModelProps,
  ModelProps,
  ProviderProps,
} from "@/components/chat/model/types";

export async function attachmentResponse({
  file,
  newId,
  model,
  provider,
  setChats,
  settings,
}: {
  file: Attachment;
  newId: string;
  model: ModelProps;
  provider: ProviderProps;
  setChats: Dispatch<SetStateAction<ChatMessagesModelProps>>;
  settings: AudioToTextSettings;
}) {
  const base64 = await filePathToBase64(file.data, file.type);
  const response = await fetchAudioToText({
    provider: providerBaseMap[provider.providerBaseId].provider,
    model: model.model,
    file: base64,
    settings,
    auth: provider.auth,
    config: provider.config,
  });
  const responseMessage = {
    id: `${newId}:r`,
    sender: model,
    content: response,
    timestamp: Date.now(),
  } as MessageModelProps;
  setChats((prev) => ({
    ...prev,
    [model.id]: [...prev[model.id], responseMessage],
  }));
  return responseMessage;
}
