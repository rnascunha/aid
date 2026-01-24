import {
  BaseSender,
  ChatMessagesProps,
  MessageProps,
  ToolsProps,
} from "../../types";
import { ChatSettings } from "@/appComponents/chat/types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { ProviderProps } from "../../models/types";
import { ToolsDB } from "../types";
import { Document, MongoClient } from "mongodb";
import { MongoDBCollecions } from "./constants";
import {
  DBAudioToTextSettings,
  DBBaseSender,
  DBChatSettings,
  DBMessageProps,
  DBProviderProps,
  DBTools,
} from "./types";

export class MongoDBGeneralServer {
  constructor(
    private _client: MongoClient,
    private _dbName: string,
    private _collections: MongoDBCollecions,
  ) {}

  private collection<T extends Document>(collection: string) {
    return this._client.db(this._dbName).collection<T>(collection);
  }

  // GENERAL
  async clear(userId: string): Promise<void> {
    const promises = Object.values(this._collections).map((c) =>
      this.collection(c).deleteMany({ userId }),
    );
    await Promise.all(promises);
  }

  async export(): Promise<Blob> {
    return new Blob();
  }

  async import(blob: Blob): Promise<void> {}

  // PROVIDER
  async getProviders(userId: string): Promise<ProviderProps[]> {
    return await this.collection<DBProviderProps>(this._collections.providers)
      .find({ userId }, { projection: { _id: 0, userId: 0 } })
      .toArray();
  }

  async addProvider(
    provider: ProviderProps | ProviderProps[],
    userId: string,
  ): Promise<void> {
    if (Array.isArray(provider)) {
      if (provider.length > 0)
        await this.collection<DBProviderProps>(
          this._collections.providers,
        ).insertMany(provider.map((p) => ({ ...p, userId })));
    } else
      await this.collection<DBProviderProps>(
        this._collections.providers,
      ).findOneAndUpdate(
        { id: provider.id, userId },
        { $set: { ...provider, userId } },
        { upsert: true },
      );
  }

  async deleteProvider(providerId: string): Promise<void> {
    await Promise.all([
      this.collection<DBProviderProps>(
        this._collections.providers,
      ).findOneAndDelete({
        id: providerId,
      }),
      this.collection<DBBaseSender>(this._collections.chatSenders).deleteMany({
        providerId,
      }),
      this.collection<DBBaseSender>(
        this._collections.audioToTextSenders,
      ).deleteMany({
        providerId,
      }),
    ]);
  }

  // TOOLS
  async getTools(userId: string): Promise<ToolsDB | undefined> {
    return (await this.collection<DBTools>(this._collections.tools).findOne({
      userId,
    })) as ToolsDB;
  }

  async updateTools(tools: ToolsProps, userId: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ip, ...others } = tools;
    await this.collection<DBTools>(this._collections.tools).findOneAndUpdate(
      { userId },
      others,
    );
  }
}

interface MongoDBServerProps {
  dbName: string;
  messages: string;
  senders: string;
}

export class MongoDBServer {
  private _dbName: string;
  private _messages: string;
  private _senders: string;

  constructor(
    private _client: MongoClient,
    { dbName, messages, senders }: MongoDBServerProps,
  ) {
    this._dbName = dbName;
    this._messages = messages;
    this._senders = senders;
  }

  private collection<T extends Document>(collection: string) {
    return this._client.db(this._dbName).collection<T>(collection);
  }

  // Messages
  async getMessages(
    senderIds: string[],
    userId: string,
  ): Promise<ChatMessagesProps> {
    const messages = await this.collection<DBMessageProps>(this._messages)
      .find({ userId }, { projection: { _id: 0, userId: 0 } })
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

  async addMessage(
    messages: MessageProps | MessageProps[],
    userId: string,
  ): Promise<void> {
    if (Array.isArray(messages)) {
      if (messages.length > 0)
        await this.collection<DBMessageProps>(this._messages).insertMany(
          messages.map((m) => ({ ...m, userId })),
        );
    } else
      await this.collection<DBMessageProps>(this._messages).insertOne({
        ...messages,
        userId,
      });
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await this.collection<DBMessageProps>(this._messages).deleteMany({
      senderId,
    });
  }

  async deleteAllMessages(userId: string): Promise<void> {
    await this.collection<DBMessageProps>(this._messages).deleteMany({
      userId,
    });
  }

  // Senders
  async getSenders(userId: string): Promise<BaseSender[]> {
    return await this.collection<DBBaseSender>(this._senders)
      .find({ userId }, { projection: { _id: 0, userId: 0 } })
      .toArray();
  }

  async addSender(
    sender: BaseSender | BaseSender[],
    userId: string,
  ): Promise<void> {
    if (Array.isArray(sender)) {
      if (sender.length > 0)
        await this.collection<DBBaseSender>(this._senders).insertMany(
          sender.map((s) => ({ ...s, userId })),
        );
    } else
      await this.collection<DBBaseSender>(this._senders).findOneAndUpdate(
        { id: sender.id, userId },
        { $set: { ...sender, userId } },
        { upsert: true },
      );
  }

  async deleteSender(senderId: string): Promise<void> {
    await Promise.all([
      this.collection<DBBaseSender>(this._senders).deleteOne({ id: senderId }),
      this.deleteSenderMessages(senderId),
    ]);
  }
}

interface MongoDBChatServerProps extends MongoDBServerProps {
  settings: string;
}

export class MongoDBChatServer {
  private _base: MongoDBServer;
  private _dbName: string;
  private _settings: string;

