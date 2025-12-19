import { Stack, Typography } from "@mui/material";

import { ReactNode } from "react";

export function ChatHeader({
  chatOptions = undefined,
  chatTitle = "Models",
}: {
  chatOptions?: ReactNode;
  chatTitle?: string;
}) {
  return (
    <Stack
      sx={{
        pt: 0.5,
        px: 1,
      }}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontSize: "20px",
          fontWeight: "bold",
          mr: "auto",
        }}
      >
        {chatTitle}
      </Typography>
      {chatOptions}
    </Stack>
  );
}
