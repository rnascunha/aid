import { Fab, Stack } from "@mui/material";
import { MicInput } from "./micInput";

import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  MessageContentStatus,
  PartInlineData,
  TypeMessage,
} from "@/libs/chat/types";
import { AttachFilesList } from "./attachFilesList";
import { InputFile } from "./inputFile";

export type InputOptionsProps = {
  onSubmit: () => Promise<void>;
  isPending: boolean;
  files: PartInlineData[];
  addFiles: (
    parts: PartInlineData[] | PartInlineData | MessageContentStatus,
    type: TypeMessage
  ) => Promise<void>;
  removeFile: (file: PartInlineData, index: number) => void;
  canSubmit: boolean;
  disableRecord?: boolean;
  disableAttachment?: boolean;
  allowedAttachmentTypes?: string;
  multipleFiles?: boolean;
};

export function InputOptions({
  files,
  onSubmit,
  addFiles,
  removeFile,
  isPending,
  canSubmit,
  disableRecord,
  disableAttachment,
  allowedAttachmentTypes,
  multipleFiles,
}: InputOptionsProps) {
  return (
    <Stack
      direction="row"
      justifyContent={
        disableAttachment && disableRecord ? "flex-end" : "space-between"
      }
      alignItems="center"
      sx={{
        pr: 0.5,
        pb: 0.5,
      }}
    >
      {!disableAttachment && !disableRecord && (
        <AttachFilesList files={files} removeFile={removeFile} />
      )}
      <Stack direction="row" gap={0.5}>
        {!disableAttachment && (
          <InputFile
            onSubmit={addFiles}
            isPending={isPending}
            allowedAttachmentTypes={allowedAttachmentTypes}
            multipleFiles={multipleFiles}
          />
        )}
        {!disableRecord && (
          <MicInput onSubmit={addFiles} isPending={isPending} />
        )}
        <Fab
          size="small"
          color="primary"
          disabled={isPending || !canSubmit}
          onClick={() => onSubmit()}
        >
          <SendRoundedIcon />
        </Fab>
      </Stack>
    </Stack>
  );
}
