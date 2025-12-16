import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { SettingsProviders } from "./settings/settingsProvider";
import { ToolsProps } from "@/libs/chat/types";
import { ArrayPanel, PanelConfig } from "@/components/panels";
import { SettingsTools } from "./settings/settigsTools";
import { SettingStorage } from "./settings/settingsStorage";
import { ProviderProps } from "./types";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  updateProvider?: (provider: ProviderProps | string) => Promise<void> | void;
  updateTool?: (tool: ToolsProps) => Promise<void> | void;
}

export function SettingsDialog({
  open,
  onClose,
  updateProvider,
  updateTool,
}: SettingsDialogProps) {
  const panels: PanelConfig[] = [
    {
      id: "providers",
      label: "Providers",
      panel: <SettingsProviders updateProvider={updateProvider} />,
    },
    {
      id: "tools",
      label: "Tools",
      panel: <SettingsTools updateTool={updateTool} />,
    },
    {
      id: "storage",
      label: "Storage",
      panel: <SettingStorage />,
    },
  ];

  return (
    <Dialog
      onClose={onClose}
      open={open}
      aria-hidden="false"
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "500px",
            maxHeight: "80%",
            height: "80%",
          },
        },
      }}
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <ArrayPanel panels={panels} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
