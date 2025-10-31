import { ArrayPanel, PanelConfig } from "@/components/panels";
import {
  Container,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { AudioToTextOptions } from "../data";
import { debounce } from "@/libs/debounce";

import CircleIcon from "@mui/icons-material/Circle";

const defaultSx: SxProps = {
  p: 3,
};

function GeneralOptionsContainer({
  general,
  setSettings,
}: {
  general: AudioToTextOptions;
  setSettings: (v: Partial<AudioToTextOptions>) => void;
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

export function Options({
  opts,
  setOpts,
}: {
  opts: AudioToTextOptions;
  setOpts: Dispatch<SetStateAction<AudioToTextOptions>>;
}) {
  const [isSaved, setIsSaved] = useState(true);

  const saveDataDebounce = useMemo(() => {
    return debounce((data: Partial<AudioToTextOptions>) => {
      setOpts((prev) => ({
        ...prev,
        ...data,
      }));
      setIsSaved(true);
    }, 300);
  }, [setOpts]);

  const saveData = (data: Partial<AudioToTextOptions>) => {
    setIsSaved(false);
    saveDataDebounce(data);
  };

  const panelsDesc: PanelConfig[] = [
    {
      label: "General",
      panel: (
        <GeneralOptionsContainer
          general={opts}
          setSettings={(v) => saveData(v)}
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
