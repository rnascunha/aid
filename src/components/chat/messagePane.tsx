import { Container } from "@mui/material";
import { ReactNode } from "react";

type MessagesPaneProps = {
  header: ReactNode;
  messages: ReactNode;
  loader: ReactNode;
  input: ReactNode;
};

export default function MessagesPane({
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
      }}
    >
      {header}
      {messages}
      {loader}
      {input}
    </Container>
  );
}
