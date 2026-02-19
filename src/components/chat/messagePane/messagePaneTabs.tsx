import JSONOutput, { followIfLink } from "@/components/JSONOutput";
import { ArrayPanel, PanelConfig } from "@/components/panels";
import { ADKState } from "@/libs/chat/adk/types";
import { downloadString } from "@/libs/download";
import { Box, Container, IconButton, Stack, Tooltip } from "@mui/material";
import { ReactNode, useState } from "react";

import DownloadIcon from "@mui/icons-material/Download";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface MessagePaneChatProps {
  messages: ReactNode;
  loader: ReactNode;
  input: ReactNode;
}

export function MessagePaneChat({
  messages,
  loader,
  input,
}: MessagePaneChatProps) {
  return (
    <Stack
      sx={{
        height: "100%",
      }}
    >
      {messages}
      {loader}
      {input}
    </Stack>
  );
}

interface MessagePaneStateProps {
  state: Record<string, unknown>;
  onGetState?: () => Promise<void>;
  onUpdateState?: () => Promise<void>;
}

export function MessagePaneState({
  state,
  onGetState,
  onUpdateState,
}: MessagePaneStateProps) {
  const [action, setAction] = useState<
    "download" | "getstate" | "updatestate" | null
  >(null);
  return (
    <Stack
      sx={{
        height: "100%",
        maxHeight: "100%",
        p: 1,
      }}
    >
      <Stack direction="row" alignItems="center">
        {onGetState && (
          <Tooltip title="Get state">
            <span>
              <IconButton
                onClick={async () => {
                  setAction("getstate");
                  await onGetState();
                  setAction(null);
                }}
                disabled={action !== null}
                loading={action === "getstate"}
                size="small"
              >
                <CloudDownloadIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {onUpdateState && (
          <Tooltip title="Update State">
            <span>
              <IconButton
                onClick={async () => {
                  setAction("updatestate");
                  await onUpdateState();
                  setAction(null);
                }}
                disabled={action !== null}
                loading={action === "updatestate"}
                size="small"
              >
                <CloudUploadIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title="Download data">
          <span>
            <IconButton
              size="small"
              disabled={action !== null}
              onClick={() => {
                setAction("download");
                const data = JSON.stringify(state);
                downloadString(data, "aid.json", "application/json");
                setAction(null);
              }}
              loading={action === "download"}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      <Container
        sx={{
          height: "100%",
          position: "relative",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <JSONOutput src={state} onSelect={followIfLink} collapsed={1} />
        </Box>
      </Container>
    </Stack>
  );
}

interface MessagePaneContentTapsProps {
  tabs: PanelConfig[];
}

export function MessagePaneContentTabs({ tabs }: MessagePaneContentTapsProps) {
  return (
    <ArrayPanel
      panels={tabs}
      variant="scrollable"
      sxHeader={{ minHeight: "35px", height: "35px", p: 0 }}
      sxTab={{ minHeight: "35px", height: "35px", p: 0 }}
    />
  );
}

interface MessagesPaneTabsProps {
  header: ReactNode;
  content: ReactNode;
}

export function MessagesPaneTabs({ header, content }: MessagesPaneTabsProps) {
  return (
    <Container
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        overflow: "hidden",
        transform: {
          xs: "translateX(calc(200% * (var(--MessagesPane-slideIn, 0))))",
          sm: "none",
        },
        transition: "transform 0.4s, width 0.4s",
      }}
    >
      {header}
      {content}
    </Container>
  );
}
