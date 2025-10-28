"use client";

import { Button, Stack, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { audioToText, AudioToTextMessage } from "@/actions/ai/audiototext";
import { useActionState, useState } from "react";
import { BouncingLoader } from "@/components/bouncingLoader";

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

function FileUploadButton({
  file,
  setFile,
  formAction,
  pending,
}: {
  file: File | null;
  setFile: (file: File | null) => void;
  formAction: (formData: FormData) => void;
  pending: boolean;
}) {
  return (
    <form action={formAction}>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={pending}
      >
        Audio file
        <VisuallyHiddenInput
          type="file"
          accept="mp3"
          name="audio"
          disabled={pending}
          onChange={(ev) => setFile(ev.target.files?.[0] ?? null)}
        />
      </Button>
      <Button type="submit" disabled={file === null || pending}>
        Send
      </Button>
    </form>
  );
}

function OutputTranscription({
  state,
}: // file,
// setFile,
{
  state: AudioToTextMessage | null;
  file: File | null;
  setFile: (file: File | null) => void;
}) {
  if (state === null) return;
  // const fileName = file?.name;

  if ("success" in state) return <Typography>{state.response}</Typography>;
  return (
    <Stack>
      <Typography fontWeight="bold" fontSize="16px">
        {state.error}
      </Typography>
      <Typography fontSize="14px">{state.detail}</Typography>
    </Stack>
  );
}

export function AudioToText() {
  const [state, formAction, pending] = useActionState(audioToText, null);
  const [file, setFile] = useState<File | null>(null);
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100%",
      }}
      gap={1}
    >
      <FileUploadButton
        file={file}
        setFile={setFile}
        formAction={formAction}
        pending={pending}
      />
      <Typography>{file ? file.name : "No file selected"}</Typography>
      {pending && <BouncingLoader />}
      <OutputTranscription state={state} file={file} setFile={setFile} />
    </Stack>
  );
}
