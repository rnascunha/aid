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
}: {
  file: PartInlineData;
  removeFile: () => void;
}) {
  return (
    <ListItem
      secondaryAction={
        <IconButton size="small" onClick={removeFile}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <ListItemText
        primary={file.displayName!}
        secondary={`${file.mimeType} ${formatBytes(file.size!)}`}
      />
    </ListItem>
  );
}

interface AttachFilesListProps {
  files: PartInlineData[];
  removeFile: (file: PartInlineData, index: number) => void;
}

export function AttachFilesList({ files, removeFile }: AttachFilesListProps) {
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
      >
        {files.map((f, i) => (
          <AttachItem
            key={f.displayName}
            file={f}
            removeFile={() => removeFile(f, i)}
          />
        ))}
      </Menu>
    </div>
  );
}
