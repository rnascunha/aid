import { useState } from "react";

import { PartInlineData } from "@/libs/chat/types";
import { formatBytes } from "@/libs/formatData";
import {
  Button,
  IconButton,
  ListItem,
  ListItemText,
  Menu,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

function AttachItem({
  file,
  removeFile,
  disabled,
}: {
  file: PartInlineData;
  removeFile: () => void;
  disabled?: boolean;
}) {
  return (
    <ListItem
      secondaryAction={
        <IconButton disabled={disabled} size="small" onClick={removeFile}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      title={file.displayName}
    >
      <ListItemText
        sx={{
          display: "inline-block",
          textOverflow: "ellipsis",
          maxWidth: "100%",
          width: "100%",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
        primary={file.displayName!}
        secondary={`${file.mimeType} ${formatBytes(file.size!)}`}
      />
    </ListItem>
  );
}

interface AttachFilesListProps {
  files: PartInlineData[];
  removeFile: (file: PartInlineData, index: number) => void;
  disabled?: boolean;
}

export function AttachFilesList({
  files,
  removeFile,
  disabled: disabledItem,
}: AttachFilesListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const disabled = files.length === 0;

  return (
    <div
      style={{
        alignSelf: "flex-end",
      }}
    >
      <Button
        size="small"
        id="files-list-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        disabled={disabled}
      >
        {`${files.length} files attached`}
      </Button>
      <Menu
        id="file-list-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "files-list-button",
          },
        }}
        sx={{
          maxWidth: "500px",
        }}
      >
        {files.map((f, i) => (
          <AttachItem
            key={f.displayName}
            file={f}
            removeFile={() => removeFile(f, i)}
            disabled={disabledItem}
          />
        ))}
      </Menu>
    </div>
  );
}
