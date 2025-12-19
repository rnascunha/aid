import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";

import { providerBaseMap, providersBase } from "@/libs/chat/models/data";
import { ProviderBaseProps, ProviderProps } from "../../../libs/chat/models/types";
import { StaticAvatar } from "../staticAvatar";

function ProviderItem({ provider }: { provider: ProviderProps }) {
  const pBase = providerBaseMap[provider.providerBaseId];
  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
    >
      <StaticAvatar alt={provider.name} src={pBase.logo} />
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
    setProvider(
      providers.find((p) => p.id === event.target.value) as ProviderProps
    );
    // setProvider(providers[event.target.value as string]);
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

function ProviderBaseItem({ provider }: { provider: ProviderBaseProps }) {
  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
    >
      <StaticAvatar alt={provider.name} src={provider.logo} />
      <Stack>
        <Typography>{provider.name}</Typography>
        <Typography fontSize="small" color="textSecondary">
          {provider.type.join(" | ")}
        </Typography>
      </Stack>
    </Stack>
  );
}

export function SelectBaseProvider({
  provider,
  setProvider,
}: {
  provider: ProviderBaseProps;
  setProvider: (p: ProviderBaseProps) => void;
}) {
  const handleChange = (event: SelectChangeEvent) => {
    setProvider(providerBaseMap[event.target.value]);
  };

  return (
    <Select
      labelId="provider-base-select-label"
      id="provider-base-select"
      value={provider.id}
      onChange={handleChange}
      size="small"
      sx={{
        boxShadow: "none",
      }}
    >
      {providersBase.map((provider) => (
        <MenuItem dense key={provider.id} value={provider.id}>
          <ProviderBaseItem provider={provider} />
        </MenuItem>
      ))}
    </Select>
  );
}
