import { IconButton, Stack, Tooltip } from "@mui/material";
import { SessionType } from "../types";
import { useState } from "react";
import { DeleteDialog } from "@/components/dialogs/deleteDialog";
import { EditDialog } from "@/components/dialogs/editDialog";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

export function ChatbotOptions({
  session,
  onDeleteSession,
  onEditSession,
}: {
  session: SessionType;
  onDeleteSession: (sesssion: SessionType) => Promise<void>;
  onEditSession: <K extends keyof SessionType>(
    sesssion: SessionType,
    key: K,
    value: SessionType[K]
  ) => Promise<void>;
}) {
  const [action, setAction] = useState<"delete" | "editName" | null>(null);

  return (
    <>
      <Stack direction="row">
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
    </>
  );
}
