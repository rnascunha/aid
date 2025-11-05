import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { ProviderProps } from "../../libs/chat/types";
import { StaticAvatar } from "./staticAvatar";
import { providerMap } from "@/appComponents/chat/data";

function ProviderItem({ provider }: { provider: ProviderProps }) {
  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
    >
      <StaticAvatar alt={provider.name} src={provider.logo} />
      <Typography>{provider.name}</Typography>
    </Stack>
  );
}

export function SelectProvider({
  provider,
  setProvider,
  providers,
}: {
  provider: ProviderProps;
  setProvider: (p: ProviderProps) => void;
  providers: ProviderProps[];
}) {
  const handleChange = (event: SelectChangeEvent) => {
    setProvider(providerMap[event.target.value as string]);
  };

  return (
    <Select
      labelId="provider-select-label"
      id="provider-select"
      value={provider.id}
      onChange={handleChange}
      size="small"
      sx={{
        boxShadow: "none",
        // ".MuiOutlinedInput-notchedOutline": { border: 0 },
      }}
    >
      {providers.map((provider) => (
        <MenuItem dense key={provider.id} value={provider.id}>
          <ProviderItem provider={provider} />
        </MenuItem>
      ))}
    </Select>
  );
}
