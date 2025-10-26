"use client";

import { Container } from "@mui/material";
import { useState } from "react";
import { ChatProps, ProviderProps } from "../types";
import { providers, chats as allChats } from "../data";
import ChatsPane from "./chatsPane";
import MessagesPane from "./messagePane";

function sortedChats(chats: ChatProps) {
  const list = Object.keys(chats) as (keyof ChatProps)[];
  list.sort((c1, c2) => {
    const m1 = chats[c1].at(-1);
    const m2 = chats[c2].at(-1);
    if (!m1 && !m2) return -1;
    if (m1 && m2) return m1.timestamp < m2.timestamp ? 1 : -1;
    if (m1) return -1;
    return 1;
  });
  return list;
}

export function Messages() {
  const [selectedProviderId, setSelectedUserId] = useState<ProviderProps["id"]>(
    providers[0].id
  );
  const [chats, setChats] = useState(allChats);

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        flex: 1,
        width: "100%",
        mx: "auto",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "minmax(min-content, min(30%, 400px)) 1fr",
        },
        px: 0,
        pt: 1,
      }}
    >
      <Container
        disableGutters
        sx={{
          position: { xs: "fixed", sm: "sticky" },
          transform: {
            xs: "translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))",
            sm: "none",
          },
          transition: "transform 0.4s, width 0.4s",
          zIndex: 100,
          width: "100%",
          pl: 3,
          pr: 0,
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        <ChatsPane
          chats={chats}
          chatList={sortedChats(chats)}
          selectedProviderId={selectedProviderId}
          setSelectedProviderId={setSelectedUserId}
        />
      </Container>
      <MessagesPane
        selectedProviderId={selectedProviderId}
        chats={chats}
        setChats={setChats}
      />
    </Container>
  );
}
