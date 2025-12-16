import { Button, Divider, Stack, Typography } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef, useState } from "react";
import {
  clearData,
  exportData,
  importData,
} from "@/libs/chat/storage/indexDB/general";
import { DeleteDialog } from "@/components/dialogs/deleteDialog";
import { download } from "@/libs/download";
import { VisuallyHiddenInput } from "@/components/fileUpload";

type State = "save" | "load" | "clear";

export function SettingStorage() {
  const [state, setState] = useState<State | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const click = async (s: State, exec: () => Promise<void>) => {
    setState(s);
    await exec();
    setState(undefined);
  };

  const clearDataDB = async () => {
    await clearData();
  };

  const downloadData = async () => {
    const blob = await exportData();
    download(blob, "text/json", "aid.json");
  };

  const loadData = async (file: File | undefined) => {
    if (!file) return;
    try {
      await importData(file);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Stack
      gap={1}
      sx={{
        mt: 2,
      }}
      alignItems="center"
    >
      <Typography
        sx={{
          fontStyle: "italic",
        }}
      >
        Download JSON with configuration
      </Typography>
      <Button
        variant="contained"
        loading={state === "save"}
        endIcon={<SaveIcon />}
        disabled={state !== undefined}
        onClick={() => click("save", downloadData)}
      >
        Save Configuration
      </Button>
      <Divider sx={{ my: 1, width: "80%" }} />
      <Typography
        sx={{
          fontStyle: "italic",
        }}
      >
        Load configuration from JSON file
      </Typography>
      <Button
        variant="contained"
        component="label"
        loading={state === "load"}
        endIcon={<FileUploadIcon />}
        disabled={state !== undefined}
      >
        Load Configuration
        <VisuallyHiddenInput
          ref={inputRef}
          type="file"
          accept="text/json"
          name="storage-file"
          onChange={async (ev) => {
            click("load", async () => await loadData(ev.target.files?.[0]));
            inputRef.current!.value = "";
          }}
        />
      </Button>
      <Divider sx={{ my: 1, width: "80%" }} />
      <Typography
        sx={{
          fontStyle: "italic",
        }}
      >
        Delete all data from database
      </Typography>
      <Button
        variant="contained"
        loading={state === "clear"}
        endIcon={<DeleteIcon />}
        disabled={state !== undefined}
        onClick={() => setOpen(true)}
      >
        Clear Data
      </Button>
      <DeleteDialog
        open={open}
        handleClose={() => setOpen(false)}
        title="Delete Database"
        description="Do you want to delete all data?"
        action={async () => await click("clear", clearDataDB)}
      />
    </Stack>
  );
}
