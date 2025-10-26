import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { ProviderProps } from "../types";
import { toggleMessagesPane } from "../utils";
import { IconButton, Stack, Typography } from "@mui/material";
import { StaticAvatar } from "./avatarWithStatus";

type MessagesPaneHeaderProps = {
  sender: ProviderProps;
};

export default function MessagesPaneHeader(props: MessagesPaneHeaderProps) {
  const { sender } = props;
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.body",
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1, md: 2 }}
        sx={{ alignItems: "center" }}
      >
        <IconButton
          color="default"
          size="small"
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
          onClick={() => toggleMessagesPane()}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <StaticAvatar src={sender.logo} alt={sender.name} />
        <Typography
          component="h2"
          noWrap
          fontSize="medium"
          sx={{ fontWeight: "bold" }}
        >
          {sender.name}
        </Typography>
      </Stack>
    </Stack>
  );
}
