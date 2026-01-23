import {
  BaseSender,
  ChatMessagesProps,
  MessageProps,
  ToolsProps,
} from "../../types";
import {
  AudioToTextStorageBase,
  ChatStorageBase,
  StorageBase,
  StorageGeneralBase,
} from "../storageBase";
import { ChatSettings } from "@/appComponents/chat/types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { ProviderProps } from "../../models/types";
import { ToolsDB } from "../types";
import { Document, MongoClient, ObjectId } from "mongodb";
import { MongoDBCollecions } from "./constants";

const defaultToolKey = "defaultKeyTool";

export class StorageGeneralMongoDB extends StorageGeneralBase {
  constructor(
    private _client: MongoClient,
    private _dbName: string,
    private _collections: MongoDBCollecions,
  ) {
    super();
  }

  private collection<T extends Document>(collection: string) {
    return this._client.db(this._dbName).collection<T>(collection);
  }

  // GENERAL
  async clear(): Promise<void> {
    const promises = Object.values(this._collections).map((c) =>
      this.collection(c).deleteMany({}),
    );
    await Promise.all(promises);
  }

  async export(): Promise<Blob> {
    return new Blob();
  }

  async import(blob: Blob): Promise<void> {}

  // PROVIDER
  async getProviders(): Promise<ProviderProps[]> {
    return await this.collection<ProviderProps>(this._collections.providers)
      .find({})
      .toArray();
  }

  async addProvider(provider: ProviderProps): Promise<void> {
    await this.collection<ProviderProps>(
      this._collections.providers,
    ).findOneAndUpdate({ id: provider.id }, provider, { upsert: true });
  }

  async deleteProvider(providerId: string): Promise<void> {
    await Promise.all([
      this.collection<ProviderProps>(
        this._collections.providers,
      ).findOneAndDelete({
        id: providerId,
      }),
      // deleteModelFromProviderId(
      //     this._chatModels,
      //     providerId,
      //     async (senderId) => {
      //         await this._chatMessages.where("senderId").equals(senderId).delete();
      //     },
      // ),
      // deleteModelFromProviderId(
      //     this._audioToTextModels,
      //     providerId,
      //     async (senderId) => {
      //         await this._audioToTextMessages
      //             .where("senderId")
      //             .equals(senderId)
      //             .delete();
      //     },
      // ),
    ]);
  }

  // TOOLS
  async getTools(): Promise<ToolsDB | undefined> {
    return (await this.collection<ToolsDB>(this._collections.tools).findOne({
      _id: new ObjectId(defaultToolKey),
    })) as ToolsDB;
  }

  async updateTools(tools: ToolsProps): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ip, ...others } = tools;
    await this.collection<ToolsDB>(this._collections.tools).findOneAndUpdate(
      { _id: new ObjectId(defaultToolKey) },
      others,
    );
  }
}

interface StorageMongoDBProps {
  dbName: string;
  messages: string;
  senders: string;
}

export class StorageMongoDB extends StorageBase {
  private _dbName: string;
  private _messages: string;
  private _senders: string;

  constructor(
    private _client: MongoClient,
    { dbName, messages, senders }: StorageMongoDBProps,
  ) {
    super();
    this._dbName = dbName;
    this._messages = messages;
    this._senders = senders;
  }

  private collection<T extends Document>(collection: string) {
    return this._client.db(this._dbName).collection<T>(collection);
  }

  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    const messages = await this.collection<MessageProps>(this._messages)
      .find({})
      .toArray();

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
    if (Array.isArray(messages))
      await this.collection<MessageProps>(this._messages).insertMany(messages);
    else
      await this.collection<MessageProps>(this._messages).insertOne(messages);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await this.collection<MessageProps>(this._messages).deleteMany({
      senderId,
    });
  }

  async deleteAllMessages(): Promise<void> {
    await this.collection<MessageProps>(this._messages).deleteMany({});
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await this.collection<BaseSender>(this._senders).find({}).toArray();
  }

  async addSender(sender: BaseSender): Promise<void> {
    await this.collection<BaseSender>(this._senders).findOneAndUpdate(
      { id: sender.id },
      { $set: sender },
      { upsert: true },
    );
  }

  async deleteSender(senderId: string): Promise<void> {
    await Promise.all([
      this.collection<BaseSender>(this._senders).deleteOne({ id: senderId }),
      this.deleteSenderMessages(senderId),
    ]);
  }
}

