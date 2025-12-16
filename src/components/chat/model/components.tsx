import { checkProviderAvaiable, getProviderBase } from "@/libs/chat/functions";
import { StaticAvatar } from "../staticAvatar";
import { ModelProps, ProviderProps } from "./types";
import { providerBaseMap } from "@/libs/chat/data";
import { ReactNode, useContext } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { aIContext } from "../context";

interface ModelAvatarProps {
  sender: ModelProps;
  providers: ProviderProps[];
}

export default function ModelAvatar({ sender, providers }: ModelAvatarProps) {
  return (
    <StaticAvatar
      src={getProviderBase(sender, providers, providerBaseMap)?.logo}
      alt={sender.name}
    />
  );
}

export function MessageInputCheck({
  provider,
  input,
  errorInput = <NoProviderMessageInput />,
}: {
  provider: ProviderProps;
  input: ReactNode;
  errorInput?: ReactNode;
}) {
  return checkProviderAvaiable(provider) ? input : errorInput;
}

export function NoProviderMessageInput() {
  const { setOpenSettings } = useContext(aIContext);
  return (
    <Stack
      justifyContent="center"
      sx={{ p: 2, borderRadius: "5px", mb: 1 }}
      bgcolor="var(--mui-palette-warning-light)"
      gap={1}
    >
      <Typography textAlign="center">
        Configure provider authentication parameters.
      </Typography>
      <Button variant="contained" onClick={() => setOpenSettings(true)}>
        Open Settings
      </Button>
    </Stack>
  );
}
