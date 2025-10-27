import { List } from "@mui/material";
import { ChatMessagesProps, ProviderProps } from "./types";
import { Dispatch, SetStateAction } from "react";
import ChatListItem from "./chatItemList";
import { sortedProviders } from "./functions";

interface ChatListProps {
  providers: ProviderProps[];
  chats: ChatMessagesProps;
  selectedProvider: ProviderProps;
  setSelectedProvider: Dispatch<SetStateAction<ProviderProps>>;
}

export function ChatList({
  providers,
  chats,
  selectedProvider,
  setSelectedProvider,
}: ChatListProps) {
  const sortProvidersId = sortedProviders(chats);
  const sortProviders = sortProvidersId.map((id) =>
    providers.find((p) => p.id === id)
  ) as ProviderProps[];
  return (
    <List dense>
      {sortProviders.map((p) => {
        return (
          <ChatListItem
            key={p.id}
            provider={p}
            sender={p}
            messages={chats[p.id]}
            setSelectedProvider={setSelectedProvider}
            selectedProvider={selectedProvider}
          />
        );
      })}
    </List>
  );
}
