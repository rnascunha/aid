import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  SxProps,
  TextField,
} from "@mui/material";

import { ReactNode, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";

interface EditDialogProps extends DialogProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  description?: ReactNode;
  action: (value: string) => void | Promise<void>;
  value?: string;
  sxContent?: SxProps;
  clear?: boolean;
}

export function EditDialog({
  title,
  description,
  action,
  open,
  handleClose,
  value,
  clear,
  ...props
}: EditDialogProps) {
  const [newValue, setNewValue] = useState(value ?? "");

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-dialog-title"
      aria-describedby="eidt-dialog-description"
      {...props}
    >
      <DialogTitle id="edit-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {description && (
          <DialogContentText id="edit-dialog-description">
            {description}
          </DialogContentText>
        )}
        <TextField
          size="small"
          fullWidth
          value={newValue}
          onChange={(ev) => setNewValue(ev.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={async () => {
            const vv = newValue.trim();
            if (vv === "") return;
            await action(vv);
            if (clear) setNewValue("");
            handleClose();
          }}
          autoFocus
          endIcon={<EditIcon />}
          disabled={newValue.trim() === ""}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
