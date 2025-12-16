import { List, Stack } from "@mui/material";
import { Dispatch, ReactNode, SetStateAction } from "react";
import ChatListItem from "./chatItemList";
import { sortedModels } from "@/libs/chat/functions";

import HubIcon from "@mui/icons-material/Hub";
import { ChatMessagesModelProps, ModelProps } from "./types";

export function EmptyChatList({
  addModelButton,
}: {
  addModelButton: ReactNode;
}) {
  return (
    <Stack
      sx={{
        height: "100%",
      }}
      justifyContent="center"
      alignItems="center"
      gap={5}
    >
      <HubIcon fontSize="large" />
      {addModelButton}
    </Stack>
  );
}

interface ChatListProps {
  models: ModelProps[];
  chats: ChatMessagesModelProps;
  selectedModel: ModelProps | undefined;
  setSelectedModel: Dispatch<SetStateAction<ModelProps | undefined>>;
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
        if (!p) return;
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
