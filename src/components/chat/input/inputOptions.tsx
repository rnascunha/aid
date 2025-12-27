import { Stack } from "@mui/material";
import { MicInput, MicInputProps } from "./micInput";

import {
  MessageContentStatus,
  PartInlineData,
  TypeMessage,
} from "@/libs/chat/types";
import { AttachFilesList } from "./attachFilesList";
import { InputFile, InputFilesProps } from "./inputFile";
import { InputSubmit, InputSubmitProps } from "./inputSubmitButton";

export interface InputOptionsProps {
  onSubmit: () => Promise<void>;
  disabled: boolean;
  files: PartInlineData[];
  addFiles: (
    parts: PartInlineData[] | PartInlineData | MessageContentStatus,
    type: TypeMessage
  ) => Promise<void>;
  removeFile: (file: PartInlineData, index: number) => void;
  submit?: InputSubmitProps;
  attachment?: InputFilesProps | false;
  record?: MicInputProps | false;
}

export function InputOptions({
  files,
  addFiles,
  removeFile,
  disabled,
  submit,
  attachment,
  record,
}: InputOptionsProps) {
  return (
    <Stack
      direction="row"
      justifyContent={!attachment && !record ? "flex-end" : "space-between"}
      alignItems="center"
      sx={{
        pr: 0.5,
        pb: 0.5,
      }}
    >
      {(attachment || record) && (
        <AttachFilesList files={files} removeFile={removeFile} />
      )}
      <Stack direction="row" gap={0.5}>
        {attachment && (
          <InputFile
            {...attachment}
            disabled={attachment.disabled || disabled}
            onAddFile={addFiles}
          />
        )}
        {record && (
          <MicInput
            {...record}
            disabled={record.disabled || disabled}
            onAddFile={addFiles}
          />
        )}
        <InputSubmit {...submit} disabled={submit?.disabled || disabled} />
      </Stack>
    </Stack>
  );
}
