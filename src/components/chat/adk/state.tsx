import JSONOutput from "@/components/JSONOutput";
import { ADKState, SessionType } from "@/libs/chat/adk/types";
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
import PreviewIcon from "@mui/icons-material/Preview";

import { useState } from "react";

interface DialogStateProps {
  session: SessionType;
  open: boolean;
  handleClose: () => void;
  getState: () => Promise<void>;
  updateState?: (update: ADKState) => Promise<void>;
}

type UpdatingState = "getState" | "updateState" | null;

export function StateDialog({
  open,
  handleClose,
  session,
  getState,
  updateState,
}: DialogStateProps) {
  const [updatingState, setUpdatingState] = useState<UpdatingState>(null);
  const [stateUpdate, setStateUpdate] = useState<ADKState>(
    updateState ? (session.state.state as ADKState) : session.state,
  );
  const [hasChange, setHasChange] = useState(false);

  const updateValue = ({ updated_src }: { updated_src: object }) => {
    setHasChange(true);
    setStateUpdate(updated_src as ADKState);
    return true;
  };

  const deleteValue = ({
    name,
    namespace,
    updated_src,
  }: {
    name: string | null;
    namespace: object;
    updated_src: object;
  }) => {
    if ((namespace as string[]).length === 0) {
      const newData = {
        ...updated_src,
        [name as string]: null,
      };
      return updateValue({ updated_src: newData });
    } else return updateValue({ updated_src });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>State</DialogTitle>
      <DialogContent>
        <JSONOutput
          src={stateUpdate}
          quotesOnKeys={false}
          name={false}
          displayDataTypes={false}
          onEdit={updateState ? updateValue : undefined}
          onAdd={updateState ? updateValue : undefined}
          onDelete={updateState ? deleteValue : undefined}
        />
      </DialogContent>
      <DialogActions>
        {updateState && (
          <Button
            onClick={async () => {
              setUpdatingState("updateState");
              await updateState(stateUpdate);
              setHasChange(false);
              setUpdatingState(null);
            }}
            loading={updatingState === "updateState"}
            disabled={updatingState !== null || !hasChange}
          >
            Update state
          </Button>
        )}
        <Button
          onClick={async () => {
            setUpdatingState("getState");
            await getState();
            setUpdatingState(null);
          }}
          loading={updatingState === "getState"}
          disabled={updatingState !== null}
        >
          Get state
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export function ViewUpdateState({ request }: { request: () => void }) {
  return (
    <Tooltip title="Update state">
      <IconButton size="small" edge="end" onClick={request}>
        <DataObjectIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

export function ViewFullState({ request }: { request: () => void }) {
  return (
    <Tooltip title="View full state">
      <IconButton size="small" edge="end" onClick={request}>
        <PreviewIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
