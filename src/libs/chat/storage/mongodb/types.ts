import { ChatSettings } from "@/appComponents/chat/types";
import { ProviderProps } from "../../models/types";
import { BaseSender, MessageProps, ToolsProps } from "../../types";
import { AudioToTextSettings } from "@/appComponents/audioToText/types";

type AddUserId<T> = T & { userId: string };

export type DBProviderProps = AddUserId<ProviderProps>;
export type DBTools = AddUserId<Omit<ToolsProps, "ip">>;

export type DBBaseSender = AddUserId<BaseSender>;
export type DBMessageProps = AddUserId<MessageProps>;

export type DBChatSettings = AddUserId<ChatSettings>;
export type DBAudioToTextSettings = AddUserId<AudioToTextSettings>;