const defaultChatSettingsKey = "defaultChatKey";

interface StorageChatMongoDBProps extends StorageMongoDBProps {
  settings: string;
}

export class StorageChatMongoDB extends ChatStorageBase {
  private _base: StorageMongoDB;
  private _dbName: string;
  private _settings: string;

  constructor(
    private _client: MongoClient,
    { dbName, messages, senders, settings }: StorageChatMongoDBProps,
  ) {
    super();
    this._base = new StorageMongoDB(_client, { dbName, messages, senders });
    this._dbName = dbName;
    this._settings = settings;
  }

  private collection<T extends Document>(collection: string) {
    return this._client.db(this._dbName).collection<T>(collection);
  }

  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    return await this._base.getMessages(senderIds);
  }

  async addMessage(messages: MessageProps | MessageProps[]): Promise<void> {
    await this._base.addMessage(messages);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await this._base.deleteSenderMessages(senderId);
  }

  async deleteAllMessages(): Promise<void> {
    await this._base.deleteAllMessages();
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await this._base.getSenders();
  }

  async addSender(sender: BaseSender): Promise<void> {
    await this._base.addSender(sender);
  }

  async deleteSender(senderId: string): Promise<void> {
    await this._base.deleteSender(senderId);
  }

  async getSettings(): Promise<ChatSettings | undefined> {
    return (await this.collection<ChatSettings>(this._settings).findOne({
      _id: new ObjectId(defaultChatSettingsKey),
    })) as ChatSettings;
  }

  async updateSettings(settings: ChatSettings): Promise<void> {
    await this.collection<ChatSettings>(this._settings).findOneAndUpdate(
      { _id: new ObjectId(defaultChatSettingsKey) },
      settings,
      { upsert: true },
    );
  }
}

const defaultAudioToTextSettingsKey = "defaultAudioToText";

type StorageAudioToTextMongoDBProps = StorageChatMongoDBProps;

export class StorageAudioToTextMongoDB extends AudioToTextStorageBase {
  private _base: StorageMongoDB;
  private _dbName: string;
  private _settings: string;

  constructor(
    private _client: MongoClient,
    { dbName, messages, senders, settings }: StorageAudioToTextMongoDBProps,
  ) {
    super();
    this._base = new StorageMongoDB(_client, { dbName, messages, senders });
    this._dbName = dbName;
    this._settings = settings;
  }

  private collection<T extends Document>(collection: string) {
    return this._client.db(this._dbName).collection<T>(collection);
  }

  // Messages
  async getMessages(senderIds: string[]): Promise<ChatMessagesProps> {
    return await this._base.getMessages(senderIds);
  }

  async addMessage(messages: MessageProps | MessageProps[]): Promise<void> {
    await this._base.addMessage(messages);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await this._base.deleteSenderMessages(senderId);
  }

  async deleteAllMessages(): Promise<void> {
    await this._base.deleteAllMessages();
  }

  // Senders
  async getSenders(): Promise<BaseSender[]> {
    return await this._base.getSenders();
  }

  async addSender(sender: BaseSender): Promise<void> {
    await this._base.addSender(sender);
  }

  async deleteSender(senderId: string): Promise<void> {
    await this._base.deleteSender(senderId);
  }

  async getSettings(): Promise<AudioToTextSettings | undefined> {
    return (await this.collection<AudioToTextSettings>(this._settings).findOne({
      _id: new ObjectId(defaultChatSettingsKey),
    })) as AudioToTextSettings;
  }

  async updateSettings(settings: AudioToTextSettings): Promise<void> {
    await this.collection<AudioToTextSettings>(this._settings).findOneAndUpdate(
      { _id: new ObjectId(defaultChatSettingsKey) },
      settings,
      { upsert: true },
    );
  }
}

export const ChatbotStorageIndexDB = StorageMongoDB;
export type ChatbotStorageIndexDB = StorageMongoDB;
