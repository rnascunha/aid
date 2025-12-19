import { Dispatch, SetStateAction } from "react";
import { ModelProps, ProviderBaseProps, ProviderProps } from "./types";

export function checkProviderAvaiable(provider: ProviderProps) {
  return (
    provider.auth === undefined ||
    (Object.values(provider.auth).every((v) => v !== "") &&
      (provider.config === undefined ||
        Object.values(provider.config).every((c) => c !== "")))
  );
}

export function getProviderBase(
  model: ModelProps,
  providers: ProviderProps[],
  providerBaseMap: Record<string, ProviderBaseProps>
) {
  const provider = providers.find((p) => model.providerId === p.id);
  if (!provider) return;
  return providerBaseMap[provider.providerBaseId];
}

export function removeModelsFromRemovedProviders(
  providers: ProviderProps[],
  setModels: Dispatch<SetStateAction<ModelProps[]>>
) {
  const providerIds = providers.map((p) => p.id);
  setModels((prev) => prev.filter((m) => providerIds.includes(m.providerId)));
}
