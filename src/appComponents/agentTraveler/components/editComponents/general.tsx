import { timezones } from "@/libs/datetime";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  ImageList,
  ImageListItem,
  InputAdornment,
  InputAdornmentProps,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  StackProps,
  TextField,
  TextFieldProps,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { DateTimePicker, DateTimePickerProps } from "@mui/x-date-pickers";
import {
  ElementType,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import Link from "next/link";
import Image from "next/image";

import { Dayjs } from "dayjs";
import { PickerValue } from "@mui/x-date-pickers/internals";

import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import { EditDialog } from "@/components/dialogs/editDialog";

function isHTML(value?: string) {
  if (!value) return false;
  return /^http[s]?:\/\//.test(value);
}

interface ResetValueProps<T> {
  updateState?: () => void;
}

function ResetValue<T>({ updateState }: ResetValueProps<T>) {
  return (
    updateState !== undefined && (
      <Tooltip title="Reset value">
        <IconButton onClick={() => updateState()}>
          <RestartAltIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )
  );
}

interface InputFieldProps extends TextFieldProps<"standard"> {
  updateState?: (value: unknown) => void;
  original?: unknown;
  endAdornment?: ReactNode;
}

export function InputField({
  value,
  defaultValue,
  slotProps,
  updateState,
  original,
  endAdornment,
  sx,
  ...props
}: InputFieldProps) {
  const [v, setV] = useState(value);

  const valid =
    (value as string | undefined) || (defaultValue as string | undefined);
  const isHtml = isHTML(valid);

  return (
    <TextField
      size="small"
      value={v}
      onChange={updateState ? (ev) => setV(ev.target.value) : undefined}
      onBlur={updateState ? () => updateState(v) : undefined}
      defaultValue={defaultValue}
      sx={{
        "& .MuiOutlinedInput-root fieldset": {
          borderColor:
            original === undefined || v === original
              ? undefined
              : "var(--mui-palette-warning-light)",
        },
        ...sx,
      }}
      slotProps={{
        input:
          isHtml || original !== undefined || endAdornment
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    {endAdornment}
                    <ResetValue
                      updateState={() => {
                        setV(original);
                        updateState?.(original);
                      }}
                    />
                    {isHtml && (
                      <Link href={valid as string} target="_blank">
                        <LaunchIcon fontSize="small" color="action" />
                      </Link>
                    )}
                  </InputAdornment>
                ),
              }
            : undefined,
        ...slotProps,
      }}
      {...props}
    />
  );
}

