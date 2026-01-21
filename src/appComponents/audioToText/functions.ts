import { AudioToTextData, AudioToTextSettings } from "./types";
import { fetchAudioToText } from "@/actions/ai/audiototext";
import { providerBaseMap } from "@/libs/chat/models/data";
import { ModelProps, ProviderProps } from "@/libs/chat/models/types";
import { MessageProps } from "@/libs/chat/types";
import { defaultAudioToTextData } from "./data";
import { AudioToTextStorageBase } from "@/libs/chat/storage/storageBase";

export async function attachmentResponse({
  data,
  newId,
  model,
  provider,
  settings,
}: {
  data: string;
  newId: string;
  model: ModelProps;
  provider: ProviderProps;
  settings: AudioToTextSettings;
}) {
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
  return responseMessage;
}

export async function getAudioToTextData({
  storage,
  defaultData = defaultAudioToTextData,
}: {
  storage?: AudioToTextStorageBase;
  defaultData?: AudioToTextData;
}): Promise<AudioToTextData> {
  if (!storage) return defaultData;

  const [models, settings] = await Promise.all([
    storage.getSenders(),
    storage.getSettings(),
  ]);
  const chats = await storage.getMessages(models.map((m) => m.id));
  return {
    models: models as ModelProps[],
    chats,
    settings: settings ?? defaultData.settings,
  };
}
