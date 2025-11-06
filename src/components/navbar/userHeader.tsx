import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { Session } from "next-auth";
import Image from "next/image";

import LogoutIcon from "@mui/icons-material/Logout";

import { googleLogout } from "@/actions/auth";

interface UserHeaderProps {
  session: Session;
  avatarSize?: number;
  color?: string;
  name?: boolean;
}

export function UserHeader({
  session,
  avatarSize = 36,
  color = "white",
  name = false,
}: UserHeaderProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap={1}
      sx={{
        flex: 1,
      }}
    >
      <Tooltip title={session?.user?.name}>
        <Image
          src={session?.user?.image as string}
          alt={session?.user?.name as string}
          width={avatarSize}
          height={avatarSize}
          style={{
            borderRadius: "50%",
          }}
        />
      </Tooltip>
      {name && <Typography>{session?.user?.name}</Typography>}
      <form action={googleLogout}>
        <Tooltip title="Logout">
          <IconButton type="submit">
            <LogoutIcon
              sx={{
                color: color,
              }}
            />
          </IconButton>
        </Tooltip>
      </form>
    </Stack>
  );
}
