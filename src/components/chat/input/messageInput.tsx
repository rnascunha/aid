"use client";

import { useState } from "react";

import { Input, Stack } from "@mui/material";
import { InputOptions } from "./inputOptions";
import {
  MessageContentStatus,
  Part,
  PartInlineData,
  PartType,
  TypeMessage,
} from "@/libs/chat/types";

export type MessageInputProps = {
  onSubmit: (
    value: Part[] | MessageContentStatus,
    type: TypeMessage
  ) => Promise<void>;
  isPending: boolean;
  disableRecord?: boolean;
  disableAttachment?: boolean;
  allowedAttachmentTypes?: string;
  multipleFiles?: boolean;
};

export function MessageInput({
  onSubmit,
  isPending,
  disableRecord,
  disableAttachment,
  allowedAttachmentTypes,
  multipleFiles,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<PartInlineData[]>([]);

  const canSubmit = !isPending && (text.trim().length > 0 || files.length > 0);

  const onSubmitData = async () => {
    if (!canSubmit) return;

    const parts: Part[] = [];
    const ttext = text.trim();
    if (ttext !== "") parts.push({ text: ttext });

    const fileParts = files.map((f) => ({
      [PartType.INLINE_DATA]: f,
    }));

    parts.push(...fileParts);

    await onSubmit(parts, TypeMessage.MESSAGE);

    setText("");
    setFiles([]);
  };

  const addFiles = async (
    parts: PartInlineData[] | PartInlineData | MessageContentStatus,
    type: TypeMessage
  ) => {
    if (type === TypeMessage.MESSAGE) {
      const partsArray = Array.isArray(parts)
        ? parts
        : ([parts] as PartInlineData[]);
      setFiles((prev) => [...prev, ...partsArray]);
      return;
    }
    await onSubmit(parts as MessageContentStatus, type);
  };
  const removeFile = (file: PartInlineData, index: number) =>
    setFiles((prev) => prev.filter((f, i) => i !== index));

  return (
    <Stack
      sx={{
        borderRadius: "5px",
        border: "1px solid",
        mx: 0.5,
        mb: 0.5,
      }}
    >
      <Input
        placeholder="Type something here…"
        fullWidth
        aria-label="Message"
        onChange={(event) => setText(event.target.value)}
        value={text}
        minRows={2}
        multiline
        disableUnderline={true}
        onKeyDown={(event) => {
          if (isPending) return;
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            onSubmitData();
          }
        }}
        sx={{
          px: 2,
        }}
      />
      <InputOptions
        addFiles={addFiles}
        removeFile={removeFile}
        files={files}
        canSubmit={canSubmit}
        onSubmit={onSubmitData}
        isPending={isPending}
        disableRecord={disableRecord}
        disableAttachment={disableAttachment}
        allowedAttachmentTypes={allowedAttachmentTypes}
        multipleFiles={multipleFiles}
      />
    </Stack>
  );
}
