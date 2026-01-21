import { ChatSettings } from "@/appComponents/chat/types";
import { BaseSender, ChatMessagesProps, MessageProps } from "../types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";

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
   * Add new sender
   *
   * @param sender sender to be added
   */
  abstract addSender(sender: BaseSender): Promise<void>;

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
