import { ReactNode } from "react";
import { providerBaseMap } from "@/libs/chat/models/data";
import { ModelProps, ProviderProps } from "@/libs/chat/models/types";
import { MessagesHeader } from "../messagePane/messageHeader";

type MessagesModelHeaderProps = {
  model: ModelProps;
  provider: ProviderProps;
  options?: ReactNode;
};

export function MessagesModelHeader({
  model,
  provider,
  options,
}: MessagesModelHeaderProps) {
  return (
    <MessagesHeader
      sender={model}
      subtitle={model.model}
      options={options}
      avatar={providerBaseMap?.[provider.providerBaseId].logo}
    />
  );
}
