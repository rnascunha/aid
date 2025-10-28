import { Stack, Tooltip, Typography } from "@mui/material";
import { SelectLanguage } from "./selectLanguage";
import { AudioToTextOptions } from "../data";
import { Dispatch, SetStateAction } from "react";

export function ChatHeader({
  opts,
  setOpts,
}: {
  opts: AudioToTextOptions;
  setOpts: Dispatch<SetStateAction<AudioToTextOptions>>;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mx: 2 }}
    >
      <Typography fontSize="large" fontWeight="bold">
        AI
      </Typography>
      <Tooltip title="Source language" placement="left">
        <span>
          <SelectLanguage
            language={opts.language}
            setLanguage={(l) => setOpts((prev) => ({ ...prev, language: l }))}
          />
        </span>
      </Tooltip>
    </Stack>
  );
}
