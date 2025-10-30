import { Stack, Typography } from "@mui/material";

import { ReactNode } from "react";

export function ChatHeader({
  chatOptions = undefined,
}: {
  chatOptions?: ReactNode;
}) {
  return (
    <Stack
      sx={{
        pt: 0.5,
        pr: 1,
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
        AIs
      </Typography>
      {chatOptions}
    </Stack>
  );
}
