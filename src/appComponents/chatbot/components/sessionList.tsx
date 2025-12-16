import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { SessionType } from "../types";
import { Dispatch, SetStateAction, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { DeleteDialog } from "@/components/dialogs/deleteDialog";
import { EditDialog } from "@/components/dialogs/editDialog";
import { toggleMessagesPane } from "@/libs/chat/utils";

export function AddSession({ onAddSession }: { onAddSession: () => void }) {
  return (
    <Tooltip title="Add session">
      <IconButton size="small" edge="start" onClick={() => onAddSession()}>
        <AddIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

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

function SessionOptions({
  deleteSession,
  onEditName,
}: {
  deleteSession: () => void;
  onEditName: () => void;
}) {
  return (
    <Stack direction="row">
      <ChangeSessionName onEditName={onEditName} />
      <DeleteSession deleteSession={deleteSession} />
    </Stack>
  );
}

interface SessionListProps {
  sessions: SessionType[];
  selectedSession: SessionType | null;
  setSelectedSession: Dispatch<SetStateAction<SessionType | null>>;
  onDeleteSession: (sesssion: SessionType) => Awaited<void>;
  onEditSession: <K extends keyof SessionType>(
    sesssion: SessionType,
    key: K,
    value: SessionType[K]
  ) => Awaited<void>;
}

export function SessionList({
  sessions,
  selectedSession,
  setSelectedSession,
  onDeleteSession,
  onEditSession,
}: SessionListProps) {
  const [toDelete, setToDelete] = useState<SessionType | null>(null);
  const [toEditName, setToEditName] = useState<SessionType | null>(null);

  const onDelete = (session: SessionType) => {
    setToDelete(session);
  };

  const onEditName = (session: SessionType) => setToEditName(session);

  return (
    <List dense={true} disablePadding={true}>
      {sessions.map((s) => (
        <ListItem
          key={s.id}
          secondaryAction={
            <SessionOptions
              deleteSession={() => onDelete(s)}
              onEditName={() => onEditName(s)}
            />
          }
          disableGutters={true}
          disablePadding={true}
        >
          <ListItemButton
            selected={selectedSession?.id == s.id}
            onClick={() => {
              setSelectedSession(s);
              toggleMessagesPane();
            }}
          >
            <ListItemText
              primary={s.name}
              secondary={
                <Typography
                  fontSize="small"
                  color="textSecondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: "1",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {s.id}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
      {toDelete && (
        <DeleteDialog
          title="Delete Session"
          description={`Do you want to delete session '${toDelete.name}'?`}
          open={toDelete !== null}
          handleClose={() => setToDelete(null)}
          action={() => onDeleteSession(toDelete)}
        />
      )}
      {toEditName && (
        <EditDialog
          title="Edit Session"
          description={`New name session`}
          open={toEditName !== null}
          handleClose={() => setToEditName(null)}
          value={toEditName.name}
          action={(value: string) => {
            onEditSession(toEditName, "name", value);
          }}
        />
      )}
    </List>
  );
}
