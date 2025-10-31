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
import { Options } from "./options";
import { AudioToTextOptions } from "../data";

export function OptionsDialog({
  opts,
  setOpts,
}: {
  opts: AudioToTextOptions;
  setOpts: Dispatch<SetStateAction<AudioToTextOptions>>;
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
          <Options opts={opts} setOpts={setOpts} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
