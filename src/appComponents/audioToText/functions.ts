import { Dispatch, SetStateAction } from "react";
import { AudioToTextSettings } from "./types";
import { filePathToBase64 } from "@/libs/base64";
import { fetchAudioToText } from "@/actions/ai/audiototext";
import { providerBaseMap } from "@/libs/chat/models/data";
import { ModelProps, ProviderProps } from "@/libs/chat/models/types";
import {
  ChatMessagesProps,
  MessageProps,
  PartInlineData,
} from "@/libs/chat/types";
import { messageSendSubmit } from "@/libs/chat/functions";
import { formatBytes } from "@/libs/formatData";

export async function messageSubmit(
  data: PartInlineData,
  newId: string,
  model: ModelProps,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  message?: string
) {
  const audioData = await filePathToBase64(
    data.inlineData.data,
    data.inlineData.mimeType
  );
  const inlineData = {
    ...data.inlineData,
    data: audioData,
  };

  const newMessage = messageSendSubmit(
    [
      {
        inlineData,
      },
      {
        text:
          message ??
          `File: ${
            inlineData.displayName ?? inlineData.mimeType
          } (${formatBytes(inlineData.size ?? inlineData.data.length)})`,
      },
    ],
    newId,
    model.id,
    setChats
  );
  return [newMessage, audioData] as [MessageProps, string];
}

export async function attachmentResponse({
  data,
  newId,
  model,
  provider,
  setChats,
  settings,
}: {
  data: string;
  newId: string;
  model: ModelProps;
  provider: ProviderProps;
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>;
  settings: AudioToTextSettings;
}) {
  // const base64 = await filePathToBase64(
  //   file.inlineData.data,
  //   file.inlineData.mimeType
  // );
  const response = await fetchAudioToText({
    provider: providerBaseMap[provider.providerBaseId].provider,
    model: model.model,
    file: data,
    settings,
    auth: provider.auth,
    config: provider.config,
  });

  const responseMessage: MessageProps = {
    id: `${newId}:r`,
    senderId: model.id,
    timestamp: Date.now(),
    origin: "received",
    type: response.type,
    content: response.content,
    raw: response.raw,
  } as MessageProps;
  setChats((prev) => ({
    ...prev,
    [model.id]: [...prev[model.id], responseMessage],
  }));
  return responseMessage;
}
