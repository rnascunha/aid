import { StaticImageData } from "next/image";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const providerType = ["chat", "audioToText"] as const;
type ProviderType = (typeof providerType)[number];

export enum ProviderAuthType {
  NONE = 0,
  AUTH_API_KEY = 1,
  AUTH_GOOGLE = 2,
  AUTH_IBM_WATSONX = 3,
}

export interface ProviderAuthAPIKey {
  readonly type: ProviderAuthType.AUTH_API_KEY;
  key: string;
}

export interface ProviderAuthGoogle {
  readonly type: ProviderAuthType.AUTH_GOOGLE;
  projectId: string;
  region: string;
  appCredentials: string;
}

export interface ProviderAuthIBMWatsonX {
  readonly type: ProviderAuthType.AUTH_IBM_WATSONX;
  key: string;
  serviceURL: string;
  projectId: string;
}

export type ProviderAuth =
  | ProviderAuthAPIKey
  | ProviderAuthGoogle
  | ProviderAuthIBMWatsonX;

export interface ProviderProps {
  id: string;
  name: string;
  logo: StaticImageData;
  url: string;
  provider: string;
  type: ProviderType[];
  auth: ProviderAuth;
}

export interface ModelProps {
  id: string;
  providerId: string;
  name: string;
  model: string;
}

interface ChatErrorMessage {
  code: number;
  error: string;
  detail: string;
}

export interface ChatSuccessMessage {
  success: true;
  response: string;
}

export type ChatMessage = ChatErrorMessage | ChatSuccessMessage;

export interface Attachment {
  name: string;
  size: number;
  type: string;
  data: string;
}

export interface MessageProps {
  id: string;
  content: ChatMessage;
  timestamp: number;
  sender: ModelProps | "You";
  attachment?: Attachment;
}

export type ChatMessagesProps = Record<ModelProps["id"], MessageProps[]>;

export type MessageRoleType = "user" | "assistant" | "system";
export interface MessageContext {
  role: MessageRoleType;
  content: string;
}
