import { ChatMessagesProps } from "@/libs/chat/types";
import { ChatList } from "../chatList";
import { ModelProps, ProviderProps } from "@/libs/chat/models/types";
import { providerBaseMap } from "@/libs/chat/models/data";
import {
  checkProviderAvaiable,
  getProviderBase,
} from "@/libs/chat/models/functions";

interface ChatModelListProps {
  models: ModelProps[];
  providers: ProviderProps[];
  chats: ChatMessagesProps;
  selectedModel: ModelProps | null;
  setSelectedModel: (modelId: string | null) => void;
}

export function ChatModelList({
  models,
  providers,
  chats,
  selectedModel,
  setSelectedModel,
}: ChatModelListProps) {
  return (
    <ChatList
      senders={models}
      chats={chats}
      selectedSender={selectedModel}
      setSelectedSender={(sender) => {
        setSelectedModel(sender?.id ?? null);
      }}
      getAvatar={(s) => {
        const m = getProviderBase(s as ModelProps, providers, providerBaseMap);
        return m?.logo;
      }}
      getBGColor={(s) => {
        const model = s as ModelProps;
        const provider = providers.find((p) => p.id === model.providerId);
        const hasProviderAuth = provider
          ? checkProviderAvaiable(provider)
          : false;
        return hasProviderAuth ? "inherit" : "background.paper";
      }}
    />
  );
}
