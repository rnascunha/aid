import { IconButton, Stack, Typography } from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { toggleMessagesPane } from "@/libs/chat/utils";
import { ReactNode } from "react";
import { SessionType } from "../types";

type MessagesPaneHeaderProps = {
  session: SessionType;
  options?: ReactNode;
};

export function MessagesHeader({ session, options }: MessagesPaneHeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
        borderBottom: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          width: "100%",
        }}
      >
        <Stack
          direction="row"
          spacing={{ xs: 1, md: 2 }}
          sx={{ alignItems: "center" }}
          justifyContent="space-between"
        >
          <IconButton
            color="default"
            sx={{ pr: 2, display: { xs: "inline-flex", sm: "none" } }}
            onClick={() => toggleMessagesPane()}
          >
            <ArrowBackIosNewRoundedIcon />
          </IconButton>
          <Stack>
            <Typography
              component="h2"
              noWrap
              fontSize="medium"
              sx={{ fontWeight: "bold" }}
            >
              {session.name}
            </Typography>
            <Typography
              component="h3"
              noWrap
              fontSize="small"
              color="textSecondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {session.id}
            </Typography>
          </Stack>
        </Stack>
        {options}
      </Stack>
    </Stack>
  );
}
