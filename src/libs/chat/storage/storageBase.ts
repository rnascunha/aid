import { ChatSettings } from "@/appComponents/chat/types";
import {
  BaseSender,
  ChatMessagesProps,
  MessageProps,
  ToolsProps,
} from "../types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";
import { ProviderProps } from "../models/types";
import { DBExpotFormat, ToolsDB } from "./types";

export abstract class StorageGeneralBase {
  // GENERAL

  /**
   * Clear all data from database
   */
  abstract clear(): Promise<void>;

  /**
   * Export data from database
   */
  abstract export(): Promise<DBExpotFormat>;

  /**
   * Import data to database
   *
   * @param json data to be imported
   */
  abstract import(json: DBExpotFormat): Promise<void>;

  // PROVIDER
  /**
   * Get all providers
   */
  abstract getProviders(): Promise<ProviderProps[]>;

  /**
   * Add provider
   *
   * @param provider Provider to add
   */
  abstract addProvider(
    provider: ProviderProps | ProviderProps[],
  ): Promise<void>;
  /**
   * Delete provider
   *
   * @param providerId Id of provider to delete
   */
  abstract deleteProvider(providerId: string): Promise<void>;

  // TOOLS
  /**
   * Get all tools and configurations
   */
  abstract getTools(): Promise<ToolsDB | undefined>;
  /**
   * Update tool info
   *
   * @param tools tool config to update
   */
  abstract updateTools(tools: ToolsProps): Promise<void>;
}

export abstract class StorageBase {
  // MESSAGES
  /**
   *  Get all messages from all senders
   *
   * @param senderIds Ids from the senders to get message
   */
  abstract getMessages(senderIds: string[]): Promise<ChatMessagesProps>;

  /**
   * A 1 or many messages to the storage
   *
   * @param messages Message (s) to be added
   */
  abstract addMessage(messages: MessageProps | MessageProps[]): Promise<void>;

  /**
   * Delete messages from a sender
   *
   * @param senderId Id of the sender to delete
   */
  abstract deleteSenderMessages(senderId: string): Promise<void>;

  /**
   * Delete all messages from all senders
   */
  abstract deleteAllMessages(): Promise<void>;

  // SENDERS
  /**
   * Get all senders
   */
  abstract getSenders(): Promise<BaseSender[]>;

  /**
   * Add ore or many new senders
   *
   * @param sender sender(s) to be added
   */
  abstract addSender(sender: BaseSender | BaseSender[]): Promise<void>;

  /**
   * Delete sender
   *
   * @param senderId Id of sender to be deleted
   */
  abstract deleteSender(senderId: string): Promise<void>;
}

export abstract class ChatStorageBase extends StorageBase {
  /**
   * Get settings
   */
  abstract getSettings(): Promise<ChatSettings | undefined>;

  /**
   * Update settings
   *
   * @param settings Settings to update
   */
  abstract updateSettings(settings: ChatSettings): Promise<void>;
}

export abstract class AudioToTextStorageBase extends StorageBase {
  /**
   * Get settings
   */
  abstract getSettings(): Promise<AudioToTextSettings | undefined>;

  /**
   * Update settings
   *
   * @param settings Settings to update
   */
  abstract updateSettings(settings: AudioToTextSettings): Promise<void>;
}

export const ChatbotStorageBase = StorageBase;
export type ChatbotStorageBase = StorageBase;

export const AgentTrevelerStorageBase = StorageBase;
export type AgentTrevelerStorageBase = StorageBase;
