import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from "@mui/material";

import ErrorIcon from "@mui/icons-material/Error";
import { ReactNode } from "react";
import JSONOutput from "../JSONOutput";

interface ErrorDialogProps extends DialogProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: ReactNode;
  errorObject?: object;
}

export function ErrorDialog({
  title,
  description,
  open,
  handleClose,
  errorObject,
}: ErrorDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
    >
      <DialogTitle id="error-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="error-dialog-description">
          {description}
        </DialogContentText>
        {errorObject && <JSONOutput src={errorObject} style={{
          maxHeight: "300px"
        }} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} endIcon={<ErrorIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
