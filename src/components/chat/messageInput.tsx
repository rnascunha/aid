"use client";

import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Button, TextField } from "@mui/material";
import { useState } from "react";

export type MessageInputProps = {
  onSubmit: (value: string) => void;
  isPending: boolean;
};

export default function MessageInput(props: MessageInputProps) {
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
