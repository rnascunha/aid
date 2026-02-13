import { IconButton, Stack, Tooltip } from "@mui/material";
import { useState } from "react";
import { DeleteDialog } from "@/components/dialogs/deleteDialog";
import { EditDialog } from "@/components/dialogs/editDialog";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ADKState, SessionType } from "@/libs/chat/adk/types";
import { StateDialog, ViewFullState, ViewUpdateState } from "./state";

function DeleteSession({ deleteSession }: { deleteSession: () => void }) {
  return (
    <Tooltip title="Delete session">
      <IconButton size="small" edge="start" onClick={deleteSession}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

function ChangeSessionName({ onEditName }: { onEditName: () => void }) {
  return (
    <Tooltip title="Edit name">
      <IconButton size="small" edge="end" onClick={onEditName}>
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

type ActionList = "delete" | "editName" | "viewUpdateState" | "viewFullState";

interface SessionOptionsProps {
  session: SessionType;
  onDeleteSession: (sesssion: SessionType) => Promise<void>;
  onEditSession: <K extends keyof SessionType>(
    sesssion: SessionType,
    key: K,
    value: SessionType[K],
  ) => Promise<void>;
  onGetState?: (session: SessionType) => Promise<void>;
  onUpdateState?: (session: SessionType, stateDelta: ADKState) => Promise<void>;
}

export function SessionOptions({
  session,
  onDeleteSession,
  onEditSession,
  onGetState,
  onUpdateState,
}: SessionOptionsProps) {
  const [action, setAction] = useState<ActionList | null>(null);

  return (
    <>
      <Stack direction="row">
        {onGetState && (
          <ViewFullState request={() => setAction("viewFullState")} />
        )}
        {onGetState && onUpdateState && (
          <ViewUpdateState request={() => setAction("viewUpdateState")} />
        )}
        <ChangeSessionName onEditName={() => setAction("editName")} />
        <DeleteSession deleteSession={() => setAction("delete")} />
      </Stack>
      {action === "delete" && (
        <DeleteDialog
          title="Delete Session"
          description={`Do you want to delete session '${session.name}'?`}
          open={action === "delete"}
          handleClose={() => setAction(null)}
          action={() => onDeleteSession(session)}
        />
      )}
      {action === "editName" && (
        <EditDialog
          title="Edit Session"
          description={`New name session`}
          open={action === "editName"}
          handleClose={() => setAction(null)}
          value={session.name}
          action={(value: string) => {
            onEditSession(session, "name", value);
          }}
        />
      )}
      {onGetState && action === "viewUpdateState" && (
        <StateDialog
          session={session}
          open={action === "viewUpdateState"}
          handleClose={() => setAction(null)}
          getState={() => onGetState(session)}
          updateState={
            onUpdateState ? (state) => onUpdateState(session, state) : undefined
          }
        />
      )}
      {onGetState && action === "viewFullState" && (
        <StateDialog
          session={session}
          open={action === "viewFullState"}
          handleClose={() => setAction(null)}
          getState={() => onGetState(session)}
        />
      )}
    </>
  );
}
