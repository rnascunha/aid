import { IconButton, Tooltip } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

export function AddSession({ onAddSession }: { onAddSession: () => void }) {
  return (
    <Tooltip title="Add session">
      <IconButton size="small" edge="start" onClick={() => onAddSession()}>
        <AddIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
