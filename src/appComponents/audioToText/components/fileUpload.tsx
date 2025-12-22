import { IconButton, Stack, Tooltip } from "@mui/material";

import { useRef } from "react";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { VisuallyHiddenInput } from "@/components/fileUpload";
import {
  MessageContentStatus,
  PartInlineData,
  TypeMessage,
} from "@/libs/chat/types";
import { serverActionBodySizeLimit } from "../contants";
import { formatBytes } from "@/libs/formatData";

export function AudioFileUploadButton({
  isPending,
  onSubmit,
}: {
  isPending: boolean;
  onSubmit: (
    file: PartInlineData | MessageContentStatus | null,
    type: TypeMessage
  ) => void;
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
                if (file.size > serverActionBodySizeLimit) {
                  onSubmit(
                    {
                      name: "File Limit Exceeded",
                      text: `File '${file.name}' exceeds limit of ${formatBytes(
                        serverActionBodySizeLimit
                      )}`,
                    },
                    TypeMessage.WARNING
                  );
                  inputRef.current!.value = "";
                  return;
                }

                onSubmit(
                  {
                    displayName: file.name,
                    mimeType: file.type,
                    size: file.size,
                    data: URL.createObjectURL(file),
                  },
                  TypeMessage.MESSAGE
                );
                inputRef.current!.value = "";
              }}
            />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
