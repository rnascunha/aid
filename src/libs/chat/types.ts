import { StaticImageData } from "next/image";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const providerType = ["chat", "audioToText"] as const;
type ProviderType = (typeof providerType)[number];

export enum ProviderAuthType {
  NONE = "none",
  AUTH_API_KEY = "api_key",
  AUTH_GOOGLE = "google",
  AUTH_IBM_WATSONX = "watsonx",
}

export interface ProviderAuthAPIKey {
  key: string;
}

export interface ProviderAuthGoogle {
  project_id: string;
  region: string;
  application_credentials: string;
}

export interface ProviderAuthIBMWatsonX {
  key: string;
  service_url: string;
  project_id: string;
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
  authType: ProviderAuthType;
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
