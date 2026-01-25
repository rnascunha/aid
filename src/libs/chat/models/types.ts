import { BaseSender } from "@/libs/chat/types";

import { StaticImageData } from "next/image";
import { z } from "zod";

const ProviderType = z.enum(["chat", "audioToText"] as const);
export type ProviderType = z.infer<typeof ProviderType>;

export enum ProviderAuthType {
  NONE = "none",
  AUTH_API_KEY = "api_key",
  AUTH_GOOGLE = "google",
  AUTH_IBM_WATSONX = "watsonx",
  AUTH_AWS = "aws",
  AUTH_AZURE = "azure",
}
const ProviderAuthTypeEnum = z.enum(ProviderAuthType);

const ProviderAuthAPIKey = z.object({
  key: z.string(),
});
export type ProviderAuthAPIKey = z.infer<typeof ProviderAuthAPIKey>;

const ProviderAuthGoogle = z.object({
  project_id: z.string(),
  region: z.string(),
  application_credentials: z.string(),
});
export type ProviderAuthGoogle = z.infer<typeof ProviderAuthGoogle>;

const ProviderAuthIBMWatsonX = z.object({
  key: z.string(),
  service_url: z.string(),
  project_id: z.string(),
});
export type ProviderAuthIBMWatsonX = z.infer<typeof ProviderAuthIBMWatsonX>;

const ProviderAuthAWS = z.object({
  access_key: z.string(),
  secret_key: z.string(),
  region: z.string(),
});
export type ProviderAuthAWS = z.infer<typeof ProviderAuthAWS>;

const ProviderAuthAzure = z.object({
  key: z.string(),
  base_url: z.string(),
  api_version: z.string(),
});
export type ProviderAuthAzure = z.infer<typeof ProviderAuthAzure>;

const ProviderAuth = z.union([
  ProviderAuthAPIKey,
  ProviderAuthGoogle,
  ProviderAuthIBMWatsonX,
  ProviderAuthAWS,
  ProviderAuthAzure,
]);
export type ProviderAuth = z.infer<typeof ProviderAuth>;

export enum ProviderConfigType {
  CONFIG_NONE = "none",
  CONFIG_API_URL = "api_url",
}
const ProviderConfigTypeEnum = z.enum(ProviderConfigType);

const ProviderAPIUrlConfig = z.object({
  api_url: z.string(),
  timeout: z.number(),
});
export type ProviderAPIUrlConfig = z.infer<typeof ProviderAPIUrlConfig>;

const ProviderConfig = ProviderAPIUrlConfig;
export type ProviderConfig = ProviderAPIUrlConfig;

export interface ProviderBaseProps {
  id: string;
  name: string;
  logo: StaticImageData;
  url: string;
  provider: string;
  type: ProviderType[];
  authType: ProviderAuthType;
  configType: ProviderConfigType;
}

export const ProviderProps = z.object({
  id: z.string(),
  name: z.string(),
  providerBaseId: z.string(),
  createdDate: z.number(),
  config: ProviderConfig.optional(),
  auth: ProviderAuth.optional(),
});
export type ProviderProps = z.infer<typeof ProviderProps>;

export const ModelProps = BaseSender.extend({
  providerId: z.string(),
  model: z.string(),
});
export type ModelProps = z.infer<typeof ModelProps>;
