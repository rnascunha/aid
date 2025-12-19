import {
  ProviderAPIUrlConfig,
  ProviderAuth,
  ProviderAuthAPIKey,
  ProviderAuthAWS,
  ProviderAuthAzure,
  ProviderAuthGoogle,
  ProviderAuthIBMWatsonX,
  ProviderAuthType,
  ProviderBaseProps,
  ProviderConfig,
  ProviderConfigType,
  ProviderProps,
} from "@/libs/chat/models/types";
import {
  Button,
  Divider,
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
import Link from "next/link";

import { useContext, useRef, useState } from "react";
import { VisuallyHiddenInput } from "@/components/fileUpload";
import { readFileText } from "@/libs/fileBrowser";

import {
  providerBaseMap,
  providerAuthTemplate,
  providerConfigTemplate,
  providersBase,
} from "@/libs/chat/models/data";
import { generateUUID } from "@/libs/uuid";

import LaunchIcon from "@mui/icons-material/Launch";
import UploadFileSharpIcon from "@mui/icons-material/UploadFileSharp";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteDialog } from "@/components/dialogs/deleteDialog";
import { SelectBaseProvider } from "../selectProvider";
import { aIContext } from "../../context";
import { StaticAvatar } from "../../staticAvatar";

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
      !("application_credentials" in provider.auth!) ||
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
    field: keyof ProviderAuthGoogle
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
    field: keyof ProviderAuthIBMWatsonX
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
        label="Service URL"
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
    field: keyof ProviderAuthAWS
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
    field: keyof ProviderAuthAzure
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
  updateProvider: UpdateProviderAuthCallback;
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

function ProviderAuthConfig({
  provider,
  updateProvider,
}: ProviderAuthDataConfig) {
  const auth = providerBaseMap[provider.providerBaseId].authType;
  return providerAuthMap[auth]?.(provider, updateProvider);
}

/**
 *
 */

function ProviderConfigAPIUrl({
  provider,
  updateConfigProvider,
}: {
  provider: ProviderProps;
  updateConfigProvider: (
    k: string | number,
    field: keyof ProviderConfig
  ) => Promise<void> | void;
}) {
  return (
    <Stack gap={1}>
      <TextField
        label="API Url"
        fullWidth
        size="small"
        defaultValue={(provider.config as ProviderAPIUrlConfig).api_url}
        onBlur={(ev) => updateConfigProvider(ev.target.value.trim(), "api_url")}
      />
      <TextField
        label="Timeout"
        fullWidth
        size="small"
        type="number"
        defaultValue={(provider.config as ProviderAPIUrlConfig).timeout}
        onBlur={(ev) =>
          updateConfigProvider(+ev.target.value.trim(), "timeout")
        }
        slotProps={{
          htmlInput: {
            min: 0,
            step: 1,
          },
        }}
      />
    </Stack>
  );
}

type UpdateProviderConfigCallback = (
  auth: Partial<ProviderConfig>,
  id: string
) => Promise<void> | void;

interface ProviderConfigDataConfig {
  provider: ProviderProps;
  updateProvider: UpdateProviderConfigCallback;
}

const providerConfigMap = {
  [ProviderConfigType.CONFIG_API_URL]: (
    provider: ProviderProps,
    updateConfigProvider: UpdateProviderConfigCallback
  ) => (
    <ProviderConfigAPIUrl
      provider={provider}
      updateConfigProvider={async (k, field) => {
        await updateConfigProvider({ [field]: k }, provider.id);
      }}
    />
  ),
  [ProviderConfigType.CONFIG_NONE]: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provider: ProviderProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateConfigProvider: UpdateProviderConfigCallback
  ) => undefined,
} as const;

function ProviderConfigConfig({
  provider,
  updateProvider,
}: ProviderConfigDataConfig) {
  const config = providerBaseMap[provider.providerBaseId].configType;
  return providerConfigMap[config]?.(provider, updateProvider);
}

/**
 *
 */
interface AddProviderHeaderProps {
  addProvider: (p: ProviderProps) => void;
}

