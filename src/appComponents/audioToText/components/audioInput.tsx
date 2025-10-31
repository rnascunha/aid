import { Stack, TextField } from "@mui/material";

import { AudioFileUploadButton } from "./fileUpload";
import { MicInput } from "./micInput";
import { Attachment } from "@/components/chat/types";
import { AudioToTextOptions } from "../data";
import { Dispatch, SetStateAction, useMemo } from "react";
import { debounce } from "@/libs/debounce";

interface AudioInputProps {
  opts: AudioToTextOptions;
  setOpts: Dispatch<SetStateAction<AudioToTextOptions>>;
  onSubmit: (file: Attachment | null) => void;
  isPending: boolean;
}

export function AudioInput({
  onSubmit,
  isPending,
  opts,
  setOpts,
}: AudioInputProps) {
  const updatePrompt = useMemo(
    () =>
      debounce(
        (value: string) => setOpts((prev) => ({ ...prev, prompt: value })),
        500
      ),
    [setOpts]
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
        defaultValue={opts.prompt}
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
