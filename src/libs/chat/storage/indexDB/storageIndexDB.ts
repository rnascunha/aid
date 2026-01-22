import {
  BaseSender,
  ChatMessagesProps,
  MessageProps,
  ToolsProps,
} from "../../types";
import { deleteModelFromProviderId } from "./functions";
import {
  AudioToTextStorageBase,
  ChatStorageBase,
  StorageBase,
  StorageGeneralBase,
} from "../storageBase";
import {
  StorageStoreType,
  TableAudioToTextSettings,
  TableChatSettings,
  TableMessages,
  TableProviders,
  TableSenders,
  TableTools,
} from "./types";
import { ChatSettings } from "@/appComponents/chat/types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { ProviderProps } from "../../models/types";
import { ToolsDB } from "../types";

const defaultToolKey = "defaultKeyTool";

export class StorageGeneralIndexDB extends StorageGeneralBase {
  constructor(
    private _store: StorageStoreType,
    private _providerTable: TableProviders,
    private _toolsTable: TableTools,
    private _chatModels: TableSenders,
    private _chatMessages: TableMessages,
    private _audioToTextModels: TableSenders,
    private _audioToTextMessages: TableMessages,
  ) {
    super();
  }

  // GENERAL
  async clear(): Promise<void> {
    await this._store.delete();
    await this._store.open();
  }

  async export(): Promise<Blob> {
    return this._store.export();
  }

  async import(blob: Blob): Promise<void> {
    await this.clear();
    await this._store.import(blob);
  }

  // PROVIDER
  async getProviders(): Promise<ProviderProps[]> {
    return await this._providerTable.toArray();
  }

  async addProvider(provider: ProviderProps): Promise<void> {
    await this._providerTable.put(provider);
  }

  async deleteProvider(providerId: string): Promise<void> {
    await Promise.all([
      this._providerTable.delete(providerId),
      deleteModelFromProviderId(
        this._chatModels,
        providerId,
        async (senderId) => {
          await this._chatMessages.where("senderId").equals(senderId).delete();
        },
      ),
      deleteModelFromProviderId(
        this._audioToTextModels,
        providerId,
        async (senderId) => {
          await this._audioToTextMessages
            .where("senderId")
            .equals(senderId)
            .delete();
        },
      ),
    ]);
  }

  // TOOLS
  async getTools(): Promise<ToolsDB | undefined> {
    return await this._toolsTable.get(defaultToolKey);
  }

  async updateTools(tools: ToolsProps): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ip, ...others } = tools;
    await this._toolsTable.put(others, defaultToolKey);
  }
}

export class StorageIndexDB extends StorageBase {
  constructor(
    private _messageTable: TableMessages,
    private _senderTable: TableSenders,
  ) {
    super();
  }

  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    const messages = await this._messageTable.orderBy("timestamp").toArray();

    const baseChats = senderIds.reduce((acc, id) => {
      acc[id] = [];
      return acc;
    }, {} as ChatMessagesProps);

    const chats = messages.reduce((acc, m) => {
      if (!acc[m.senderId]) return acc;
      acc[m.senderId].push(m);
      return acc;
    }, baseChats);

    return chats;
  }

  async addMessage(messages: MessageProps | MessageProps[]): Promise<void> {
    if (Array.isArray(messages)) await this._messageTable.bulkAdd(messages);
    else await this._messageTable.add(messages);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await this._messageTable.where("senderId").equals(senderId).delete();
  }

  async deleteAllMessages(): Promise<void> {
    await this._messageTable.clear();
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await this._senderTable.toArray();
  }

  async addSender(sender: BaseSender): Promise<void> {
    await this._senderTable.put(sender);
  }

  async deleteSender(senderId: string): Promise<void> {
    await Promise.all([
      this._senderTable.delete(senderId),
      this.deleteSenderMessages(senderId),
    ]);
  }
}

const defaultChatSettingsKey = "defaultChatKey";

export class StorageChatIndexDB extends ChatStorageBase {
  private _indexDb: StorageIndexDB;
  constructor(
    messageTable: TableMessages,
    senderTable: TableSenders,
    private _settingsTable: TableChatSettings,
  ) {
    super();
    this._indexDb = new StorageIndexDB(messageTable, senderTable);
  }

  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    return await this._indexDb.getMessages(senderIds);
  }

  async addMessage(messages: MessageProps | MessageProps[]): Promise<void> {
    await this._indexDb.addMessage(messages);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await this._indexDb.deleteSenderMessages(senderId);
  }

  async deleteAllMessages(): Promise<void> {
    await this._indexDb.deleteAllMessages();
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await this._indexDb.getSenders();
  }

  async addSender(sender: BaseSender): Promise<void> {
    await this._indexDb.addSender(sender);
  }

  async deleteSender(senderId: string): Promise<void> {
    await this._indexDb.deleteSender(senderId);
  }

  async getSettings(): Promise<ChatSettings | undefined> {
    return await this._settingsTable.get(defaultChatSettingsKey);
  }

  async updateSettings(settings: ChatSettings): Promise<void> {
    await this._settingsTable.put(settings, defaultChatSettingsKey);
  }
}

const defaultAudioToTextSettingsKey = "defaultAudioToText";

export class StorageAudioToTextIndexDB extends AudioToTextStorageBase {
  private _indexDb: StorageIndexDB;
  constructor(
    messageTable: TableMessages,
    senderTable: TableSenders,
    private _settingsTable: TableAudioToTextSettings,
  ) {
    super();
    this._indexDb = new StorageIndexDB(messageTable, senderTable);
  }

  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    return await this._indexDb.getMessages(senderIds);
  }

  async addMessage(messages: MessageProps | MessageProps[]): Promise<void> {
    await this._indexDb.addMessage(messages);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await this._indexDb.deleteSenderMessages(senderId);
  }

  async deleteAllMessages(): Promise<void> {
    await this._indexDb.deleteAllMessages();
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await this._indexDb.getSenders();
  }

  async addSender(sender: BaseSender): Promise<void> {
    await this._indexDb.addSender(sender);
  }

  async deleteSender(senderId: string): Promise<void> {
    await this._indexDb.deleteSender(senderId);
  }

  async getSettings(): Promise<AudioToTextSettings | undefined> {
    return await this._settingsTable.get(defaultAudioToTextSettingsKey);
  }

  async updateSettings(settings: AudioToTextSettings): Promise<void> {
    await this._settingsTable.put(settings, defaultAudioToTextSettingsKey);
  }
}

export const ChatbotStorageIndexDB = StorageIndexDB;
export type ChatbotStorageIndexDB = StorageIndexDB;
