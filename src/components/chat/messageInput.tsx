"use client";

import { checkProviderAvaiable } from "@/libs/chat/functions";
import { ProviderProps } from "@/libs/chat/types";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { ReactNode, useContext, useState } from "react";
import { aIContext } from "./context";

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

export type MessageInputProps = {
  onSubmit: (value: string) => void;
  isPending: boolean;
};

export function MessageInput(props: MessageInputProps) {
  const [text, setText] = useState("");
  const { onSubmit, isPending } = props;
  const handleClick = () => {
    if (text.trim() !== "") {
      onSubmit(text);
      setText("");
    }
  };
  return (
    <TextField
      placeholder="Type something here…"
      fullWidth
      aria-label="Message"
      onChange={(event) => setText(event.target.value)}
      value={text}
      minRows={3}
      multiline
      slotProps={{
        input: {
          endAdornment: (
            <Button
              disabled={text.trim() === "" || isPending}
              color="primary"
              sx={{ alignSelf: "center", borderRadius: "sm", height: "100%" }}
              endIcon={<SendRoundedIcon />}
              onClick={handleClick}
            >
              Send
            </Button>
          ),
        },
      }}
      onKeyDown={(event) => {
        if (isPending) return;
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          handleClick();
        }
      }}
      sx={{
        px: 2,
        pb: 2,
        pt: 0.5,
      }}
    />
  );
}
