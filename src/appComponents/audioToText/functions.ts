import {
  Attachment,
  ChatMessagesProps,
  MessageProps,
  ModelProps,
} from "@/libs/chat/types";
import { Dispatch, SetStateAction } from "react";
import { AudioToTextSettings } from "./types";
import { blobTobase64 } from "@/libs/base64";
import { fetchAudioToText } from "@/actions/ai/audiototext";
import { providerMap } from "../chat/data";

export async function attachmentResponse(
  file: Attachment,
  newId: string,
  model: ModelProps,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  settings: AudioToTextSettings
) {
  const res = await fetch(file.data);
  const blob = await res.blob();
  const base64 = await blobTobase64(blob, file.type);
  const response = await fetchAudioToText(
    providerMap[model.providerId].provider,
    model.model,
    base64,
    settings
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
