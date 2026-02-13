import { IconButton, Stack, Typography } from "@mui/material";
import { StaticAvatar } from "../staticAvatar";

import { toggleMessagesPane } from "@/components/chat/utils";
import { ReactNode } from "react";
import { BaseSender } from "@/libs/chat/types";
import { StaticImageData } from "next/image";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

type MessagesHeaderProps = {
  sender: BaseSender;
  subtitle?: string;
  options?: ReactNode;
  avatar?: StaticImageData;
};

export function MessagesHeader({
  sender,
  subtitle,
  options,
  avatar,
}: MessagesHeaderProps) {
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
          <StaticAvatar src={avatar} alt={sender.name} />
          <Stack>
            <Typography
              component="h2"
              noWrap
              fontSize="medium"
              sx={{ fontWeight: "bold" }}
            >
              {sender.name}
            </Typography>
            {subtitle && (
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
                {subtitle}
              </Typography>
            )}
          </Stack>
        </Stack>
        {options}
      </Stack>
    </Stack>
  );
}
