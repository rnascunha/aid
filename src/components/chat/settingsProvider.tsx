import {
  ProviderAuth,
  ProviderAuthAPIKey,
  ProviderAuthAWS,
  ProviderAuthAzure,
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
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { StaticAvatar } from "./staticAvatar";
import Link from "next/link";

import LaunchIcon from "@mui/icons-material/Launch";
import { useContext, useRef, useState } from "react";
import { aIContext } from "./context";
import { updateProvider } from "@/libs/chat/storage";
import { VisuallyHiddenInput } from "@/components/fileUpload";

import UploadFileSharpIcon from "@mui/icons-material/UploadFileSharp";
import CloseIcon from "@mui/icons-material/Close";
import { readFileText } from "@/libs/fileBrowser";

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

async function readAppCredentialsFile(file: File) {
  try {
    const data = (await readFileText(file)) as string;
    const parsed = JSON.parse(data);
    if (!("project_id" in parsed)) {
      return {
        error: "JSON field missing",
        details: "Missing 'project_id' field",
      };
    }
    return {
      data: JSON.stringify(parsed),
      name: `${parsed.project_id}.json`,
      error: false,
    };
  } catch (e) {
    return {
      error:
        e instanceof DOMException
          ? "Error reading file"
          : e instanceof SyntaxError
          ? "Error parsing file"
          : "Unknow error",
      details: e,
    };
  }
}

function getAppCredentialsName(provider: ProviderProps) {
  try {
    if (
      !("application_credentials" in provider.auth) ||
      provider.auth.application_credentials === ""
    )
      return "";
    const parsed = JSON.parse(provider.auth.application_credentials);
    if (!("project_id" in parsed)) return "";
    return `${parsed.project_id}.json`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return "";
  }
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
  const [file, setFile] = useState(getAppCredentialsName(provider));
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement | null>(null);

  return (
    <Stack gap={1}>
      <TextField
        label="Project ID"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthGoogle).project_id}
        onBlur={(ev) =>
          updateAuthProvider(ev.target.value.trim(), "project_id")
        }
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
        value={file}
        error={!!error}
        helperText={error ?? " "}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <Stack direction="row">
                  <IconButton
                    onClick={async () => {
                      setFile("");
                      await updateAuthProvider("", "application_credentials");
                      input.current!.value = "";
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <IconButton component="label">
                    <UploadFileSharpIcon />
                    <VisuallyHiddenInput
                      ref={input}
                      type="file"
                      accept="application/json"
                      name="appCredentials"
                      onChange={async (ev) => {
                        const file = ev.target.files?.[0];
                        if (!file) {
                          return;
                        }
                        const d = await readAppCredentialsFile(file);
                        if (d.error) {
                          setError(d.error as string);
                          setFile("");
                          input.current!.value = "";
                          await updateAuthProvider(
                            "",
                            "application_credentials"
                          );
                          return;
                        }
                        setError("");
                        setFile(d.name!);
                        await updateAuthProvider(
                          d.data as string,
                          "application_credentials"
                        );
                      }}
                    />
                  </IconButton>
                </Stack>
              </InputAdornment>
            ),
          },
        }}
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
        defaultValue={(provider.auth as ProviderAuthIBMWatsonX).project_id}
        onBlur={(ev) =>
          updateAuthProvider(ev.target.value.trim(), "project_id")
        }
      />
      <TextField
        label="Region"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthIBMWatsonX).service_url}
        onBlur={(ev) =>
          updateAuthProvider(ev.target.value.trim(), "service_url")
        }
      />
      <TextField
        label="App Key"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthIBMWatsonX).key}
        onBlur={(ev) => updateAuthProvider(ev.target.value.trim(), "key")}
      />
    </Stack>
  );
}