export function ReadOnlyInputField(props: InputFieldProps) {
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

interface ArrayStringProps {
  title: string;
  data: string[];
  original?: string[];
  updateState?: (value: string[]) => void;
  readOnly?: boolean;
}

export function ArrayString({
  title,
  data,
  original,
  readOnly,
  updateState,
}: ArrayStringProps) {
  const addField = () => updateState?.([...data, ""]);
  const deleteField = (index: number) =>
    updateState?.(data.filter((f, i) => i !== index));

  const updateField = (value: string, index: number) => {
    updateState?.(data.map((v, i) => (i !== index ? v : value)));
  };

  return (
    <BorderBox title={title}>
      <Stack gap={0.5}>
        {updateState && (
          <Stack direction="row" alignItems="center">
            <Button
              sx={{
                alignSelf: "flex-start",
              }}
              variant="contained"
              onClick={addField}
            >
              Add
            </Button>
            <ResetValue
              updateState={original ? () => updateState(original) : undefined}
            />
          </Stack>
        )}
        {data.map((d, i) =>
          !readOnly ? (
            <InputField
              value={d}
              key={`${d}-${i}`}
              original={original?.[i]}
              updateState={(v) => updateField(v as string, i)}
              endAdornment={
                <Tooltip title="Delete field">
                  <IconButton onClick={() => deleteField(i)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
            />
          ) : (
            <ReadOnlyInputField defaultValue={d} key={i} />
          ),
        )}
      </Stack>
    </BorderBox>
  );
}

type ResetValueButtonProps = InputAdornmentProps & {
  original?: Dayjs | undefined | null;
  onResetField: () => void;
};

function ResetValueButton({
  original,
  onResetField,
  children,
  sx,
  ...others
}: ResetValueButtonProps) {
  if (!original) return <InputAdornment {...others}>{children}</InputAdornment>;
  return (
    <InputAdornment {...others}>
      <Tooltip title="Reset value">
        <IconButton onClick={() => onResetField()}>
          <RestartAltIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {children}
    </InputAdornment>
  );
}

interface DateTimeInputProps extends DateTimePickerProps {
  original?: Dayjs | null | undefined;
  updateState?: (value: Dayjs | null | undefined) => void;
}

export function DateTimeInput({
  value,
  original,
  updateState,
  sx,
  ...props
}: DateTimeInputProps) {
  const [v, setV] = useState<Dayjs | null | undefined>(value as PickerValue);
  return (
    <DateTimePicker
      value={v}
      onChange={updateState ? (value) => setV(value) : undefined}
      slots={{
        inputAdornment: ResetValueButton as ElementType<InputAdornmentProps>,
      }}
      slotProps={{
        textField: {
          size: "small",
        },
        inputAdornment: {
          original,
          onResetField: () => {
            setV(original);
            updateState?.(original);
          },
        } as any,
      }}
      sx={{
        // ...sx,
        "& .MuiPickersOutlinedInput-notchedOutline": {
          borderColor:
            original === undefined || original === null || v?.isSame(original)
              ? undefined
              : "var(--mui-palette-warning-light)",
        },
      }}
      {...props}
    />
  );
}

export function ScrollableContainer({
  children,
  ref,
}: {
  children: ReactNode | ReactNode[];
  ref: RefObject<HTMLDivElement | null>;
}) {
  return (
    <Container
      ref={ref}
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

interface TimezoneAutocompleteProps {
  label: string;
  value: string;
  original?: string;
  updateState?: (value: string) => void;
}

export function TimezoneAutocomplete({
  label,
  value,
  original,
  updateState,
}: TimezoneAutocompleteProps) {
  const [v, setV] = useState<(typeof timezones)[number] | null | undefined>(
    timezones.find((t) => value === t.timezone),
  );
  return (
    <Autocomplete
      options={timezones.sort((a, b) =>
        a.offsetMinutes < b.offsetMinutes
          ? -1
          : a.offsetMinutes > b.offsetMinutes
            ? 1
            : 0,
      )}
      value={v}
      onChange={(ev, value) => setV(value)}
      onBlur={() => {
        console.log(v?.timezone);
        updateState?.(v?.timezone ?? "");
      }}
      groupBy={(op) => op.offset}
      getOptionKey={(op) => op.timezone}
      getOptionLabel={(op) => `${op.timezone} (${op.offset}) - ${op.name} `}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            "& .MuiOutlinedInput-root fieldset": {
              borderColor:
                original === undefined || v?.timezone === original
                  ? undefined
                  : "var(--mui-palette-warning-light)",
            },
          }}
          size="small"
          label={label}
        />
      )}
    />
  );
}

export function SelectChoices({
  title,
  selected,
  options,
  original,
  updateState,
}: {
  title: string;
  selected: undefined | string;
  options: string[];
  original?: string;
  updateState?: (value: string) => void;
}) {
  return (
    <FormControl fullWidth>
      <InputLabel id="simple-select-label">{title}</InputLabel>
      <Select
        labelId="simple-select-label"
        id="simple-select"
        size="small"
        value={selected}
        label={title}
        onChange={(ev) => updateState?.(ev.target.value)}
        sx={{
          "& fieldset.MuiOutlinedInput-notchedOutline": {
            borderColor:
              original === undefined || selected === original
                ? undefined
                : "var(--mui-palette-warning-light)",
          },
        }}
        endAdornment={
          original ? (
            <InputAdornment
              position="end"
              sx={{
                pr: 1,
              }}
            >
              <Tooltip title="Reset value">
                <IconButton onClick={() => updateState?.(original)}>
                  <RestartAltIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : undefined
        }
      >
        {options.map((o) => (
          <MenuItem value={o} key={o}>
            {o}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function MaxHeightContainer({
  children,
  limit,
}: {
  children: ReactNode;
  limit: number;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const [expand, setExpand] = useState(false);
  const [height, setHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (containerRef.current) {
      const measuredHeight = containerRef.current.offsetHeight;
      setHeight(measuredHeight);
    }
  }, []);

  if (height && height < limit) return children;

  return !expand ? (
    <Box>
      <Box
        ref={containerRef}
        sx={{
          maxHeight: !expand ? limit : undefined,
          overflow: "hidden",
          position: "relative",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0))",
        }}
      >
        {children}
      </Box>
      <Button
        sx={{
          alignSelf: "center",
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        variant="contained"
        onClick={() => setExpand(true)}
      >
        See More
      </Button>
    </Box>
  ) : (
    children
  );
}

export function ImageBoard({
  images,
  alt,
  original,
  updateState,
}: {
  images: string[];
  alt?: string;
  original?: string[];
  updateState?: (data: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const matches = useMediaQuery("(max-width:400px)");
  const deletePhoto = (index: number) =>
    updateState?.(images.filter((img, i) => i !== index));
  const addPhoto = (url: string) => updateState?.([...images, url]);

  return (
    <MaxHeightContainer limit={200}>
      <Stack>
        {updateState && (
          <Stack direction="row">
            <Button variant="contained" onClick={() => setOpen(true)}>
              Add
            </Button>
            {original && (
              <Tooltip title="Reset value">
                <IconButton onClick={() => updateState(original)}>
                  <RestartAltIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <EditDialog
              title="Add photo"
              description="Paste the photo URL"
              open={open}
              handleClose={() => setOpen(false)}
              action={addPhoto}
              clear
              sx={{
                "& .MuiPaper-root": {
                  width: "500px",
                  maxWidth: "100%",
                },
              }}
            />
          </Stack>
        )}
        <ImageList cols={matches ? 2 : 3} rowHeight={164}>
          {images.map((img, i) => (
            <ImageListItem
              key={`${img}-${i}`}
              sx={{
                position: "relative",
              }}
            >
              <Image
                src={img}
                loading="lazy"
                alt={alt || "Location"}
                fill
                sizes="100%"
                style={{
                  objectFit: "contain",
                }}
              />
              <Tooltip
                title="Remove image"
                sx={{
                  "&:hover": {
                    backgroundColor:
                      "rgb(var(--mui-palette-warning-lightChannel) / 0.5)",
                  },
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  zIndex: "10px",
                }}
              >
                <IconButton onClick={() => deletePhoto(i)}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </ImageListItem>
          ))}
        </ImageList>
      </Stack>
    </MaxHeightContainer>
  );
}

interface ElementCarouselCarouselProps extends StackProps {
  data: ReactNode[];
  page?: number;
}

export function ElementCarousel({
  data,
  page: initPage,
  ...props
}: ElementCarouselCarouselProps) {
  const [page, setPage] = useState(initPage ? initPage : 1);
  const ref = useRef<HTMLDivElement>(null);
  const matches = useMediaQuery("(max-width: 300px)");
  return (
    <Stack
      gap={1}
      sx={{
        height: "100%",
        pb: 1,
      }}
      {...props}
    >
      <ScrollableContainer ref={ref}>{data[page - 1]}</ScrollableContainer>
      <Pagination
        sx={{
          alignSelf: "center",
        }}
        count={data.length}
        page={page}
        onChange={(ev, newPage) => {
          setPage(newPage);
          if (ref.current) ref.current.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </Stack>
  );
}
