import { List, Stack } from "@mui/material";
import { ReactNode } from "react";
import ChatListItem from "./chatItemList";
import { sortedSenders } from "@/libs/chat/functions";
import { BaseSender, ChatMessagesProps } from "@/libs/chat/types";

import HubIcon from "@mui/icons-material/Hub";
import { StaticImageData } from "next/image";

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
  senders: BaseSender[];
  chats: ChatMessagesProps;
  selectedSender: BaseSender | null;
  setSelectedSender: (chat: BaseSender | null) => void;
  getAvatar?: (s: BaseSender) => StaticImageData | undefined;
  getBGColor?: (s: BaseSender) => string;
}

export function ChatList({
  senders,
  chats,
  selectedSender,
  setSelectedSender,
  getAvatar,
  getBGColor,
}: ChatListProps) {
  const sortSendersId = sortedSenders(chats);
  const sortSenders = sortSendersId.map((id) =>
    senders.find((p) => p.id === id)
  ) as BaseSender[];

  return (
    <List dense disablePadding>
      {sortSenders.map((p) => {
        if (!p) return;
        return (
          <ChatListItem
            key={p.id}
            sender={p}
            messages={chats[p.id]}
            isSelected={selectedSender?.id === p.id}
            setSelectedModel={setSelectedSender}
            avatar={getAvatar?.(p)}
            bgcolor={getBGColor?.(p)}
          />
        );
      })}
    </List>
  );
}
