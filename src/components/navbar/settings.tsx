import {
  ProviderAuth,
  ProviderAuthAPIKey,
  ProviderAuthGoogle,
  ProviderAuthIBMWatsonX,
  ProviderAuthType,
  ProviderProps,
} from "@/libs/chat/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { StaticAvatar } from "../chat/staticAvatar";
import Link from "next/link";

import LaunchIcon from "@mui/icons-material/Launch";
import { useContext } from "react";
import { aIContext } from "../chat/context";
import { updateProvider } from "@/libs/chat/storage";

function APIKeyConfig({
  provider,
  updateAuthProvider,
}: {
  provider: ProviderProps;
  updateAuthProvider: (k: string) => Promise<void> | void;
}) {
  return (
    <TextField
      label="API Key"
      fullWidth
      size="small"
      defaultValue={(provider.auth as ProviderAuthAPIKey).key}
      onBlur={(ev) => updateAuthProvider(ev.target.value.trim())}
    />
  );
}

function GoogleConfig({
  provider,
  updateAuthProvider,
}: {
  provider: ProviderProps;
  updateAuthProvider: (
    k: string,
    field: keyof Omit<ProviderAuthGoogle, "type">
  ) => Promise<void> | void;
}) {
  return (
    <Stack gap={1}>
      <TextField
        label="Project ID"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthGoogle).projectId}
        onBlur={(ev) => updateAuthProvider(ev.target.value.trim(), "projectId")}
      />
      <TextField
        label="Region"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthGoogle).region}
        onBlur={(ev) => updateAuthProvider(ev.target.value.trim(), "region")}
      />
      <TextField
        label="App Credenitals"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthGoogle).appCredentials}
        onBlur={(ev) =>
          updateAuthProvider(ev.target.value.trim(), "appCredentials")
        }
      />
    </Stack>
  );
}

function IBMWatsonXConfig({
  provider,
  updateAuthProvider,
}: {
  provider: ProviderProps;
  updateAuthProvider: (
    k: string,
    field: keyof Omit<ProviderAuthIBMWatsonX, "type">
  ) => Promise<void> | void;
}) {
  return (
    <Stack gap={1}>
      <TextField
        label="Project ID"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthIBMWatsonX).projectId}
        onBlur={(ev) => updateAuthProvider(ev.target.value.trim(), "projectId")}
      />
      <TextField
        label="Region"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthIBMWatsonX).serviceURL}
        onBlur={(ev) =>
          updateAuthProvider(ev.target.value.trim(), "serviceURL")
        }
      />
      <TextField
        label="App Credenitals"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthIBMWatsonX).key}
        onBlur={(ev) => updateAuthProvider(ev.target.value.trim(), "key")}
      />
    </Stack>
  );
}

function ProviderConfig({
  provider,
  updateAuthProvider,
}: {
  provider: ProviderProps;
  updateAuthProvider: (
    auth: Partial<ProviderAuth>,
    id: string
  ) => Promise<void> | void;
}) {
  switch (provider.auth.type) {
    case ProviderAuthType.AUTH_API_KEY:
      return (
        <APIKeyConfig
          provider={provider}
          updateAuthProvider={async (k) => {
            await updateAuthProvider({ key: k }, provider.id);
          }}
        />
      );
    case ProviderAuthType.AUTH_GOOGLE:
      return (
        <GoogleConfig
          provider={provider}
          updateAuthProvider={async (k, field) => {
            await updateAuthProvider({ [field]: k }, provider.id);
          }}
        />
      );
    case ProviderAuthType.AUTH_IBM_WATSONX:
      return (
        <IBMWatsonXConfig
          provider={provider}
          updateAuthProvider={async (k, field) => {
            await updateAuthProvider({ [field]: k }, provider.id);
          }}
        />
      );
    default:
  }

  return;
}

interface SettingsProps {
  providers: ProviderProps[];
  updateAuthProvider: (
    auth: Partial<ProviderAuth>,
    id: string
  ) => Promise<void> | void;
}

export function Settings({ providers, updateAuthProvider }: SettingsProps) {
  return (
    <List>
      {providers.map((p) => (
        <ListItem
          sx={{
            borderBottom: "1px solid",
            borderColor: "text.secondary",
          }}
          key={p.id}
          secondaryAction={
            <Tooltip title="Site">
              <IconButton LinkComponent={Link} href={p.url} target={"_blank"}>
                <LaunchIcon />
              </IconButton>
            </Tooltip>
          }
        >
          <Stack
            sx={{
              width: "100%",
            }}
          >
            <Stack direction="row" alignItems="center">
              <ListItemIcon>
                <StaticAvatar alt={p.name} src={p.logo} />
              </ListItemIcon>
              <ListItemText primary={p.name} secondary={p.type.join(" | ")} />
            </Stack>
            <ProviderConfig
              provider={p}
              updateAuthProvider={updateAuthProvider}
            />
          </Stack>
        </ListItem>
      ))}
    </List>
  );
}

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { providers, setProviders } = useContext(aIContext);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      aria-hidden="false"
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "500px",
            // height: "450px",
            maxHeight: "80%",
          },
        },
      }}
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Settings
          providers={Object.values(providers)}
          updateAuthProvider={async (auth, id) => {
            setProviders((prev) => ({
              ...prev,
              [id]: {
                ...prev[id],
                auth: {
                  ...prev[id].auth,
                  ...auth,
                } as ProviderAuth,
              },
            }));
            await updateProvider({
              id,
              auth: { ...providers[id].auth, ...auth } as ProviderAuth,
            });
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
