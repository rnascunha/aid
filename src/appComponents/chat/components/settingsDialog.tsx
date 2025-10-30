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
import { Settings } from "@/appComponents/chat/components/settings";
import { ChatSettings } from "@/appComponents/chat/types";

export function SettingsDialog({
  settings,
  setSettings,
}: {
  settings: ChatSettings;
  setSettings: Dispatch<SetStateAction<ChatSettings>>;
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
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Settings settings={settings} setSettings={setSettings} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
