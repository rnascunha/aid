import {
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface SelectModelProps {
  value: string;
  models: string[];
  onChange: (ev: SelectChangeEvent) => void;
}

export function SelectModel({ models, value, onChange }: SelectModelProps) {
  return (
    <Select
      labelId="provider-model-select-label"
      id="provider-model-select"
      value={value}
      onChange={onChange}
      size="small"
      sx={{
        boxShadow: "none",
        // ".MuiOutlinedInput-notchedOutline": { border: 0 },
      }}
    >
      {models.map((model) => (
        <MenuItem dense key={model} value={model}>
          <ListItemText primary={model} />
        </MenuItem>
      ))}
    </Select>
  );
}
