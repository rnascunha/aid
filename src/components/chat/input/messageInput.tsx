"use client";

import { ReactNode, useState } from "react";

import { Stack } from "@mui/material";
import { InputOptions } from "./inputOptions";
import {
  MessageContentStatus,
  PartInlineData,
  TypeMessage,
} from "@/libs/chat/types";
import { TextInput } from "./textInput";
import { InputOutput, onSubmitInputType } from "./types";
import { InputSubmitProps } from "./inputSubmitButton";
import { InputFilesProps } from "./inputFile";
import { MicInputProps } from "./micInput";

export interface MessageInputProps {
  onSubmit: onSubmitInputType;
  disabled: boolean;
  submit?: InputSubmitProps;
  attachment?: InputFilesProps | false;
  record?: MicInputProps | false;
  otherOptions?: (
    value: InputOutput,
    clear: () => void,
    disabled: boolean,
  ) => ReactNode | ReactNode[];
  onInputChange?: (data: InputOutput) => void;
}

export function MessageInput({
  onSubmit,
  disabled,
  submit,
  attachment,
  record,
  otherOptions,
  onInputChange,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<PartInlineData[]>([]);
  const [isSubmiting, setIsSubmitting] = useState(false);

  const canSubmit =
    !disabled && submit?.disabled !== undefined
      ? !submit.disabled
      : text.trim().length > 0 || files.length > 0;

  const clearData = () => {
    setText("");
    setFiles([]);
  };

  const onSubmitData = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    await onSubmit(
      {
        text: text.trim(),
        files,
      },
      TypeMessage.MESSAGE,
    );
    setIsSubmitting(false);

    clearData();
  };

  const addFiles = async (
    parts: PartInlineData[] | PartInlineData | MessageContentStatus,
    type: TypeMessage,
  ) => {
    if (type === TypeMessage.MESSAGE) {
      let nf: PartInlineData[] = [];
      const partsArray = Array.isArray(parts)
        ? parts
        : ([parts] as PartInlineData[]);
      setFiles((prev) => {
        nf = [...prev, ...partsArray];
        return nf;
      });
      onInputChange?.({ text, files: nf });
      return;
    }
    await onSubmit(parts as MessageContentStatus, type);
  };
  const removeFile = (file: PartInlineData, index: number) => {
    let nf: PartInlineData[] = [];
    setFiles((prev) => {
      nf = prev.filter((f, i) => i !== index);
      return nf;
    });
    onInputChange?.({ text, files: nf });
  };

  const changeText = (value: string) => {
    setText(value);
    onInputChange?.({ text: value, files });
  };

  return (
    <Stack
      sx={{
        borderRadius: "5px",
        border: "1px solid",
        mx: 0.5,
        mb: 0.5,
      }}
    >
      <TextInput
        value={text}
        disabled={disabled}
        onChange={(ev) => changeText(ev.target.value)}
        changeValue={changeText}
        onSubmit={onSubmitData}
      />
      <InputOptions
        onSubmit={onSubmitData}
        addFiles={addFiles}
        removeFile={removeFile}
        files={files}
        submit={{
          onClick: () => onSubmitData(),
          disabled: !canSubmit || isSubmiting,
          ...submit,
        }}
        attachment={attachment}
        record={record}
        disabled={disabled}
        others={otherOptions?.({ text, files }, clearData, !canSubmit)}
      />
    </Stack>
  );
}