  constructor(
    private _client: MongoClient,
    { dbName, messages, senders, settings }: MongoDBChatServerProps,
  ) {
    this._base = new MongoDBServer(_client, { dbName, messages, senders });
    this._dbName = dbName;
    this._settings = settings;
  }

  private collection<T extends Document>(collection: string) {
    return this._client.db(this._dbName).collection<T>(collection);
  }

  // Messages
  async getMessages(
    senderIds: string[],
    userId: string,
  ): Promise<ChatMessagesProps> {
    return await this._base.getMessages(senderIds, userId);
  }

  async addMessage(
    messages: MessageProps | MessageProps[],
    userId: string,
  ): Promise<void> {
    await this._base.addMessage(messages, userId);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await this._base.deleteSenderMessages(senderId);
  }

  async deleteAllMessages(userId: string): Promise<void> {
    await this._base.deleteAllMessages(userId);
  }

  // Senders
  async getSenders(userId: string): Promise<BaseSender[]> {
    return await this._base.getSenders(userId);
  }

  async addSender(
    sender: BaseSender | BaseSender[],
    userId: string,
  ): Promise<void> {
    await this._base.addSender(sender, userId);
  }

  async deleteSender(senderId: string): Promise<void> {
    await this._base.deleteSender(senderId);
  }

  async getSettings(userId: string): Promise<ChatSettings | undefined> {
    return (await this.collection<DBChatSettings>(this._settings).findOne(
      {
        userId,
      },
      { projection: { _id: 0, userId: 0 } },
    )) as ChatSettings;
  }

  async updateSettings(settings: ChatSettings, userId: string): Promise<void> {
    await this.collection<DBChatSettings>(this._settings).findOneAndUpdate(
      { userId },
      { $set: { ...settings, userId } },
      { upsert: true },
    );
  }
}

type MongoDBAudioToTextServerProps = MongoDBChatServerProps;

export class MongoDBAudioToTextServer {
  private _base: MongoDBServer;
  private _dbName: string;
  private _settings: string;

  constructor(
    private _client: MongoClient,
    { dbName, messages, senders, settings }: MongoDBAudioToTextServerProps,
  ) {
    this._base = new MongoDBServer(_client, { dbName, messages, senders });
    this._dbName = dbName;
    this._settings = settings;
  }

  private collection<T extends Document>(collection: string) {
    return this._client.db(this._dbName).collection<T>(collection);
  }

  // Messages
  async getMessages(
    senderIds: string[],
    userId: string,
  ): Promise<ChatMessagesProps> {
    return await this._base.getMessages(senderIds, userId);
  }

  async addMessage(
    messages: MessageProps | MessageProps[],
    userId: string,
  ): Promise<void> {
    await this._base.addMessage(messages, userId);
  }

  async deleteSenderMessages(senderId: string): Promise<void> {
    await this._base.deleteSenderMessages(senderId);
  }

  async deleteAllMessages(userId: string): Promise<void> {
    await this._base.deleteAllMessages(userId);
  }

  // Senders
  async getSenders(userId: string): Promise<BaseSender[]> {
    return await this._base.getSenders(userId);
  }

  async addSender(
    sender: BaseSender | BaseSender[],
    userId: string,
  ): Promise<void> {
    await this._base.addSender(sender, userId);
  }

  async deleteSender(senderId: string): Promise<void> {
    await this._base.deleteSender(senderId);
  }

  async getSettings(userId: string): Promise<AudioToTextSettings | undefined> {
    return (await this.collection<DBAudioToTextSettings>(
      this._settings,
    ).findOne(
      {
        userId,
      },
      { projection: { _id: 0, userId: 0 } },
    )) as AudioToTextSettings;
  }

  async updateSettings(
    settings: AudioToTextSettings,
    userId: string,
  ): Promise<void> {
    await this.collection<AudioToTextSettings>(this._settings).findOneAndUpdate(
      { userId },
      { $set: { ...settings, userId } },
      { upsert: true },
    );
  }
}

export const MongoDBChatbotServer = MongoDBServer;
export type MongoDBChatbotServer = MongoDBServer;
