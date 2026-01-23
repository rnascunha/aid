"use server";

import { ChatSettings } from "@/appComponents/chat/types";
import { ProviderProps } from "@/libs/chat/models/types";
import {
  generalStorage,
  chatStorage,
} from "@/libs/chat/storage/mongodb/instance";
import { ToolsDB } from "@/libs/chat/storage/types";
import {
  BaseSender,
  ChatMessagesProps,
  MessageProps,
  ToolsProps,
} from "@/libs/chat/types";

// GENERAL
export async function clear(): Promise<void> {
  await generalStorage?.clear();
}

export async function getProviders(): Promise<ProviderProps[]> {
  return await generalStorage!.getProviders();
}

export async function addProvider(provider: ProviderProps): Promise<void> {
  await generalStorage?.addProvider(provider);
}

export async function deleteProvider(providerId: string): Promise<void> {
  await generalStorage?.deleteProvider(providerId);
}

export async function getTools(): Promise<ToolsDB | undefined> {
  return await generalStorage?.getTools();
}

export async function updateTools(tools: ToolsProps): Promise<void> {
  await generalStorage?.updateTools(tools);
}

// CHAT
export async function chatGetMessages(
  senderIds: string[],
): Promise<ChatMessagesProps> {
  return await chatStorage!.getMessages(senderIds);
}

export async function chatAddMessage(
  messages: MessageProps | MessageProps[],
): Promise<void> {
  await chatStorage?.addMessage(messages);
}

export async function chatDeleteSenderMessages(
  senderId: string,
): Promise<void> {
  await chatStorage?.deleteSenderMessages(senderId);
}

export async function chatDeleteAllMessages(): Promise<void> {
  await chatStorage?.deleteAllMessages();
}

export async function chatGetSenders(): Promise<BaseSender[]> {
  console.log(chatStorage);
  return await chatStorage!.getSenders();
}

export async function chatAddSender(sender: BaseSender): Promise<void> {
  return await chatStorage?.addSender(sender);
}

export async function chatDeleteSender(senderId: string): Promise<void> {
  return await chatStorage?.deleteSender(senderId);
}

export async function chatGetSettings(): Promise<ChatSettings | undefined> {
  return await chatStorage?.getSettings();
}

export async function chatUpdateSettings(
  settings: ChatSettings,
): Promise<void> {
  await chatStorage?.updateSettings(settings);
}
