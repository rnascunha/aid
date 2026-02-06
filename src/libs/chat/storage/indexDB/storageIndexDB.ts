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
  TableSenders,
} from "./types";
import { ChatSettings } from "@/appComponents/chat/types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { ProviderProps } from "../../models/types";
import { DBExpotFormat, ToolsDB } from "../types";
import { exportStorage, importStorage } from "../functions";

const defaultToolKey = "defaultKeyTool";

export class StorageGeneralIndexDB extends StorageGeneralBase {
  constructor(private _store: StorageStoreType) {
    super();
  }

  // GENERAL
  async clear(): Promise<void> {
    await this._store.delete();
    await this._store.open();
  }

  async export(): Promise<DBExpotFormat> {
    return await exportStorage({
      general: this,
      chat: new StorageChatIndexDB(
        this._store.chatMessages,
        this._store.chatModels,
        this._store.chatSettings,
      ),
      audioToText: new StorageAudioToTextIndexDB(
        this._store.audioToTextMessages,
        this._store.audioToTextModels,
        this._store.audioToTextSettings,
      ),
      chatbot: new StorageChatbotIndexDB(
        this._store.chatbotMessages,
        this._store.chatbotSessions,
      ),
    });
  }

  async import(data: DBExpotFormat): Promise<void> {
    await importStorage(
      {
        general: this,
        chat: new StorageChatIndexDB(
          this._store.chatMessages,
          this._store.chatModels,
          this._store.chatSettings,
        ),
        audioToText: new StorageAudioToTextIndexDB(
          this._store.audioToTextMessages,
          this._store.audioToTextModels,
          this._store.audioToTextSettings,
        ),
        chatbot: new StorageChatbotIndexDB(
          this._store.chatbotMessages,
          this._store.chatbotSessions,
        ),
      },
      data,
    );
  }

  // PROVIDER
  async getProviders(): Promise<ProviderProps[]> {
    return await this._store.providers.toArray();
  }

  async addProvider(provider: ProviderProps | ProviderProps[]): Promise<void> {
    if (Array.isArray(provider)) await this._store.providers.bulkAdd(provider);
    else await this._store.providers.put(provider);
  }

  async deleteProvider(providerId: string): Promise<void> {
    await Promise.all([
      this._store.providers.delete(providerId),
      deleteModelFromProviderId(
        this._store.chatModels,
        providerId,
        async (senderId) => {
          await this._store.chatMessages
            .where("senderId")
            .equals(senderId)
            .delete();
        },
      ),
      deleteModelFromProviderId(
        this._store.audioToTextModels,
        providerId,
        async (senderId) => {
          await this._store.audioToTextMessages
            .where("senderId")
            .equals(senderId)
            .delete();
        },
      ),
    ]);
  }

  // TOOLS
  async getTools(): Promise<ToolsDB | undefined> {
    return await this._store.tools.get(defaultToolKey);
  }

  async updateTools(tools: ToolsProps): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ip, ...others } = tools;
    await this._store.tools.put(others, defaultToolKey);
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

  async addSender(sender: BaseSender | BaseSender[]): Promise<void> {
    if (Array.isArray(sender)) await this._senderTable.bulkAdd(sender);
    else await this._senderTable.put(sender);
  }

  async deleteSender(senderId: string): Promise<void> {
    await Promise.all([
      this._senderTable.delete(senderId),
      this.deleteSenderMessages(senderId),
    ]);
  }
}

const defaultChatSettingsKey = "defaultChatKey";

export class StorageChatIndexDB
  extends StorageIndexDB
  implements ChatStorageBase
{
  constructor(
    messageTable: TableMessages,
    senderTable: TableSenders,
    private _settingsTable: TableChatSettings,
  ) {
    super(messageTable, senderTable);
  }

  async getSettings(): Promise<ChatSettings | undefined> {
    return await this._settingsTable.get(defaultChatSettingsKey);
  }

  async updateSettings(settings: ChatSettings): Promise<void> {
    await this._settingsTable.put(settings, defaultChatSettingsKey);
  }
}

const defaultAudioToTextSettingsKey = "defaultAudioToText";

export class StorageAudioToTextIndexDB
  extends StorageIndexDB
  implements AudioToTextStorageBase
{
  constructor(
    messageTable: TableMessages,
    senderTable: TableSenders,
    private _settingsTable: TableAudioToTextSettings,
  ) {
    super(messageTable, senderTable);
  }

  async getSettings(): Promise<AudioToTextSettings | undefined> {
    return await this._settingsTable.get(defaultAudioToTextSettingsKey);
  }

  async updateSettings(settings: AudioToTextSettings): Promise<void> {
    await this._settingsTable.put(settings, defaultAudioToTextSettingsKey);
  }
}

export const StorageChatbotIndexDB = StorageIndexDB;
export type StorageChatbotIndexDB = StorageIndexDB;

export const StorageAgentTravelerIndexDB = StorageIndexDB;
export type StorageAgentTravelerIndexDB = StorageIndexDB;
