import { Fab, SxProps } from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import { VisuallyHiddenInput } from "@/components/fileUpload";
import { ChangeEvent, InputHTMLAttributes, ReactNode, useRef } from "react";
import {
  MessageContentStatus,
  PartInlineData,
  TypeMessage,
} from "@/libs/chat/types";
import { filePathToBase64 } from "@/libs/base64";

async function defaultAddFile(
  ev: ChangeEvent<HTMLInputElement>,
  onAddFile?: (
    value: PartInlineData[] | MessageContentStatus,
    type: TypeMessage
  ) => Promise<void> | void
): Promise<void> {
  try {
    const files = ev.target.files;
    if (!files) return;

    const parts = await Promise.all(
      Array.from(files).map(async (f) => {
        const data = await filePathToBase64(URL.createObjectURL(f), f.type);
        return {
          displayName: f.name,
          mimeType: f.type,
          size: f.size,
          data,
        };
      })
    );
    await onAddFile?.(parts, TypeMessage.MESSAGE);
  } catch (e) {
    await onAddFile?.(
      { name: "Attach File Error", text: (e as Error).message },
      TypeMessage.ERROR
    );
  }
}

export interface InputFilesProps extends InputHTMLAttributes<HTMLInputElement> {
  sx?: SxProps;
  icon?: ReactNode;
  onAddFile?: (
    value: PartInlineData[] | MessageContentStatus,
    type: TypeMessage
  ) => Promise<void>;
}

export function InputFile({
  accept,
  multiple,
  disabled,
  onAddFile,
  sx,
  icon,
  ...others
}: InputFilesProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Fab
      size="small"
      color="primary"
      disabled={disabled}
      component="label"
      sx={sx}
    >
      <VisuallyHiddenInput
        ref={inputRef}
        type="file"
        accept={accept ?? "*"}
        name="file_upload"
        disabled={disabled}
        multiple={multiple}
        onChange={async (ev) => {
          await defaultAddFile(ev, onAddFile);
          inputRef.current!.value = "";
        }}
        {...others}
      />
      {icon ?? <AttachFileIcon />}
    </Fab>
  );
}
