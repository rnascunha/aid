import {
  addProvider,
  audioToTextAddMessage,
  audioToTextAddSender,
  audioToTextDeleteAllMessages,
  audioToTextDeleteSender,
  audioToTextDeleteSenderMessages,
  audioToTextGetMessages,
  audioToTextGetSenders,
  audioToTextGetSettings,
  audioToTextUpdateSettings,
  chatAddMessage,
  chatAddSender,
  chatDeleteAllMessages,
  chatDeleteSender,
  chatDeleteSenderMessages,
  chatGetMessages,
  chatGetSenders,
  chatGetSettings,
  chatUpdateSettings,
  clear,
  deleteProvider,
  getProviders,
  getTools,
  updateTools,
} from "@/actions/mongodb";
import {
  AudioToTextStorageBase,
  ChatStorageBase,
  StorageGeneralBase,
} from "../storageBase";
import { ProviderProps } from "../../models/types";
import { ToolsDB } from "../types";
import {
  BaseSender,
  ChatMessagesProps,
  MessageProps,
  ToolsProps,
} from "../../types";
import { ChatSettings } from "@/appComponents/chat/types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";

export class StorageGeneralMongoDB extends StorageGeneralBase {
  // GENERAL
  async clear(): Promise<void> {
    await clear();
  }

  async export(): Promise<Blob> {
    return new Blob();
  }

  async import(blob: Blob): Promise<void> {}

  // PROVIDER
  async getProviders(): Promise<ProviderProps[]> {
    return await getProviders();
  }

  async addProvider(provider: ProviderProps): Promise<void> {
    await addProvider(provider);
  }

  async deleteProvider(providerId: string): Promise<void> {
    await deleteProvider(providerId);
  }

  // TOOLS
  async getTools(): Promise<ToolsDB | undefined> {
    return await getTools();
  }

  async updateTools(tools: ToolsProps): Promise<void> {
    return await updateTools(tools);
  }
}

export class StorageChatMongoDB extends ChatStorageBase {
  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    return await chatGetMessages(senderIds);
  }

  async addMessage(messages: MessageProps | MessageProps[]): Promise<void> {
    await chatAddMessage(messages);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await chatDeleteSenderMessages(senderId);
  }

  async deleteAllMessages(): Promise<void> {
    await chatDeleteAllMessages();
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await chatGetSenders();
  }

  async addSender(sender: BaseSender): Promise<void> {
    await chatAddSender(sender);
  }

  async deleteSender(senderId: string): Promise<void> {
    await chatDeleteSender(senderId);
  }

  async getSettings(): Promise<ChatSettings | undefined> {
    return await chatGetSettings();
  }

  async updateSettings(settings: ChatSettings): Promise<void> {
    await chatUpdateSettings(settings);
  }
}

export class StorageAudioToTextMongoDB extends AudioToTextStorageBase {
  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    return await audioToTextGetMessages(senderIds);
  }

  async addMessage(messages: MessageProps | MessageProps[]): Promise<void> {
    await audioToTextAddMessage(messages);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await audioToTextDeleteSenderMessages(senderId);
  }

  async deleteAllMessages(): Promise<void> {
    await audioToTextDeleteAllMessages();
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await audioToTextGetSenders();
  }

  async addSender(sender: BaseSender): Promise<void> {
    await audioToTextAddSender(sender);
  }

  async deleteSender(senderId: string): Promise<void> {
    await audioToTextDeleteSender(senderId);
  }

  async getSettings(): Promise<AudioToTextSettings | undefined> {
    return await audioToTextGetSettings();
  }

  async updateSettings(settings: AudioToTextSettings): Promise<void> {
    await audioToTextUpdateSettings(settings);
  }
}

export const generalStorage = new StorageGeneralMongoDB();
export const chatStorage = new StorageChatMongoDB();
export const audioToTextStorage = new StorageAudioToTextMongoDB();
