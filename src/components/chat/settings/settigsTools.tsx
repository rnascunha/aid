import { useContext } from "react";
import { aIContext } from "../context";
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import Link from "next/link";

import LaunchIcon from "@mui/icons-material/Launch";
import { ToolsProps } from "@/libs/chat/types";

export function GeoIpifyConfig({
  apiKey,
  updateKey,
}: {
  apiKey: string;
  updateKey: (k: string) => void;
}) {
  return (
    <ListItem>
      <Stack
        sx={{
          width: "100%",
        }}
      >
        <Stack direction="row" alignItems="center">
          <ListItemText primary="Geolocation tools" />
          <Tooltip title="Site">
            <IconButton
              LinkComponent={Link}
              href={"https://geo.ipify.org/"}
              target={"_blank"}
            >
              <LaunchIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <TextField
          label="API key"
          fullWidth
          size="small"
          defaultValue={apiKey}
          onBlur={(ev) => updateKey(ev.target.value.trim())}
        />
      </Stack>
    </ListItem>
  );
}

interface SettingsToolsProps {
  updateTool?: (tools: ToolsProps) => Promise<void> | void;
}

export function SettingsTools({ updateTool }: SettingsToolsProps) {
  const { tools, setTools } = useContext(aIContext);

  const updateToolAll = async (d: string, field: keyof ToolsProps) => {
    setTools((prev) => ({ ...prev, [field]: d }));
    await updateTool?.({ ...tools, [field]: d });
  };

  return (
    <List>
      <ListItem
        secondaryAction={
          <Tooltip title="Site">
            <IconButton
              LinkComponent={Link}
              href="https://www.ipify.org/"
              target="_blank"
            >
              <LaunchIcon />
            </IconButton>
          </Tooltip>
        }
      >
        <ListItemText primary={`IP: ${tools.ip}`} />
      </ListItem>
      <Divider />
      <GeoIpifyConfig
        apiKey={tools.geoLocationApiKey}
        updateKey={(k) => updateToolAll(k, "geoLocationApiKey")}
      />
    </List>
  );
}
