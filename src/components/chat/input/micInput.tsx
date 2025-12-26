import { Box, Fab } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import CenterSpinner from "@/components/spinner/centerSpinner";
import StopIcon from "@mui/icons-material/Stop";
import { green, red } from "@mui/material/colors";
import CircularProgress from "@mui/material/CircularProgress";
import { Mic } from "../../../libs/mic";
import { PartInlineData, TypeMessage } from "@/libs/chat/types";
import { filePathToBase64 } from "@/libs/base64";

interface RecordButtonProps {
  recording: boolean;
  setRecording: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: PartInlineData, type: TypeMessage) => Promise<void>;
  isPending: boolean;
}

function RecordButton({
  recording,
  setRecording,
  onSubmit,
  isPending,
}: RecordButtonProps) {
  const mic = useRef<Mic | null>(null);

  const buttonSx = {
    ...(recording && {
      // bgcolor: blue[500],
      "&:hover": {
        bgcolor: red[700],
      },
    }),
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Fab
        disabled={!Mic.isAvaiable() || isPending}
        color="primary"
        aria-label="microphone"
        variant="circular"
        sx={buttonSx}
        size="small"
        onClick={async () => {
          try {
            if (!recording) {
              mic.current = new Mic(
                () => setRecording(true),
                async (data, size) => {
                  const d = await filePathToBase64(data, "mimeType/ogg");
                  onSubmit(
                    {
                      displayName: "recorded",
                      mimeType: "mimeType/ogg",
                      size: size,
                      data: d,
                    },
                    TypeMessage.MESSAGE
                  );
                  setRecording(false);
                }
              );
              await mic.current.start();
            } else {
              mic.current?.stop();
              mic.current = null;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            mic.current?.reset();
            setRecording(false);
            mic.current = null;
          }
        }}
      >
        {recording ? <StopIcon /> : <MicIcon />}
      </Fab>
      {recording && (
        <CircularProgress
          size={45}
          sx={{
            color: green[500],
            position: "absolute",
            top: -2,
            left: -2,
            zIndex: 10,
          }}
        />
      )}
    </Box>
  );
}

interface MicInputProps {
  onSubmit: (data: PartInlineData, type: TypeMessage) => Promise<void>;
  isPending: boolean;
}

export function MicInput({ onSubmit, isPending }: MicInputProps) {
  const [recording, setRecording] = useState(false);
  const [mount, setMount] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMount(true), []);

  return mount ? (
    <RecordButton
      recording={recording}
      setRecording={setRecording}
      onSubmit={onSubmit}
      isPending={isPending}
    />
  ) : (
    <CenterSpinner width="50px" height="50px" />
  );
}
