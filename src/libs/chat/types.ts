import { z } from "zod";

export const BaseSender = z.object({
  id: z.string(),
  name: z.string(),
});
export type BaseSender = z.infer<typeof BaseSender>;

const MessageContentStatus = z.object({
  name: z.string().optional(),
  text: z.string(),
});
export type MessageContentStatus = z.infer<typeof MessageContentStatus>;

export enum PartType {
  TEXT = "text",
  INLINE_DATA = "inlineData",
  FUNCTION_CALL = "functionCall",
  FUNCTION_RESPONSE = "functionResponse",
}

const PartTypeEnum = z.enum(PartType);

const PartText = z.string();
export type PartText = z.infer<typeof PartText>;

const PartInlineData = z.object({
  displayName: z.string().optional(),
  data: z.string(),
  mimeType: z.string(),
  size: z.number().optional(),
});
export type PartInlineData = z.infer<typeof PartInlineData>;

const PartFunctionCall = z.object({
  name: z.string(),
  args: z.record(z.string(), z.unknown()),
  id: z.string(),
});
export type PartFunctionCall = z.infer<typeof PartFunctionCall>;

const PartFunctionResponse = z.object({
  name: z.string(),
  response: z.record(z.string(), z.unknown()),
  id: z.string(),
});
export type PartFunctionResponse = z.infer<typeof PartFunctionResponse>;

const Part = z.object({
  [PartType.TEXT]: PartText.optional(),
  [PartType.INLINE_DATA]: PartInlineData.optional(),
  [PartType.FUNCTION_CALL]: PartFunctionCall.optional(),
  [PartType.FUNCTION_RESPONSE]: PartFunctionResponse.optional(),
  thought: z.boolean().optional(),
});
export type Part = z.infer<typeof Part>;

export enum TypeMessage {
  MESSAGE = "message",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}
const TypeMessageEnum = z.enum(TypeMessage);

const MessageOrigin = z.enum(["sent", "received"] as const);
export type MessageOrigin = z.infer<typeof MessageOrigin>;

const MessageBaseProps = z.object({
  id: z.string(),
  timestamp: z.number(),
  senderId: z.string(),
  origin: MessageOrigin,
  raw: z.any().optional(),
});
export type MessageBaseProps = z.infer<typeof MessageBaseProps>;

const MessageStatus = MessageBaseProps.extend({
  content: MessageContentStatus,
  type: TypeMessageEnum.exclude(["MESSAGE"]),
});
export type MessageStatus = z.infer<typeof MessageStatus>;

const MessageExachange = MessageBaseProps.extend({
  content: z.array(Part),
  type: TypeMessageEnum.extract(["MESSAGE"]),
});
export type MessageExachange = z.infer<typeof MessageExachange>;

export const MessageProps = z.union([MessageStatus, MessageExachange] as const);
export type MessageProps = z.infer<typeof MessageProps>;

const MessageContent = z.union([Part, MessageStatus] as const);
export type MessageContent = z.infer<typeof MessageContent>;

const MessageFlattenProps = z.union([
  MessageStatus.omit({ content: true }).extend({
    content: MessageContent,
  }),
  MessageExachange.omit({ content: true }).extend({
    content: MessageContent,
  }),
] as const);
export type MessageFlattenProps = z.infer<typeof MessageFlattenProps>;

const ChatMessagesProps = z.record(z.string(), z.array(MessageProps));
export type ChatMessagesProps = z.infer<typeof ChatMessagesProps>;

const MessageRoleType = z.enum(["user", "assistant", "system"] as const);
export type MessageRoleType = z.infer<typeof MessageRoleType>;

const MessageContext = z.object({
  role: MessageRoleType,
  content: z.string(),
});
export type MessageContext = z.infer<typeof MessageContext>;

export const ToolsProps = z.object({
  ip: z.string(),
  geoLocationApiKey: z.string(),
});
export type ToolsProps = z.infer<typeof ToolsProps>;
