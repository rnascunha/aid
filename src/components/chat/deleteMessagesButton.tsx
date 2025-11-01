import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

interface DeleteMessagesButtonProps {
  onDelete: () => Promise<void>;
}

export function DeleteMessagesButton({ onDelete }: DeleteMessagesButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Delete model messages">
        <IconButton onClick={() => setOpen(true)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="delete-message-dialog-title"
        aria-describedby="delete-message-dialog-description"
      >
        <DialogTitle id="delete-message-dialog-title">
          {"Delete Model Messages"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-message-dialog-description">
            Do you want to delete all messages from this model?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              await onDelete();
              setOpen(false);
            }}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
