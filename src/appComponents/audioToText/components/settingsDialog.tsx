import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import { Dispatch, SetStateAction, useState } from "react";
import { Settings } from "./settings";
import { AudioToTextSettings } from "../types";

export function SettingsDialog({
  settings,
  setSettings,
  onDeleteMessages,
}: {
  settings: AudioToTextSettings;
  setSettings: Dispatch<SetStateAction<AudioToTextSettings>>;
  onDeleteMessages: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton size="small" onClick={() => setOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog
        onClose={() => setOpen(false)}
        open={open}
        aria-hidden="false"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "500px", // Set your width here
              height: "450px",
              maxHeight: "80%",
            },
          },
        }}
      >
        <DialogTitle>Options</DialogTitle>
        <DialogContent>
          <Settings
            settings={settings}
            setSettings={setSettings}
            onDeleteMessages={onDeleteMessages}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
