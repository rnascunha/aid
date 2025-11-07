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

function DeleteMessageDialog({
  open,
  description,
  onClose,
  onDelete,
}: {
  open: boolean;
  description: string;
  onClose: () => void;
  onDelete: () => Promise<void>;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-message-dialog-title"
      aria-describedby="delete-message-dialog-description"
    >
      <DialogTitle id="delete-message-dialog-title">
        {"Delete Messages"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-message-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={async () => {
            await onDelete();
            onClose();
          }}
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function DeleteMessagesButton({ onDelete }: DeleteMessagesButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Delete messages">
        <IconButton onClick={() => setOpen(true)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <DeleteMessageDialog
        open={open}
        description="Do you want to delete all messages from this model?"
        onClose={() => setOpen(false)}
        onDelete={onDelete}
      />
    </>
  );
}

export function DeleteAllMessagesButton({
  onDelete,
}: DeleteMessagesButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<DeleteIcon />}
        onClick={() => setOpen(true)}
      >
        Delete all messages
      </Button>
      <DeleteMessageDialog
        open={open}
        description="Do you want to delete all messages?"
        onClose={() => setOpen(false)}
        onDelete={onDelete}
      />
    </>
  );
}
