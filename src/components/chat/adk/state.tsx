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
import { useState } from "react";
import { isEmpty, updateDeep } from "@/libs/object";

interface DialogStateProps {
  session: SessionType;
  open: boolean;
  handleClose: () => void;
  getState: () => Promise<void>;
  updateState: (update: ADKState) => Promise<void>;
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
  const [stateUpdate, setStateUpdate] = useState<ADKState>({});

  const updateValue = ({
    name,
    new_value,
    namespace,
  }: {
    namespace: object;
    name: string | null;
    new_value?: unknown;
  }) => {
    if (!name || !new_value) return false;
    setStateUpdate((prev) =>
      Object.assign(
        {},
        updateDeep(prev, [...(namespace as string[]), name], new_value),
      ),
    );
    return true;
  };
  const hasChange = !isEmpty(stateUpdate);

  const deleteValue = ({
    namespace,
    name,
  }: {
    name: string | null;
    namespace: object;
  }) => {
    return updateValue({ name, namespace });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>State</DialogTitle>
      <DialogContent>
        <JSONOutput
          src={session.state}
          quotesOnKeys={false}
          name={false}
          displayDataTypes={false}
          onEdit={updateValue}
          onAdd={updateValue}
          onDelete={deleteValue}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={async () => {
            setUpdatingState("updateState");
            console.log("stateUpdate", stateUpdate);
            await updateState(stateUpdate);
            setStateUpdate({});
            setUpdatingState(null);
          }}
          loading={updatingState === "updateState"}
          disabled={updatingState !== null || !hasChange}
        >
          Update state
        </Button>
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

export function ViewState({ request }: { request: () => void }) {
  return (
    <Tooltip title="Get state">
      <IconButton size="small" edge="end" onClick={request}>
        <DataObjectIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
