import { ArrayPanel, PanelConfig } from "@/components/panels";
import {
  Container,
  Divider,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { AudioToTextSettings } from "../types";
import { debounce } from "@/libs/debounce";

import CircleIcon from "@mui/icons-material/Circle";
import { DeleteAllMessagesButton } from "@/components/chat/deleteMessagesButton";

const defaultSx: SxProps = {
  p: 3,
};

function GeneralOptionsContainer({
  general,
  setSettings,
  onDeleteMessages,
}: {
  general: AudioToTextSettings;
  setSettings: (v: Partial<AudioToTextSettings>) => void;
  onDeleteMessages: () => Promise<void>;
}) {
  return (
    <Stack sx={defaultSx} gap={1}>
      <TextField
        label="Temperature"
        type="number"
        defaultValue={general.temperature}
        onChange={(ev) => setSettings({ temperature: +ev.target.value })}
        slotProps={{
          htmlInput: { min: 0, step: 0.05 },
        }}
      />
      <Divider />
      <DeleteAllMessagesButton onDelete={onDeleteMessages} />
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
  onDeleteMessages,
}: {
  settings: AudioToTextSettings;
  setSettings: Dispatch<SetStateAction<AudioToTextSettings>>;
  onDeleteMessages: () => Promise<void>;
}) {
  const [isSaved, setIsSaved] = useState(true);

  const saveDataDebounce = useMemo(() => {
    return debounce((data: Partial<AudioToTextSettings>) => {
      setSettings((prev) => ({
        ...prev,
        ...data,
      }));
      setIsSaved(true);
    }, 300);
  }, [setSettings]);

  const saveData = (data: Partial<AudioToTextSettings>) => {
    setIsSaved(false);
    saveDataDebounce(data);
  };

  const panelsDesc: PanelConfig[] = [
    {
      label: "General",
      panel: (
        <GeneralOptionsContainer
          general={settings}
          setSettings={(v) => saveData(v)}
          onDeleteMessages={onDeleteMessages}
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
