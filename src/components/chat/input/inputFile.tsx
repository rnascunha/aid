import { Fab } from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import { VisuallyHiddenInput } from "@/components/fileUpload";
import { useRef } from "react";
import {
  MessageContentStatus,
  PartInlineData,
  TypeMessage,
} from "@/libs/chat/types";
import { filePathToBase64 } from "@/libs/base64";

export type InputFilesProps = {
  onSubmit: (
    value: PartInlineData[] | MessageContentStatus,
    type: TypeMessage
  ) => Promise<void>;
  isPending: boolean;
  allowedAttachmentTypes?: string;
  multipleFiles?: boolean;
};

export function InputFile({
  onSubmit,
  isPending,
  allowedAttachmentTypes,
  multipleFiles,
}: InputFilesProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Fab size="small" color="primary" disabled={isPending} component="label">
      <VisuallyHiddenInput
        ref={inputRef}
        type="file"
        accept={allowedAttachmentTypes ?? "audio/*,application/pdf"}
        name="file_upload"
        disabled={isPending}
        multiple={multipleFiles}
        onChange={async (ev) => {
          try {
            const files = ev.target.files;
            if (!files) return;

            const parts = await Promise.all(
              Array.from(files).map(async (f) => {
                const data = await filePathToBase64(
                  URL.createObjectURL(f),
                  f.type
                );
                return {
                  displayName: f.name,
                  mimeType: f.type,
                  size: f.size,
                  data,
                };
              })
            );
            inputRef.current!.value = "";
            await onSubmit(parts, TypeMessage.MESSAGE);
          } catch (e) {
            await onSubmit(
              { name: "Attach File Error", text: (e as Error).message },
              TypeMessage.ERROR
            );
          }
        }}
      />
      <AttachFileIcon />
    </Fab>
  );
}
