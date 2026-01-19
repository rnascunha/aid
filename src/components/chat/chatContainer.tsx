"use client";

import { Container } from "@mui/material";
import { ReactNode, useEffect } from "react";
import { openMessagesPane } from "./utils";

interface ChatContainer {
  chatHeader: ReactNode;
  chatsPane: ReactNode;
  messagePane: ReactNode;
}

export function ChatContainer({
  chatHeader,
  chatsPane,
  messagePane,
}: ChatContainer) {
  useEffect(() => {
    openMessagesPane();
  }, []);

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        position: "relative",
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
          position: { xs: "absolute", sm: "sticky" },
          backgroundColor: "inherit",
          transform: {
            xs: "translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))",
            sm: "none",
          },
          transition: "transform 0.4s, width 0.4s",
          zIndex: 100,
          width: "100%",
          height: "100%",
          pl: 1,
          pr: 0,
          borderRight: "1px solid",
          borderColor: "divider",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {chatHeader}
        {chatsPane}
      </Container>
      {messagePane}
    </Container>
  );
}
