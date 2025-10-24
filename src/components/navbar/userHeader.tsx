import { IconButton, Stack, Tooltip } from "@mui/material";
import { Session } from "next-auth";
import Image from "next/image";

import LogoutIcon from "@mui/icons-material/Logout";

import { googleLogout } from "@/actions/auth";

export function UserHeader({ session }: { session: Session }) {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Tooltip title={session?.user?.name}>
        <Image
          src={session?.user?.image as string}
          alt={session?.user?.name as string}
          width={36}
          height={36}
          style={{
            borderRadius: "50%",
          }}
        />
      </Tooltip>
      <form action={googleLogout}>
        <Tooltip title="Logout">
          <IconButton type="submit">
            <LogoutIcon
              sx={{
                color: "white",
              }}
            />
          </IconButton>
        </Tooltip>
      </form>
    </Stack>
  );
}
