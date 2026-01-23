import {
  addProvider,
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
import { ChatStorageBase, StorageGeneralBase } from "../storageBase";
import { ProviderProps } from "../../models/types";
import { ToolsDB } from "../types";
import {
  BaseSender,
  ChatMessagesProps,
  MessageProps,
  ToolsProps,
} from "../../types";
import { ChatSettings } from "@/appComponents/chat/types";

export class StorageGeneralMongoDBBrowser extends StorageGeneralBase {
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

export class StorageChatMongoDBBrowser extends ChatStorageBase {
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

export const generalStorage = new StorageGeneralMongoDBBrowser();
export const chatStorage = new StorageChatMongoDBBrowser();
