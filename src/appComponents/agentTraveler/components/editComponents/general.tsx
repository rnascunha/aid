import { timezones } from "@/libs/datetime";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  ImageList,
  ImageListItem,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  StackProps,
  TextField,
  TextFieldProps,
  useMediaQuery,
} from "@mui/material";
import { DateTimePicker, DateTimePickerProps } from "@mui/x-date-pickers";
import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import Link from "next/link";
import Image from "next/image";

function isHTML(value?: string) {
  if (!value) return false;
  return /^http[s]?:\/\//.test(value);
}

export function InputField({
  value,
  defaultValue,
  slotProps,
  ...props
}: TextFieldProps) {
  const v =
    (value as string | undefined) || (defaultValue as string | undefined);
  const isHtml = isHTML(v);
  return (
    <TextField
      size="small"
      value={value}
      defaultValue={defaultValue}
      slotProps={{
        input: isHtml
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <Link href={v as string} target="_blank">
                    <LaunchIcon fontSize="small" color="action" />
                  </Link>
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
  readOnly,
}: {
  title: string;
  data: string[];
  readOnly?: boolean;
}) {
  if (data.length === 0) return;

  return (
    <BorderBox title={title}>
      <Stack gap={0.5}>
        {data.map((d, i) =>
          !readOnly ? (
            <InputField defaultValue={d} key={i} />
          ) : (
            <ReadOnlyInputField defaultValue={d} key={i} />
          ),
        )}
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

export function SelectChoices({
  title,
  selected,
  options,
}: {
  title: string;
  selected: undefined | string;
  options: string[];
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
}: {
  images: string[];
  alt?: string;
}) {
  const matches = useMediaQuery("(max-width:400px)");
  return (
    <MaxHeightContainer limit={200}>
      <ImageList cols={matches ? 2 : 3} rowHeight={164}>
        {images.map((img) => (
          <ImageListItem key={img}>
            <Image
              src={img}
              loading="lazy"
              alt={alt || "Location"}
              fill
              style={{
                objectFit: "contain",
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
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
