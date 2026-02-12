import JSONOutput from "@/components/JSONOutput";
import { SessionType } from "@/libs/chat/adk/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";

import DataObjectIcon from "@mui/icons-material/DataObject";

interface DialogStateProps {
  session: SessionType;
  open: boolean;
  handleClose: () => void;
  getState: () => Promise<void>;
}

export function StateDialog({
  open,
  handleClose,
  session,
  getState,
}: DialogStateProps) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>State</DialogTitle>
      <DialogContent>
        <JSONOutput src={session.state} quotesOnKeys={false} name={false} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={async () => {
            await getState();
          }}
        >
          Get state
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export function ViewState({ request }: { request: () => void }) {
  return (
    <Tooltip title="Get state">
      <IconButton size="small" edge="end" onClick={request}>
        <DataObjectIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
