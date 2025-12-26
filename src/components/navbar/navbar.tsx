import { AppBar, Stack, Typography } from "@mui/material";
import ModeSwitch from "./modeSwitch";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { SideMenuButton } from "../sideMenu";
import Link from "next/link";
import { SettingsDropMenu } from "./settingsDropMenu";

export default async function NavBar() {
  const session = await auth();
  return (
    <AppBar
      variant="elevation"
      position="sticky"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        px: 1,
        py: 0,
        alignItems: "center",
        zIndex: 10001,
      }}
    >
      <Stack direction="row" alignItems="center">
        <SideMenuButton />
        <Typography component="h2" variant="h5">
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
            AId
          </Link>
        </Typography>
      </Stack>
      <Stack direction="row" gap={1}>
        <SettingsDropMenu session={session as Session} />
        <ModeSwitch color="white" />
      </Stack>
    </AppBar>
  );
}
