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
  chatbotAddMessage,
  chatbotAddSender,
  chatbotDeleteAllMessages,
  chatbotDeleteSender,
  chatbotDeleteSenderMessages,
  chatbotGetMessages,
  chatbotGetSenders,
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
  StorageBase,
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
  constructor(private _userId: string) {
    super();
  }

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
    return await getProviders(this._userId);
  }

  async addProvider(provider: ProviderProps): Promise<void> {
    await addProvider(provider, this._userId);
  }

  async deleteProvider(providerId: string): Promise<void> {
    await deleteProvider(providerId);
  }

  // TOOLS
  async getTools(): Promise<ToolsDB | undefined> {
    return await getTools(this._userId);
  }

  async updateTools(tools: ToolsProps): Promise<void> {
    return await updateTools(tools, this._userId);
  }
}

export class StorageChatMongoDB extends ChatStorageBase {
  constructor(private _userId: string) {
    super();
  }

  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    return await chatGetMessages(senderIds, this._userId);
  }

  async addMessage(messages: MessageProps | MessageProps[]): Promise<void> {
    await chatAddMessage(messages, this._userId);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await chatDeleteSenderMessages(senderId);
  }

  async deleteAllMessages(): Promise<void> {
    await chatDeleteAllMessages(this._userId);
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await chatGetSenders(this._userId);
  }

  async addSender(sender: BaseSender): Promise<void> {
    await chatAddSender(sender, this._userId);
  }

  async deleteSender(senderId: string): Promise<void> {
    await chatDeleteSender(senderId);
  }

  async getSettings(): Promise<ChatSettings | undefined> {
    return await chatGetSettings(this._userId);
  }

  async updateSettings(settings: ChatSettings): Promise<void> {
    await chatUpdateSettings(settings, this._userId);
  }
}

export class StorageAudioToTextMongoDB extends AudioToTextStorageBase {
  constructor(private _userId: string) {
    super();
  }

  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    return await audioToTextGetMessages(senderIds, this._userId);
  }

  async addMessage(messages: MessageProps | MessageProps[]): Promise<void> {
    await audioToTextAddMessage(messages, this._userId);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await audioToTextDeleteSenderMessages(senderId);
  }

  async deleteAllMessages(): Promise<void> {
    await audioToTextDeleteAllMessages(this._userId);
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await audioToTextGetSenders(this._userId);
  }

  async addSender(sender: BaseSender): Promise<void> {
    await audioToTextAddSender(sender, this._userId);
  }

  async deleteSender(senderId: string): Promise<void> {
    await audioToTextDeleteSender(senderId);
  }

  async getSettings(): Promise<AudioToTextSettings | undefined> {
    return await audioToTextGetSettings(this._userId);
  }

  async updateSettings(settings: AudioToTextSettings): Promise<void> {
    await audioToTextUpdateSettings(settings, this._userId);
  }
}

export class StorageChatbotMongoDB extends StorageBase {
  constructor(private _userId: string) {
    super();
  }

  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    return await chatbotGetMessages(senderIds, this._userId);
  }

  async addMessage(messages: MessageProps | MessageProps[]): Promise<void> {
    await chatbotAddMessage(messages, this._userId);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await chatbotDeleteSenderMessages(senderId);
  }

  async deleteAllMessages(): Promise<void> {
    await chatbotDeleteAllMessages(this._userId);
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await chatbotGetSenders(this._userId);
  }

  async addSender(sender: BaseSender): Promise<void> {
    await chatbotAddSender(sender, this._userId);
  }

  async deleteSender(senderId: string): Promise<void> {
    await chatbotDeleteSender(senderId);
  }
}
