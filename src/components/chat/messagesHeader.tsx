import { ModelProps } from "./types";
import { IconButton, Stack, Typography } from "@mui/material";
import { StaticAvatar } from "./staticAvatar";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { toggleMessagesPane } from "./utils";
import { providerMap } from "@/appComponents/chat/data";

type MessagesPaneHeaderProps = {
  model: ModelProps;
};

export default function MessagesHeader({ model }: MessagesPaneHeaderProps) {
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
      <IconButton
        color="default"
        sx={{ pr: 2, display: { xs: "inline-flex", sm: "none" } }}
        onClick={() => toggleMessagesPane()}
      >
        <ArrowBackIosNewRoundedIcon />
      </IconButton>
      <Stack
        direction="row"
        spacing={{ xs: 1, md: 2 }}
        sx={{ alignItems: "center" }}
      >
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
              // maxWidth: "100%",
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
    </Stack>
  );
}
