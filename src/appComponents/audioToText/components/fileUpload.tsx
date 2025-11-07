import styled from "@emotion/styled";
import { IconButton, Stack, Tooltip } from "@mui/material";

import { useRef } from "react";
import { Attachment } from "@/libs/chat/types";
import AudioFileIcon from "@mui/icons-material/AudioFile";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export function AudioFileUploadButton({
  isPending,
  onSubmit,
}: {
  isPending: boolean;
  onSubmit: (file: Attachment | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <Stack
      direction="row"
      alignSelf="center"
      alignItems="center"
      flexWrap="wrap"
    >
      <Tooltip title="Upload file">
        <span>
          <IconButton
            component="label"
            color="primary"
            size="large"
            disabled={isPending}
          >
            <AudioFileIcon fontSize="large" />
            <VisuallyHiddenInput
              ref={inputRef}
              type="file"
              accept="audio/*"
              name="audio"
              disabled={isPending}
              onChange={(ev) => {
                const file = ev.target.files?.[0];
                if (!file) {
                  return;
                }
                const newFile = {
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  data: URL.createObjectURL(file),
                };
                onSubmit(newFile);
                inputRef.current!.value = "";
              }}
            />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
