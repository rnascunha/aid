import { ProviderProps } from "./types";
import { IconButton, Stack, Typography } from "@mui/material";
import { StaticAvatar } from "./avatarWithStatus";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { toggleMessagesPane } from "./utils";

type MessagesPaneHeaderProps = {
  provider: ProviderProps;
};

export default function MessagesHeader({ provider }: MessagesPaneHeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
        borderBottom: "1px solid",
        borderColor: "divider",
        overflow: "hidden"
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
        <StaticAvatar src={provider.logo} alt={provider.name} />
        <Stack>
          <Typography
            component="h2"
            noWrap
            fontSize="medium"
            sx={{ fontWeight: "bold" }}
          >
            {provider.name}
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
            {provider.model}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
