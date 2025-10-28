import styled from "@emotion/styled";
import { Button, Stack, Tooltip } from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

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

function AudioFileUploadButton({
  file,
  setFile,
  isPending,
  onSubmit,
}: {
  file: File | null;
  setFile: (file: File | null) => void;
  isPending: boolean;
  onSubmit: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <Stack direction="row">
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={isPending}
        sx={{
          textTransform: "none",
        }}
      >
        {file ? file.name : "AUDIO FILE"}
        <VisuallyHiddenInput
          ref={inputRef}
          type="file"
          accept="audio/*"
          name="audio"
          disabled={isPending}
          onChange={(ev) => setFile(ev.target.files?.[0] ?? null)}
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
      <Button
        variant="outlined"
        disabled={file === null || isPending}
        onClick={() => onSubmit(file)}
        endIcon={<SendRoundedIcon />}
      >
        Send
      </Button>
    </Stack>
  );
}

interface AudioInputProps {
  onSubmit: (file: File | null) => void;
  isPending: boolean;
}

export function AudioInput({ onSubmit, isPending }: AudioInputProps) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100px",
        m: 4,
        border: "1px solid",
        borderRadius: "5px",
        borderColor: "background.paper",
      }}
    >
      <AudioFileUploadButton
        file={file}
        setFile={setFile}
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </Stack>
  );
}
