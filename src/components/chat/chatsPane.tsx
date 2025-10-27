import { ReactNode } from "react";
import { Box, Container, Typography } from "@mui/material";

type ChatsPaneProps = {
  providersList: ReactNode;
};

export default function ChatsPane({ providersList }: ChatsPaneProps) {
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
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontSize: "20px",
            fontWeight: "lg",
            mr: "auto",
          }}
        >
          AIs
        </Typography>
        {providersList}
      </Container>
    </Box>
  );
}
