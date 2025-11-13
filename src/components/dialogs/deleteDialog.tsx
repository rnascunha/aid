import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteDialogProps extends DialogProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  action: () => void | Promise<void>;
}

export function DeleteDialog({
  title,
  description,
  action,
  open,
  handleClose,
}: DeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={async () => {
            await action();
            handleClose();
          }}
          autoFocus
          endIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
