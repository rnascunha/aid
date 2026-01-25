import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext, useRef, useState } from "react";
import { DeleteDialog } from "@/components/dialogs/deleteDialog";
import { downloadString } from "@/libs/download";
import { VisuallyHiddenInput } from "@/components/fileUpload";
import { aIContext } from "../../context";
import { readFileText } from "@/libs/fileBrowser";
import { DBExportFormatV1 } from "@/libs/chat/storage/types";
import { ZodError } from "zod";
import { ErrorDialog } from "@/components/dialogs/errorDialog";

type State = "save" | "load" | "clear";

function getImportError(e: Error) {
  if (e instanceof ZodError) {
    return {
      name: e.name,
      message: e.message,
      issues: e.issues,
      type: e.type,
    };
  }

  return {
    name: e.name,
    message: e.message,
  };
}

function RelaodCheckbox({
  reload,
  setReload,
}: {
  reload: boolean;
  setReload: (checked: boolean) => void;
}) {
  return (
    <FormControlLabel
      label="Reload page"
      slotProps={{
        typography: {
          sx: {
            fontSize: 15,
          },
        },
      }}
      sx={{
        fontSize: 14,
      }}
      control={
        <Checkbox
          sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}
          checked={reload}
          onChange={(ev, checked) => setReload(checked)}
        />
      }
    />
  );
}

export function SettingStorage() {
  const [state, setState] = useState<State | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState<object | null>(null);
  const [reload, setReolad] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { storage } = useContext(aIContext);

  const click = async (s: State, exec: () => Promise<void>) => {
    setState(s);
    await exec();
    setState(undefined);
  };

  const clearDataDB = async () => {
    await storage?.clear();

    if (reload) {
      window.location.reload();
    }
  };

  const downloadData = async () => {
    const data = await storage?.export();
    if (!data) return;
    downloadString(JSON.stringify(data), "aid.json", "text/json");
  };

  const loadData = async (file: File | undefined) => {
    if (!file) return;
    try {
      const data = JSON.parse(await readFileText(file, "utf-8"));
      DBExportFormatV1.parse(data);
      await storage?.import(data);

      window.location.reload();
    } catch (e) {
      console.log(e);
      setErrorOpen(e as Error);
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
        extraContent={
          <RelaodCheckbox
            reload={reload}
            setReload={(checked) => setReolad(checked)}
          />
        }
      />
      <ErrorDialog
        open={errorOpen !== null}
        title={"Error"}
        description={"A error ocurred"}
        handleClose={() => setErrorOpen(null)}
        errorObject={errorOpen ? getImportError(errorOpen as Error) : undefined}
      />
    </Stack>
  );
}
