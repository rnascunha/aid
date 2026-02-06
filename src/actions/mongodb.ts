"use server";

import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { ChatSettings } from "@/appComponents/chat/types";
import { ProviderProps } from "@/libs/chat/models/types";
import {
  generalStorage,
  chatStorage,
  audioToTextStorage,
  chatbotStorage,
  agentTravelerStorage,
} from "@/libs/chat/storage/mongodb/instance";
import { ToolsDB } from "@/libs/chat/storage/types";
import {
  BaseSender,
  ChatMessagesProps,
  MessageProps,
  ToolsProps,
} from "@/libs/chat/types";

// GENERAL
export async function clear(userId: string): Promise<void> {
  await generalStorage?.clear(userId);
}

// PROVIDERS
export async function getProviders(userId: string): Promise<ProviderProps[]> {
  return await generalStorage!.getProviders(userId);
}

export async function addProvider(
  provider: ProviderProps | ProviderProps[],
  userId: string,
): Promise<void> {
  await generalStorage?.addProvider(provider, userId);
}

export async function deleteProvider(
  providerId: string,
  userId: string,
): Promise<void> {
  await generalStorage?.deleteProvider(providerId, userId);
}

// TOOLS
export async function getTools(userId: string): Promise<ToolsDB | undefined> {
  return await generalStorage?.getTools(userId);
}

export async function updateTools(
  tools: ToolsProps,
  userId: string,
): Promise<void> {
  await generalStorage?.updateTools(tools, userId);
}

// CHAT
export async function chatGetMessages(
  senderIds: string[],
  userId: string,
): Promise<ChatMessagesProps> {
  return await chatStorage!.getMessages(senderIds, userId);
}

export async function chatAddMessage(
  messages: MessageProps | MessageProps[],
  userId: string,
): Promise<void> {
  await chatStorage?.addMessage(messages, userId);
}

export async function chatDeleteSenderMessages(
  senderId: string,
  userId: string,
): Promise<void> {
  await chatStorage?.deleteSenderMessages(senderId, userId);
}

export async function chatDeleteAllMessages(userId: string): Promise<void> {
  await chatStorage?.deleteAllMessages(userId);
}

export async function chatGetSenders(userId: string): Promise<BaseSender[]> {
  return await chatStorage!.getSenders(userId);
}

export async function chatAddSender(
  sender: BaseSender | BaseSender[],
  userId: string,
): Promise<void> {
  return await chatStorage?.addSender(sender, userId);
}

export async function chatDeleteSender(
  senderId: string,
  userId: string,
): Promise<void> {
  return await chatStorage?.deleteSender(senderId, userId);
}

export async function chatGetSettings(
  userId: string,
): Promise<ChatSettings | undefined> {
  return await chatStorage?.getSettings(userId);
}

export async function chatUpdateSettings(
  settings: ChatSettings,
  userId: string,
): Promise<void> {
  await chatStorage?.updateSettings(settings, userId);
}

// AUDIOTOTEXT
export async function audioToTextGetMessages(
  senderIds: string[],
  userId: string,
): Promise<ChatMessagesProps> {
  return await audioToTextStorage!.getMessages(senderIds, userId);
}

export async function audioToTextAddMessage(
  messages: MessageProps | MessageProps[],
  userId: string,
): Promise<void> {
  await audioToTextStorage?.addMessage(messages, userId);
}

export async function audioToTextDeleteSenderMessages(
  senderId: string,
  userId: string,
): Promise<void> {
  await audioToTextStorage?.deleteSenderMessages(senderId, userId);
}

export async function audioToTextDeleteAllMessages(
  userId: string,
): Promise<void> {
  await audioToTextStorage?.deleteAllMessages(userId);
}

export async function audioToTextGetSenders(
  userId: string,
): Promise<BaseSender[]> {
  return await audioToTextStorage!.getSenders(userId);
}

export async function audioToTextAddSender(
  sender: BaseSender | BaseSender[],
  userId: string,
): Promise<void> {
  return await audioToTextStorage?.addSender(sender, userId);
}

export async function audioToTextDeleteSender(
  senderId: string,
  userId: string,
): Promise<void> {
  return await audioToTextStorage?.deleteSender(senderId, userId);
}

export async function audioToTextGetSettings(
  userId: string,
): Promise<AudioToTextSettings | undefined> {
  return await audioToTextStorage?.getSettings(userId);
}

export async function audioToTextUpdateSettings(
  settings: AudioToTextSettings,
  userId: string,
): Promise<void> {
  await audioToTextStorage?.updateSettings(settings, userId);
}

// CHATBOT
export async function chatbotGetMessages(
  senderIds: string[],
  userId: string,
): Promise<ChatMessagesProps> {
  return await chatbotStorage!.getMessages(senderIds, userId);
}

export async function chatbotAddMessage(
  messages: MessageProps | MessageProps[],
  userId: string,
): Promise<void> {
  await chatbotStorage?.addMessage(messages, userId);
}

export async function chatbotDeleteSenderMessages(
  senderId: string,
  userId: string,
): Promise<void> {
  await chatbotStorage?.deleteSenderMessages(senderId, userId);
}

export async function chatbotDeleteAllMessages(userId: string): Promise<void> {
  await chatbotStorage?.deleteAllMessages(userId);
}

export async function chatbotGetSenders(userId: string): Promise<BaseSender[]> {
  return await chatbotStorage!.getSenders(userId);
}

export async function chatbotAddSender(
  sender: BaseSender | BaseSender[],
  userId: string,
): Promise<void> {
  return await chatbotStorage?.addSender(sender, userId);
}

export async function chatbotDeleteSender(
  senderId: string,
  userId: string,
): Promise<void> {
  return await chatbotStorage?.deleteSender(senderId, userId);
}

// AGENT TRAVELER
export async function agentTravelerGetMessages(
  senderIds: string[],
  userId: string,
): Promise<ChatMessagesProps> {
  return await agentTravelerStorage!.getMessages(senderIds, userId);
}

export async function agentTravelerAddMessage(
  messages: MessageProps | MessageProps[],
  userId: string,
): Promise<void> {
  await agentTravelerStorage?.addMessage(messages, userId);
}

export async function agentTravelerDeleteSenderMessages(
  senderId: string,
  userId: string,
): Promise<void> {
  await agentTravelerStorage?.deleteSenderMessages(senderId, userId);
}

export async function agentTravelerDeleteAllMessages(userId: string): Promise<void> {
  await agentTravelerStorage?.deleteAllMessages(userId);
}

export async function agentTravelerGetSenders(userId: string): Promise<BaseSender[]> {
  return await agentTravelerStorage!.getSenders(userId);
}

export async function agentTravelerAddSender(
  sender: BaseSender | BaseSender[],
  userId: string,
): Promise<void> {
  return await agentTravelerStorage?.addSender(sender, userId);
}

export async function agentTravelerDeleteSender(
  senderId: string,
  userId: string,
): Promise<void> {
  return await agentTravelerStorage?.deleteSender(senderId, userId);
}
