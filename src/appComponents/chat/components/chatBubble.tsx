"use state";

import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { ChatMessage, MessageProps } from "../types";
import { Avatar, Box, Container, Stack, Typography } from "@mui/material";
import dayjs from "@/libs/dayjs";
import { useEffect, useState } from "react";
import { createHiperlinks } from "@/libs/links";

type ChatBubbleProps = MessageProps & {
  variant: "sent" | "received";
};

function getContentData(content: ChatMessage) {
  if ("success" in content)
    return (
      <Typography
        fontSize="14px"
        sx={{
          whiteSpace: "pre-line",
        }}
      >
        {createHiperlinks(content.response)}
      </Typography>
    );

  return (
    <Stack>
      <Typography fontSize="16px" fontWeight="bold">
        {content.error}
      </Typography>
      <Typography
        fontSize="14px"
        sx={{
          whiteSpace: "pre-line",
        }}
      >
        {createHiperlinks(content.detail)}
      </Typography>
    </Stack>
  );
}

export default function ChatBubble(props: ChatBubbleProps) {
  const { content, variant, timestamp, attachment = undefined } = props;
  const isSent = variant === "sent";
  const [formatTimestamp, setFormatTimestamp] = useState(dayjs().to(timestamp));

  useEffect(() => {
    const handle = setInterval(
      () => setFormatTimestamp(dayjs().to(timestamp)),
      30 * 1000
    );
    return () => clearInterval(handle);
  }, [timestamp]);

  return (
    <Box sx={{ maxWidth: "60%", minWidth: "auto" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "flex-end", mb: 0.25 }}
        width="100%"
      >
        <Typography color="textSecondary" fontSize="small">
          {formatTimestamp}
        </Typography>
      </Stack>
      {attachment ? (
        <Container
          sx={[
            {
              px: 1.75,
              py: 1.25,
              borderRadius: "lg",
            },
            isSent
              ? { borderTopRightRadius: 0 }
              : { borderTopRightRadius: "lg" },
            isSent ? { borderTopLeftRadius: "lg" } : { borderTopLeftRadius: 0 },
          ]}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Avatar color="primary">
              <InsertDriveFileRoundedIcon />
            </Avatar>
            <div>
              <Typography>{attachment.fileName}</Typography>
              <Typography>{attachment.size}</Typography>
            </div>
          </Stack>
        </Container>
      ) : (
        <Container
          sx={[
            {
              p: 1.25,
              borderRadius: "10px",
            },
            isSent
              ? {
                  backgroundColor: "rgba(50, 50, 200, 0.7)",
                  color: "white",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: 0,
                }
              : {
                  backgroundColor:
                    "success" in content
                      ? "rgba(200, 200, 200, 0.7)"
                      : "rgba(200, 5, 5, 0.5)",
                  color: "black",
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: "10px",
                },
          ]}
        >
          {getContentData(content)}
        </Container>
      )}
    </Box>
  );
}
