import { MessageProps, ToolsProps } from "@/libs/chat/types";
import { ChatData, ChatSettings } from "./types";
import { mergeMessages } from "@/libs/chat/functions";
import { fetchChatRequest } from "@/actions/ai/chat";
import { providerBaseMap } from "@/libs/chat/models/data";
import { defaultChatData, toolsMap } from "./data";
import { ModelProps, ProviderProps } from "@/libs/chat/models/types";
import { ChatStorageBase } from "@/libs/chat/storage/storageBase";

export async function messageResponse(
  message: string,
  newId: string,
  model: ModelProps,
  provider: ProviderProps,
  settings: ChatSettings,
  chats: MessageProps[],
  toolInfo: ToolsProps,
) {
  const messages = mergeMessages(message, settings.context, chats);

  const response = await fetchChatRequest({
    provider: providerBaseMap[provider.providerBaseId].provider,
    model: model.model,
    messages,
    settings: {
      ...settings.general,
      ...{
        ...settings.tools,
        tools: settings.tools.tools.filter(
          (f) =>
            toolsMap[f].validade?.(f, toolInfo, settings.tools.tools).allowed ??
            true,
        ),
      },
    },
    info: { tool: toolInfo },
    auth: provider.auth,
    config: provider.config,
  });
  const newIdString = `${newId}:r`;
  const newMessage: MessageProps = {
    id: newIdString,
    origin: "received",
    senderId: model.id,
    timestamp: Date.now(),
    type: response.type,
    raw: response.raw,
    content: response.content,
  } as MessageProps;

  return newMessage;
}

export async function getChatData({
  storage,
  defaultData = defaultChatData,
}: {
  storage?: ChatStorageBase;
  defaultData?: ChatData;
}): Promise<ChatData> {
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
