import { List } from "@mui/material";
import { ChatMessagesProps, ModelProps } from "./types";
import { Dispatch, SetStateAction } from "react";
import ChatListItem from "./chatItemList";
import { sortedModels } from "./functions";

interface ChatListProps {
  models: ModelProps[];
  chats: ChatMessagesProps;
  selectedModel: ModelProps;
  setSelectedModel: Dispatch<SetStateAction<ModelProps>>;
}

export function ChatList({
  models,
  chats,
  selectedModel,
  setSelectedModel,
}: ChatListProps) {
  const sortModelsId = sortedModels(chats);
  const sortModels = sortModelsId.map((id) =>
    models.find((p) => p.id === id)
  ) as ModelProps[];
  return (
    <List dense>
      {sortModels.map((p) => {
        return (
          <ChatListItem
            key={p.id}
            model={p}
            sender={p}
            messages={chats[p.id]}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        );
      })}
    </List>
  );
}
