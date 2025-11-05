import { Stack, TextField } from "@mui/material";

import { AudioFileUploadButton } from "./fileUpload";
import { MicInput } from "./micInput";
import { Attachment } from "@/libs/chat/types";
import { AudioToTextSettings } from "../types";
import { Dispatch, SetStateAction, useMemo } from "react";
import { debounce } from "@/libs/debounce";

interface AudioInputProps {
  settings: AudioToTextSettings;
  setSettings: Dispatch<SetStateAction<AudioToTextSettings>>;
  onSubmit: (file: Attachment | null) => void;
  isPending: boolean;
}

export function AudioInput({
  onSubmit,
  isPending,
  settings,
  setSettings,
}: AudioInputProps) {
  const updatePrompt = useMemo(
    () =>
      debounce(
        (value: string) => setSettings((prev) => ({ ...prev, prompt: value })),
        500
      ),
    [setSettings]
  );

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="row"
      sx={{
        minHeight: "100px",
        mx: { sm: 4, xs: 0 },
        my: 2,
        border: "1px solid",
        borderRadius: "5px",
        borderColor: "background.paper",
      }}
    >
      <TextField
        label=""
        sx={{ pl: 1 }}
        variant="standard"
        fullWidth
        defaultValue={settings.prompt}
        onChange={(ev) => updatePrompt(ev.target.value)}
      />
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
        <AudioFileUploadButton isPending={isPending} onSubmit={onSubmit} />
      </Stack>
    </Stack>
  );
}
