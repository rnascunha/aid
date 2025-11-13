import { Dispatch, SetStateAction } from "react";
import {
  Attachment,
  ChatMessagesProps,
  ChatSuccessMessage,
  MessageContext,
  MessageProps,
  ModelProps,
  ProviderBaseProps,
  ProviderProps,
} from "./types";
import { ContextSettings } from "@/appComponents/chat/types";

export function sortedModels(chats: ChatMessagesProps) {
  const list = Object.keys(chats) as (keyof ChatMessagesProps)[];
  list.sort((c1, c2) => {
    const m1 = chats[c1].at(-1);
    const m2 = chats[c2].at(-1);
    if (!m1 && !m2) return 1;
    if (m1 && m2) return m1.timestamp < m2.timestamp ? 1 : -1;
    if (m1) return -1;
    return 1;
  });
  return list;
}

function contextMessagesFilter(
  messages: MessageProps[],
  {
    max = 10,
    elapsedTimeMs = Number.MAX_SAFE_INTEGER,
  }: { max?: number; elapsedTimeMs?: number }
) {
  const now = Date.now();
  const m = messages
    .filter((m) => "success" in m.content)
    .slice(-Math.max(max, 0))
    .filter((msg) => now - msg.timestamp <= elapsedTimeMs);
  return m;
}

function formatContextMessages(messages: MessageProps[]) {
  return messages
    .filter((m) => "success" in m.content)
    .map((m) => ({
      role: m.id.endsWith("r") ? "assistant" : "user",
      content: (m.content as ChatSuccessMessage).response,
    }));
}

export function contextMessages(
  messages: MessageProps[],
  {
    max = 10,
    elapsedTimeMs = Number.MAX_SAFE_INTEGER,
  }: { max?: number; elapsedTimeMs?: number }
) {
  return formatContextMessages(
    contextMessagesFilter(messages, { max, elapsedTimeMs })
  ) as MessageContext[];
}

export function messageSubmit(
  message: string,
  newId: string,
  provider: ModelProps,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>
) {
  const newMessage = {
    id: newId,
    sender: "You",
    content: { response: message, success: true },
    timestamp: Date.now(),
  } as MessageProps;
  setChats((prev) => ({
    ...prev,
    [provider.id]: [...prev[provider.id], newMessage],
  }));
  return newMessage;
}

export async function attachmentSubmit(
  attachment: Attachment,
  newId: string,
  model: ModelProps,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  message?: string
) {
  const newMessage = {
    id: newId,
    sender: "You",
    content: {
      response: message ?? `File: ${attachment.name}`,
      success: true,
    },
    timestamp: Date.now(),
    attachment,
  } as MessageProps;
  setChats((prev) => ({
    ...prev,
    [model.id]: [...prev[model.id], newMessage],
  }));
  return newMessage;
}

export function mergeMessages(
  message: string,
  settings: ContextSettings,
  chats: MessageProps[]
) {
  const trimed = settings.systemPrompt.trim();
  const system = (
    trimed ? [{ role: "system", content: trimed }] : []
  ) as MessageContext[];
  const context = contextMessages(chats, {
    max: settings.maxContextMessages,
    elapsedTimeMs: settings.maxElapsedTimeMessages,
  });
  const user = { role: "user", content: message.trim() } as MessageContext;

  return system.concat(context, user);
}

/**
 *
 */

export async function onDeleteModelMessages(
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  modelId?: string
) {
  if (modelId) {
    setChats((prev) => ({
      ...prev,
      [modelId]: [],
    }));
    return;
  }
  setChats((prev) =>
    Object.keys(prev).reduce((acc, v) => {
      acc[v] = [];
      return acc;
    }, {} as ChatMessagesProps)
  );
}

function removeModel(
  models: ModelProps[],
  setModels: Dispatch<SetStateAction<ModelProps[]>>,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  setSelectedModel: Dispatch<SetStateAction<ModelProps | undefined>>,
  modelId: string
) {
  setModels((prev) => prev.filter((f) => f.id !== modelId));
  setSelectedModel((prev) =>
    prev === undefined
      ? undefined
      : prev.id !== modelId
      ? prev
      : (models.find((f) => f.id !== modelId) as ModelProps)
  );
  setChats((prev) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [modelId]: remove, ...rest } = prev;
    return rest;
  });
}

export async function addRemoveModel(
  models: ModelProps[],
  setModels: Dispatch<SetStateAction<ModelProps[]>>,
  setChats: Dispatch<SetStateAction<ChatMessagesProps>>,
  setSelectedModel: Dispatch<SetStateAction<ModelProps | undefined>>,
  model: string | ModelProps
) {
  if (typeof model === "string") {
    await removeModel(models, setModels, setChats, setSelectedModel, model);
    return;
  }
  setModels((prev) => [...prev, model]);
  setChats((prev) => ({ ...prev, [model.id]: [] }));
  if (models.length === 0) setSelectedModel(model);
}

export function checkProviderAvaiable(provider: ProviderProps) {
  return (
    provider.auth === undefined ||
    (Object.values(provider.auth).every((v) => v !== "") &&
      (provider.config === undefined ||
        Object.values(provider.config).every((c) => c !== "")))
  );
}

export function getProviderBase(
  model: ModelProps,
  providers: ProviderProps[],
  providerBaseMap: Record<string, ProviderBaseProps>
) {
  const provider = providers.find((p) => model.providerId === p.id);
  if (!provider) return;
  return providerBaseMap[provider.providerBaseId];
}

export function removeModelsFromRemovedProviders(
  providers: ProviderProps[],
  setModels: Dispatch<SetStateAction<ModelProps[]>>
) {
  const providerIds = providers.map((p) => p.id);
  setModels((prev) => prev.filter((m) => providerIds.includes(m.providerId)));
}
