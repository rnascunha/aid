import { ReactNode } from "react";
import { Box, Container } from "@mui/material";

type ChatsPaneProps = {
  chatHeader: ReactNode;
  modelsList: ReactNode;
};

export default function ChatsPane({ chatHeader, modelsList }: ChatsPaneProps) {
  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
        overflowY: "auto",
        px: 0,
      }}
    >
      <Container
        disableGutters
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          p: 0,
        }}
      >
        {chatHeader}
        {modelsList}
      </Container>
    </Box>
  );
}
