import { Tooltip } from "@mui/material";
import { SelectLanguage } from "./selectLanguage";
import { AudioToTextOptions } from "../data";
import { Dispatch, SetStateAction } from "react";
import { ChatHeader as ChatHeaderOrigin } from "@/components/chat/chatHeader";

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
        <Tooltip title="Source language" placement="left">
          <span>
            <SelectLanguage
              language={opts.language}
              setLanguage={(l) => setOpts((prev) => ({ ...prev, language: l }))}
            />
          </span>
        </Tooltip>
      }
    />
  );
}
