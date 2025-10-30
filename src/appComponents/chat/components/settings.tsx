import { ArrayPanel, PanelConfig } from "@/components/panels";
import {
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChatSettings,
  ContextSettings,
  GeneralSettings,
  Tool,
  ToolsSettings,
} from "../types";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { toolsList, toolsMap } from "../data";
import { debounce } from "@/libs/debounce";

import CircleIcon from "@mui/icons-material/Circle";

const defaultSx: SxProps = {
  p: 3,
};

function GeneralSettingsContainer({
  general,
  setSettings,
}: {
  general: GeneralSettings;
  setSettings: (v: Partial<GeneralSettings>) => void;
}) {
  return (
    <Stack sx={defaultSx}>
      <TextField
        label="Temperature"
        type="number"
        defaultValue={general.temperature}
        onChange={(ev) => setSettings({ temperature: +ev.target.value })}
        slotProps={{
          htmlInput: { min: 0, step: 0.05 },
        }}
      />
    </Stack>
  );
}

function ContextSettingsContainer({
  context,
  setSettings,
}: {
  context: ContextSettings;
  setSettings: (v: Partial<ContextSettings>) => void;
}) {
  return (
    <Stack sx={{ ...defaultSx, px: { xs: 0, sm: 3 } }} gap={1}>
      <TextField
        label="System prompt"
        multiline
        minRows={3}
        fullWidth
        defaultValue={context.systemPrompt}
        onChange={(ev) => setSettings({ systemPrompt: ev.target.value })}
      />
      <Stack direction="row" gap={1}>
        <TextField
          label="Max messages"
          type="number"
          defaultValue={context.maxContextMessages}
          slotProps={{
            htmlInput: { min: 0, step: 1 },
          }}
          onChange={(ev) =>
            setSettings({ maxContextMessages: +ev.target.value })
          }
        />
        <TextField
          label="Max time elapsed"
          type="number"
          defaultValue={context.maxElapsedTimeMessages}
          slotProps={{
            htmlInput: { min: 0, step: 1 },
            input: {
              endAdornment: <InputAdornment position="end">ms</InputAdornment>,
            },
          }}
          onChange={(ev) =>
            setSettings({ maxElapsedTimeMessages: +ev.target.value })
          }
        />
      </Stack>
    </Stack>
  );
}

function ToolsSettingsContainer({
  tools,
  setSettings,
}: {
  tools: ToolsSettings;
  setSettings: (v: Partial<ToolsSettings>) => void;
}) {
  return (
    <Stack sx={defaultSx} gap={2}>
      <TextField
        label="Max turns"
        type="number"
        defaultValue={tools.maxTurns}
        slotProps={{
          htmlInput: { min: 1, step: 1 },
        }}
        onChange={(ev) => setSettings({ maxTurns: +ev.target.value })}
      />
      <Stack>
        <Typography variant="h3" fontSize="medium" fontWeight="bold">
          Tools list
        </Typography>
        <FormGroup>
          {toolsList.map((t) => (
            <FormControlLabel
              key={t.id}
              control={
                <Checkbox
                  checked={tools.tools.includes(t.id)}
                  onChange={(ev) =>
                    setSettings({
                      tools: ev.target.checked
                        ? [...tools.tools, t.id]
                        : tools.tools.filter((i) => i !== t.id),
                    })
                  }
                />
              }
              label={(toolsMap[t.id] as Tool).label}
            />
          ))}
        </FormGroup>
      </Stack>
    </Stack>
  );
}

function SavedIndicator({ isSaved }: { isSaved: boolean }) {
  return (
    <Stack
      direction="row"
      gap={1}
      justifyContent="flex-start"
      alignItems="center"
    >
      <CircleIcon
        sx={{ fontSize: 12 }}
        color={isSaved ? "primary" : "warning"}
      />
      <Typography color={isSaved ? "primary" : "textSecondary"}>
        {isSaved ? "Saved" : "Saving"}
      </Typography>
    </Stack>
  );
}

export function Settings({
  settings,
  setSettings,
}: {
  settings: ChatSettings;
  setSettings: Dispatch<SetStateAction<ChatSettings>>;
}) {
  const [isSaved, setIsSaved] = useState(true);

  const saveDataDebounce = useMemo(() => {
    return debounce((data: unknown, section: keyof ChatSettings) => {
      const d = data as ChatSettings[keyof ChatSettings];
      setSettings((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...d },
      }));
      setIsSaved(true);
    }, 300);
  }, [setSettings]);

  const saveData = (data: unknown, section: keyof ChatSettings) => {
    setIsSaved(false);
    saveDataDebounce(data, section);
  };

  const panelsDesc: PanelConfig[] = [
    {
      label: "General",
      panel: (
        <GeneralSettingsContainer
          general={settings.general}
          setSettings={(v) => saveData(v, "general")}
        />
      ),
    },
    {
      label: "Context",
      panel: (
        <ContextSettingsContainer
          context={settings.context}
          setSettings={(v) => saveData(v, "context")}
        />
      ),
    },
    {
      label: "Tools",
      panel: (
        <ToolsSettingsContainer
          tools={settings.tools}
          setSettings={(v) => saveData(v, "tools")}
        />
      ),
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <div>
        <ArrayPanel panels={panelsDesc} variant="scrollable" />
      </div>
      <SavedIndicator isSaved={isSaved} />
    </Container>
  );
}
