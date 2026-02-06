import {
  addProvider,
  agentTravelerAddMessage,
  agentTravelerAddSender,
  agentTravelerDeleteAllMessages,
  agentTravelerDeleteSender,
  agentTravelerDeleteSenderMessages,
  agentTravelerGetMessages,
  agentTravelerGetSenders,
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
import { DBExpotFormat, ToolsDB } from "../types";
import {
  BaseSender,
  ChatMessagesProps,
  MessageProps,
  ToolsProps,
} from "../../types";
import { ChatSettings } from "@/appComponents/chat/types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { exportStorage, importStorage } from "../functions";
import { adk_api_agenttraveler } from "@/appComponents/agentTraveler/constants";

export class StorageGeneralMongoDB extends StorageGeneralBase {
  constructor(private _userId: string) {
    super();
  }

  // GENERAL
  async clear(): Promise<void> {
    await clear(this._userId);
  }

  async export(): Promise<DBExpotFormat> {
    return await exportStorage({
      general: this,
      chat: new StorageChatMongoDB(this._userId),
      audioToText: new StorageAudioToTextMongoDB(this._userId),
      chatbot: new StorageChatbotMongoDB(this._userId),
    });
  }

  async import(data: DBExpotFormat): Promise<void> {
    await importStorage(
      {
        general: this,
        chat: new StorageChatMongoDB(this._userId),
        audioToText: new StorageAudioToTextMongoDB(this._userId),
        chatbot: new StorageChatbotMongoDB(this._userId),
      },
      data,
    );
  }

  // PROVIDER
  async getProviders(): Promise<ProviderProps[]> {
    return await getProviders(this._userId);
  }

  async addProvider(provider: ProviderProps | ProviderProps[]): Promise<void> {
    await addProvider(provider, this._userId);
  }

  async deleteProvider(providerId: string): Promise<void> {
    await deleteProvider(providerId, this._userId);
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
    await chatDeleteSenderMessages(senderId, this._userId);
  }

  async deleteAllMessages(): Promise<void> {
    await chatDeleteAllMessages(this._userId);
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await chatGetSenders(this._userId);
  }

  async addSender(sender: BaseSender | BaseSender[]): Promise<void> {
    await chatAddSender(sender, this._userId);
  }

  async deleteSender(senderId: string): Promise<void> {
    await chatDeleteSender(senderId, this._userId);
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
    await audioToTextDeleteSenderMessages(senderId, this._userId);
  }

  async deleteAllMessages(): Promise<void> {
    await audioToTextDeleteAllMessages(this._userId);
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await audioToTextGetSenders(this._userId);
  }

  async addSender(sender: BaseSender | BaseSender[]): Promise<void> {
    await audioToTextAddSender(sender, this._userId);
  }

  async deleteSender(senderId: string): Promise<void> {
    await audioToTextDeleteSender(senderId, this._userId);
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
    await chatbotDeleteSenderMessages(senderId, this._userId);
  }

  async deleteAllMessages(): Promise<void> {
    await chatbotDeleteAllMessages(this._userId);
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await chatbotGetSenders(this._userId);
  }

  async addSender(sender: BaseSender | BaseSender[]): Promise<void> {
    await chatbotAddSender(sender, this._userId);
  }

  async deleteSender(senderId: string): Promise<void> {
    await chatbotDeleteSender(senderId, this._userId);
  }
}

export class StorageAgentTravelerMongoDB extends StorageBase {
  constructor(private _userId: string) {
    super();
  }

  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    return await agentTravelerGetMessages(senderIds, this._userId);
  }

  async addMessage(messages: MessageProps | MessageProps[]): Promise<void> {
    await fetch(adk_api_agenttraveler, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        userId: this._userId,
      }),
    });
    // await agentTravelerAddMessage(messages, this._userId);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await agentTravelerDeleteSenderMessages(senderId, this._userId);
  }

  async deleteAllMessages(): Promise<void> {
    await agentTravelerDeleteAllMessages(this._userId);
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await agentTravelerGetSenders(this._userId);
  }

  async addSender(sender: BaseSender | BaseSender[]): Promise<void> {
    await agentTravelerAddSender(sender, this._userId);
  }

  async deleteSender(senderId: string): Promise<void> {
    await agentTravelerDeleteSender(senderId, this._userId);
  }
}
