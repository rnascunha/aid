import { Container, Typography } from "@mui/material";
import { ReactNode } from "react";

import DeselectIcon from "@mui/icons-material/Deselect";

type MessagesPaneProps = {
  header: ReactNode;
  messages: ReactNode;
  loader: ReactNode;
  input: ReactNode;
};

export function EmptyMessagesPane() {
  return (
    <Container
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        justifyContent: "center",
        alignItems: "center",
        transform: {
          xs: "translateX(calc(200% * (var(--MessagesPane-slideIn, 0))))",
          sm: "none",
        },
      }}
    >
      <DeselectIcon />
      <Typography>No model selected</Typography>
    </Container>
  );
}

export function MessagesPane({
  header,
  messages,
  loader,
  input,
}: MessagesPaneProps) {
  return (
    <Container
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflow: "hidden",
        transform: {
          xs: "translateX(calc(200% * (var(--MessagesPane-slideIn, 0))))",
          sm: "none",
        },
        transition: "transform 0.4s, width 0.4s",
      }}
    >
      {header}
      {messages}
      {loader}
      {input}
    </Container>
  );
}
