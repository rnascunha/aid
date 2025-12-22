export interface BaseSender {
  id: string;
  name: string;
}

export interface MessageContentStatus {
  name?: string;
  text: string;
}

export enum PartType {
  TEXT = "text",
  INLINE_DATA = "inlineData",
  FUNCTION_CALL = "functionCall",
  FUNCTION_RESPONSE = "functionResponse",
}

export type PartText = string;

export interface PartInlineData {
  displayName?: string;
  data: string;
  mimeType: string;
  size?: number;
}

export interface PartFunctionCall {
  name: string;
  args: Record<string, unknown>;
  id: string;
}

export interface PartFunctionResponse {
  name: string;
  response: Record<string, unknown>;
  id: string;
}

export interface Part {
  [PartType.TEXT]?: PartText;
  [PartType.INLINE_DATA]?: PartInlineData;
  [PartType.FUNCTION_CALL]?: PartFunctionCall;
  [PartType.FUNCTION_RESPONSE]?: PartFunctionResponse;
  thought?: boolean;
}

export enum TypeMessage {
  MESSAGE = "message",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export type MessageOrigin = "sent" | "received";

export interface MessageBaseProps {
  id: string;
  timestamp: number;
  senderId: string;
  origin: MessageOrigin;
  raw?: object;
}

export interface MessageStatus extends MessageBaseProps {
  content: MessageContentStatus;
  type:
    | TypeMessage.INFO
    | TypeMessage.WARNING
    | TypeMessage.SUCCESS
    | TypeMessage.ERROR;
}

export interface MessageExachange extends MessageBaseProps {
  content: Part[];
  type: TypeMessage.MESSAGE;
}

export type MessageProps = MessageStatus | MessageExachange;

export type MessageContent = Part | MessageStatus;
export interface MessageFlattenProps extends Omit<MessageProps, "content"> {
  content: MessageContent;
}

export type ChatMessagesProps = Record<string, MessageProps[]>;

export type MessageRoleType = "user" | "assistant" | "system";
export interface MessageContext {
  role: MessageRoleType;
  content: string;
}

/**
 *
 */
export interface ToolsProps {
  ip: string;
  geoLocationApiKey: string;
}