function AWSProviderConfig({
  provider,
  updateAuthProvider,
}: {
  provider: ProviderProps;
  updateAuthProvider: (
    k: string,
    field: keyof Omit<ProviderAuthAWS, "type">
  ) => Promise<void> | void;
}) {
  return (
    <Stack gap={1}>
      <TextField
        label="Access Key"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthAWS).access_key}
        onBlur={(ev) =>
          updateAuthProvider(ev.target.value.trim(), "access_key")
        }
      />
      <TextField
        label="Secret Key"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthAWS).secret_key}
        onBlur={(ev) =>
          updateAuthProvider(ev.target.value.trim(), "secret_key")
        }
      />
      <TextField
        label="Region"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthAWS).region}
        onBlur={(ev) => updateAuthProvider(ev.target.value.trim(), "region")}
      />
    </Stack>
  );
}

function AzureProviderConfig({
  provider,
  updateAuthProvider,
}: {
  provider: ProviderProps;
  updateAuthProvider: (
    k: string,
    field: keyof Omit<ProviderAuthAzure, "type">
  ) => Promise<void> | void;
}) {
  return (
    <Stack gap={1}>
      <TextField
        label="API Key"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthAzure).key}
        onBlur={(ev) => updateAuthProvider(ev.target.value.trim(), "key")}
      />
      <TextField
        label="Base URL"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthAzure).base_url}
        onBlur={(ev) => updateAuthProvider(ev.target.value.trim(), "base_url")}
      />
      <TextField
        label="API Version"
        fullWidth
        size="small"
        defaultValue={(provider.auth as ProviderAuthAzure).api_version}
        onBlur={(ev) =>
          updateAuthProvider(ev.target.value.trim(), "api_version")
        }
      />
    </Stack>
  );
}

type UpdateProviderAuthCallback = (
  auth: Partial<ProviderAuth>,
  id: string
) => Promise<void> | void;

interface ProviderAuthDataConfig {
  provider: ProviderProps;
  updateAuthProvider: UpdateProviderAuthCallback;
}

const providerAuthMap = {
  [ProviderAuthType.AUTH_API_KEY]: (
    provider: ProviderProps,
    updateAuthProvider: UpdateProviderAuthCallback
  ) => (
    <APIKeyConfig
      provider={provider}
      updateAuthProvider={async (k) => {
        await updateAuthProvider({ key: k }, provider.id);
      }}
    />
  ),
  [ProviderAuthType.AUTH_GOOGLE]: (
    provider: ProviderProps,
    updateAuthProvider: UpdateProviderAuthCallback
  ) => (
    <GoogleConfig
      provider={provider}
      updateAuthProvider={async (k, field) => {
        await updateAuthProvider({ [field]: k }, provider.id);
      }}
    />
  ),
  [ProviderAuthType.AUTH_IBM_WATSONX]: (
    provider: ProviderProps,
    updateAuthProvider: UpdateProviderAuthCallback
  ) => (
    <IBMWatsonXConfig
      provider={provider}
      updateAuthProvider={async (k, field) => {
        await updateAuthProvider({ [field]: k }, provider.id);
      }}
    />
  ),
  [ProviderAuthType.AUTH_AWS]: (
    provider: ProviderProps,
    updateAuthProvider: UpdateProviderAuthCallback
  ) => (
    <AWSProviderConfig
      provider={provider}
      updateAuthProvider={async (k, field) => {
        await updateAuthProvider({ [field]: k }, provider.id);
      }}
    />
  ),
  [ProviderAuthType.AUTH_AZURE]: (
    provider: ProviderProps,
    updateAuthProvider: UpdateProviderAuthCallback
  ) => (
    <AzureProviderConfig
      provider={provider}
      updateAuthProvider={async (k, field) => {
        await updateAuthProvider({ [field]: k }, provider.id);
      }}
    />
  ),
  [ProviderAuthType.NONE]: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provider: ProviderProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAuthProvider: UpdateProviderAuthCallback
  ) => undefined,
};

function ProviderConfig({
  provider,
  updateAuthProvider,
}: ProviderAuthDataConfig) {
  return providerAuthMap[provider.authType]?.(provider, updateAuthProvider);
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
