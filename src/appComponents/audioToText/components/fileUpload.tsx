import styled from "@emotion/styled";
import { Button, Stack, Tooltip, Typography } from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { useRef } from "react";
import { Attachment } from "@/components/chat/types";

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
  file,
  setFile,
  isPending,
  onSubmit,
}: {
  file: Attachment | null;
  setFile: (file: Attachment | null) => void;
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
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={isPending}
        sx={{
          textTransform: "none",
        }}
      >
        <Typography noWrap>{file ? file.name : "AUDIO FILE"}</Typography>
        <VisuallyHiddenInput
          ref={inputRef}
          type="file"
          accept="audio/*"
          name="audio"
          disabled={isPending}
          onChange={(ev) => {
            const file = ev.target.files?.[0];
            if (!file) {
              setFile(null);
              return;
            }
            const newFile = {
              name: file.name,
              type: file.type,
              size: file.size,
              data: URL.createObjectURL(file),
            };
            setFile(newFile);
            onSubmit(newFile);
          }}
        />
      </Button>
      <Tooltip title="Remove file">
        <span>
          <Button
            variant="text"
            sx={{
              minWidth: "32px",
            }}
            onClick={() => {
              setFile(null);
              inputRef.current!.value = "";
            }}
            disabled={file === null || isPending}
          >
            <CloseIcon />
          </Button>
        </span>
      </Tooltip>
    </Stack>
  );
}
