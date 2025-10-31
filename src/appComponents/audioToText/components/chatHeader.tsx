import { Stack, Tooltip } from "@mui/material";
import { SelectLanguage } from "./selectLanguage";
import { AudioToTextOptions } from "../data";
import { Dispatch, SetStateAction } from "react";
import { ChatHeader as ChatHeaderOrigin } from "@/components/chat/chatHeader";
import { OptionsDialog } from "./optionsDialog";

export function ChatHeader({
  opts,
  setOpts,
}: {
  opts: AudioToTextOptions;
  setOpts: Dispatch<SetStateAction<AudioToTextOptions>>;
}) {
  return (
    <ChatHeaderOrigin
      chatOptions={
        <Stack direction="row" alignItems="center">
          <OptionsDialog opts={opts} setOpts={setOpts} />
          <Tooltip title="Source language">
            <span>
              <SelectLanguage
                language={opts.language}
                setLanguage={(l) =>
                  setOpts((prev) => ({ ...prev, language: l }))
                }
              />
            </span>
          </Tooltip>
        </Stack>
      }
    />
  );
}
