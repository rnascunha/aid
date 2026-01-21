import { BaseSender, ChatMessagesProps, MessageProps } from "../../types";
import {
  deleteMessages,
  getAllMessagesByIds,
  getAllSenders,
  onAddRemoveSender,
  onMessage,
} from "./functions";
import {
  AudioToTextStorageBase,
  ChatStorageBase,
  StorageBase,
} from "../storageBase";
import {
  TableAudioToTextSettings,
  TableChatSettings,
  TableMessages,
  TableSenders,
} from "./types";
import { ChatSettings } from "@/appComponents/chat/types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";

export class StorageIndexDB extends StorageBase {
  constructor(
    private _messageTable: TableMessages,
    private _senderTable: TableSenders,
  ) {
    super();
  }

  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    return await getAllMessagesByIds(this._messageTable, senderIds);
  }

  async addMessage(messages: MessageProps | MessageProps[]): Promise<void> {
    await onMessage(this._messageTable, messages);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await deleteMessages(this._messageTable, senderId);
  }

  async deleteAllMessages(): Promise<void> {
    await deleteMessages(this._messageTable);
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await getAllSenders(this._senderTable);
  }

  async addSender(sender: BaseSender): Promise<void> {
    await onAddRemoveSender(this._senderTable, sender, this._messageTable);
  }

  async deleteSender(senderId: string): Promise<void> {
    await onAddRemoveSender(this._senderTable, senderId, this._messageTable);
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
