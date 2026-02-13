import { timezones } from "@/libs/datetime";
import {
  Autocomplete,
  Container,
  Stack,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { DateTimePicker, DateTimePickerProps } from "@mui/x-date-pickers";
import { ReactNode } from "react";

export function InputField(props: TextFieldProps) {
  return <TextField size="small" {...props} />;
}

export function ReadOnlyInputField(props: TextFieldProps) {
  const { slotProps, ...others } = props;
  return (
    <InputField
      aria-readonly
      slotProps={{
        input: {
          readOnly: true,
        },
        ...slotProps,
      }}
      {...others}
    />
  );
}

export function BorderBox({
  children,
  title,
}: {
  title?: string;
  children: ReactNode | ReactNode[];
}) {
  return (
    <fieldset
      style={{
        borderRadius: "5px",
        borderColor: "var(--mui-palette-divider)",
      }}
    >
      {title && <legend>{title}</legend>}
      {children}
    </fieldset>
  );
}

export function ArrayString({
  title,
  data,
}: {
  title: string;
  data: string[];
}) {
  if (data.length === 0) return;

  return (
    <BorderBox title={title}>
      <Stack gap={0.5}>
        {data.map((d, i) => (
          <InputField defaultValue={d} key={i} />
        ))}
      </Stack>
    </BorderBox>
  );
}

export function DateTimeInput(props: DateTimePickerProps) {
  return (
    <DateTimePicker slotProps={{ textField: { size: "small" } }} {...props} />
  );
}

export function ScrollableContainer({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  return (
    <Container
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        overflow: "auto",
      }}
    >
      <Stack
        sx={{
          position: "absolute",
          width: "100%",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </Stack>
    </Container>
  );
}

export function TimezoneAutocomplete({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const timezone = timezones.find((t) => value === t.timezone);
  return (
    <Autocomplete
      options={timezones.sort((a, b) =>
        a.offsetMinutes < b.offsetMinutes
          ? -1
          : a.offsetMinutes > b.offsetMinutes
            ? 1
            : 0,
      )}
      defaultValue={timezone}
      groupBy={(op) => op.offset}
      getOptionKey={(op) => op.timezone}
      getOptionLabel={(op) => `${op.timezone} (${op.offset}) - ${op.name} `}
      renderInput={(params) => (
        <TextField {...params} size="small" label={label} />
      )}
    />
  );
}
