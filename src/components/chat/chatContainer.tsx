"use client";

import { Container } from "@mui/material";
import { ReactNode } from "react";

interface ChatContainer {
  chatsPane: ReactNode;
  MessagePane: ReactNode;
}

export function ChatContainer({ chatsPane, MessagePane }: ChatContainer) {
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
        {chatsPane}
      </Container>
      {MessagePane}
    </Container>
  );
}
