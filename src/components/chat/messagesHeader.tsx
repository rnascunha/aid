import { ModelProps } from "../../libs/chat/types";
import { IconButton, Stack, Typography } from "@mui/material";
import { StaticAvatar } from "./staticAvatar";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { toggleMessagesPane } from "../../libs/chat/utils";
import { ReactNode } from "react";
import { providerMap } from "@/libs/chat/data";

type MessagesPaneHeaderProps = {
  model: ModelProps;
  options?: ReactNode;
};

export function MessagesHeader({ model, options }: MessagesPaneHeaderProps) {
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
          <StaticAvatar
            src={providerMap[model.providerId].logo}
            alt={model.name}
          />
          <Stack>
            <Typography
              component="h2"
              noWrap
              fontSize="medium"
              sx={{ fontWeight: "bold" }}
            >
              {model.name}
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
              {model.model}
            </Typography>
          </Stack>
        </Stack>
        {options}
      </Stack>
    </Stack>
  );
}