function AddProviderHeader({ addProvider }: AddProviderHeaderProps) {
  const [selectedBaseProvider, setSelectedBaseProvider] =
    useState<ProviderBaseProps>(providersBase[0]);

  return (
    <Stack
      sx={{
        gap: 1,
        mt: 1,
      }}
    >
      <SelectBaseProvider
        provider={selectedBaseProvider}
        setProvider={setSelectedBaseProvider}
      />
      <Button
        variant="contained"
        onClick={() =>
          addProvider({
            id: generateUUID(),
            name: selectedBaseProvider.name,
            providerBaseId: selectedBaseProvider.id,
            createdDate: Date.now(),
            auth: providerAuthTemplate[selectedBaseProvider.authType],
            config: providerConfigTemplate[selectedBaseProvider.configType],
          })
        }
      >
        Add
      </Button>
    </Stack>
  );
}

interface SettingsProvidersProps {
  updateProvider?: (provider: ProviderProps | string) => Promise<void> | void;
}

export function SettingsProviders({ updateProvider }: SettingsProvidersProps) {
  const { providers, setProviders } = useContext(aIContext);
  const [deleteProvider, setDeleteProvider] = useState<ProviderProps | null>(
    null
  );

  const updateName = async (name: string, id: string) => {
    const provider = providers.find((p) => p.id === id);
    if (!provider) return;
    const updated = {
      ...provider,
      name,
    };
    setProviders((prev) => prev.map((p) => (p.id === id ? updated : p)));
    await updateProvider?.(updated);
  };

  const updateProvidersAuthAll = async (
    auth: Partial<ProviderAuth>,
    id: string
  ) => {
    const provider = providers.find((p) => p.id === id);
    if (!provider) return;
    const updated = {
      ...provider,
      auth: { ...provider.auth, ...auth },
    } as ProviderProps;
    setProviders((prev) => prev.map((p) => (p.id === id ? updated : p)));
    await updateProvider?.(updated);
  };

  const updateProvidersConfigAll = async (
    config: Partial<ProviderConfig>,
    id: string
  ) => {
    const provider = providers.find((p) => p.id === id);
    if (!provider) return;
    const updated = {
      ...provider,
      config: { ...provider.config, ...config },
    } as ProviderProps;
    setProviders((prev) => prev.map((p) => (p.id === id ? updated : p)));
    await updateProvider?.(updated);
  };

  const deleteProviderD = async () => {
    if (!deleteProvider) return;
    setProviders((prev) => prev.filter((p) => p.id !== deleteProvider.id));
    await updateProvider?.(deleteProvider.id);
    setDeleteProvider(null);
  };
  return (
    <Stack gap={1}>
      <AddProviderHeader
        addProvider={async (p) => {
          setProviders((prev) => [...prev, p]);
          await updateProvider?.(p);
        }}
      />
      <List>
        {Object.values(providers).map((p) => {
          const pBase = providerBaseMap[p.providerBaseId];
          return (
            <ListItem
              sx={{
                borderBottom: "1px solid",
                borderColor: "text.secondary",
              }}
              key={p.id}
            >
              <Stack
                sx={{
                  width: "100%",
                }}
              >
                <Stack direction="row" alignItems="center">
                  <ListItemIcon>
                    <StaticAvatar alt={p.name} src={pBase.logo} />
                  </ListItemIcon>
                  <ListItemText
                    primary={p.name}
                    secondary={pBase.type.join(" | ")}
                  />
                  <Tooltip title="Site">
                    <IconButton
                      LinkComponent={Link}
                      href={pBase.url}
                      target={"_blank"}
                    >
                      <LaunchIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => setDeleteProvider(p)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <TextField
                  label="Name"
                  size="small"
                  defaultValue={p.name}
                  onBlur={(ev) => updateName(ev.target.value, p.id)}
                />
                {pBase.configType !== ProviderConfigType.CONFIG_NONE && (
                  <Divider
                    sx={{
                      color: "var(--mui-palette-text-secondary)",
                    }}
                  >
                    Configuration
                  </Divider>
                )}
                <ProviderConfigConfig
                  provider={p}
                  updateProvider={updateProvidersConfigAll}
                />
                {pBase.authType !== ProviderAuthType.NONE && (
                  <Divider
                    sx={{
                      color: "var(--mui-palette-text-secondary)",
                    }}
                  >
                    Authentication
                  </Divider>
                )}
                <ProviderAuthConfig
                  provider={p}
                  updateProvider={updateProvidersAuthAll}
                />
              </Stack>
            </ListItem>
          );
        })}
      </List>
      <DeleteDialog
        open={deleteProvider !== null}
        handleClose={() => setDeleteProvider(null)}
        title="Delete Provider"
        description={
          deleteProvider
            ? `Do you want to delete "${deleteProvider.name}"?`
            : ""
        }
        action={deleteProviderD}
      />
    </Stack>
  );
}
