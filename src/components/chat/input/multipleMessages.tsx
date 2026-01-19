import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FabProps,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import { Dispatch, ReactNode, SetStateAction, useState } from "react";
// import { SessionType } from "../types";

import ForumIcon from "@mui/icons-material/Forum";
import SendIcon from "@mui/icons-material/Send";
import { InputOutput } from "@/components/chat/input/types";
import { BaseSender } from "@/libs/chat/types";

interface MultipleMessageFabProps extends FabProps {
  icon?: ReactNode;
  onOpen: () => void;
}

export function MultipleMessageFab({
  onOpen,
  size,
  color,
  icon,
  ...others
}: MultipleMessageFabProps) {
  return (
    <Tooltip title="Multiple Message">
      <span>
        <Fab
          size={size ?? "small"}
          color={color ?? "primary"}
          onClick={onOpen}
          {...others}
        >
          {icon ?? <ForumIcon fontSize="small" />}
        </Fab>
      </span>
    </Tooltip>
  );
}

function SessionList({
  sessions,
  checked,
  setChecked,
}: {
  sessions: BaseSender[];
  checked: string[];
  setChecked: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <List dense>
      {sessions.map((s) => (
        <ListItemButton
          key={s.id}
          onClick={() =>
            setChecked((prev) =>
              prev.includes(s.id)
                ? prev.filter((p) => p !== s.id)
                : [...prev, s.id],
            )
          }
        >
          <ListItemIcon>
            <Checkbox checked={checked.includes(s.id)} />
          </ListItemIcon>
          <ListItemText primary={s.name} />
        </ListItemButton>
      ))}
    </List>
  );
}

function MultipleMessageDialog({
  open,
  onClose,
  sessions,
  sendMessage,
}: {
  sessions: BaseSender[];
  open: boolean;
  onClose: () => void;
  sendMessage: (session: BaseSender, messages: InputOutput) => Promise<void>;
}) {
  const [checked, setChecked] = useState<string[]>([]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sessions</DialogTitle>
      <DialogContent
        sx={{
          minWidth: "300px",
        }}
      >
        <SessionList
          checked={checked}
          setChecked={setChecked}
          sessions={sessions}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={checked.length < 1}
          endIcon={<SendIcon />}
          onClick={async () => {
            onClose();
            await Promise.all(
              checked.map((c) => {
                const session = sessions.find((s) => c === s.id);
                if (!session) return;
                return sendMessage(session, {
                  text: `This is a message ${session.name}`,
                  files: [],
                });
              }),
            );
          }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface MultipleMessageProps {
  disabled?: boolean;
  sessions: BaseSender[];
  sendMessage: (session: BaseSender, messages: InputOutput) => Promise<void>;
}

export function MultipleMessage({
  sessions,
  sendMessage,
  disabled,
}: MultipleMessageProps) {
  const [open, setOpen] = useState(false);
  return [
    <MultipleMessageFab
      key={"MultipleMessageFab-key-unique"}
      disabled={disabled ?? sessions.length < 2}
      onOpen={() => setOpen(true)}
    />,
    <MultipleMessageDialog
      key={"MultipleMessageDialog-key-unique"}
      open={open}
      onClose={() => setOpen(false)}
      sessions={sessions}
      sendMessage={sendMessage}
    />,
  ];
}
