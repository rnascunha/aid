import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { AudioToTextLanguage, audiToTextLanguageOptions } from "../data";
import Image from "next/image";

function FlagItem({
  value,
  label,
  flagCode,
}: {
  value: string;
  label: string;
  flagCode?: string;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
    >
      <Image
        loading="lazy"
        width={20}
        height={15}
        src={`https://flagcdn.com/w20/${(
          flagCode ?? value
        )?.toLowerCase()}.png`}
        alt={label}
      />
      <Typography>
        {label} ({value})
      </Typography>
    </Stack>
  );
}

export function SelectLanguage({
  language,
  setLanguage,
}: {
  language: string;
  setLanguage: (lg: string) => void;
}) {
  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  return (
    <Select
      labelId="language-select-label"
      id="language-select"
      value={language}
      onChange={handleChange}
      size="small"
      sx={{
        boxShadow: "none",
        ".MuiOutlinedInput-notchedOutline": { border: 0 },
      }}
      renderValue={(value) => {
        const lang = audiToTextLanguageOptions.find(
          (a) => a.value === value
        ) as AudioToTextLanguage;
        const flag = lang.flagCode ?? lang.value;
        return (
          <Image
            loading="lazy"
            width={20}
            height={15}
            src={`https://flagcdn.com/w20/${flag.toLowerCase()}.png`}
            alt={lang.label}
          />
        );
      }}
    >
      {audiToTextLanguageOptions.map((l) => (
        <MenuItem key={l.value} value={l.value}>
          <FlagItem value={l.value} label={l.label} flagCode={l.flagCode} />
        </MenuItem>
      ))}
    </Select>
  );
}
