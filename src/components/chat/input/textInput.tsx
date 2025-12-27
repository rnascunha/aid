import { Input, InputProps } from "@mui/material";

interface TextInputProps extends InputProps {
  onSubmit?: () => void;
  changeValue?: (value: string) => void;
}

export function TextInput({
  onSubmit,
  placeholder,
  fullWidth,
  multiline,
  minRows,
  disableUnderline,
  onKeyDown,
  sx,
  disabled,
  changeValue,
  ...others
}: TextInputProps) {
  return (
    <Input
      placeholder={placeholder ?? "Type something here…"}
      fullWidth={fullWidth}
      aria-label="Message"
      minRows={minRows ?? 2}
      multiline={multiline ?? true}
      disableUnderline={disableUnderline ?? true}
      disabled={disabled}
      onKeyDown={
        onKeyDown
          ? (event) => onKeyDown(event)
          : (event) => {
              if (disabled) return;
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey))
                onSubmit?.();
              if (event.key === "Escape") changeValue?.("");
            }
      }
      sx={{
        px: 2,
        ...sx,
      }}
      {...others}
    />
  );
}
