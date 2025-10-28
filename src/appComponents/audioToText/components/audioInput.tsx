import { Stack } from "@mui/material";
import { useState } from "react";

import { AudioFileUploadButton } from "./fileUpload";
import { MicInput } from "./micInput";
import { Attachment } from "@/components/chat/types";

interface AudioInputProps {
  onSubmit: (file: Attachment | null) => void;
  isPending: boolean;
}

export function AudioInput({ onSubmit, isPending }: AudioInputProps) {
  const [file, setFile] = useState<Attachment | null>(null);
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100px",
        mx: 4,
        my: 2,
        border: "1px solid",
        borderRadius: "5px",
        borderColor: "background.paper",
      }}
    >
      <Stack direction="row" gap={1}>
        <MicInput
          isPending={isPending}
          onSubmit={(data, size) =>
            onSubmit({
              name: "recorded",
              type: "audio/ogg",
              size: size ?? data.length,
              data,
            })
          }
        />
        <AudioFileUploadButton
          file={file}
          setFile={setFile}
          isPending={isPending}
          onSubmit={onSubmit}
        />
      </Stack>
    </Stack>
  );
}
