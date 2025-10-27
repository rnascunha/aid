import { ProviderProps } from "./types";
import { Stack, Typography } from "@mui/material";
import { StaticAvatar } from "./avatarWithStatus";

type MessagesPaneHeaderProps = {
  provider: ProviderProps;
};

export default function MessagesHeader({ provider }: MessagesPaneHeaderProps) {
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
        <StaticAvatar src={provider.logo} alt={provider.name} />
        <Typography
          component="h2"
          noWrap
          fontSize="medium"
          sx={{ fontWeight: "bold" }}
        >
          {provider.name}
        </Typography>
      </Stack>
    </Stack>
  );
}
