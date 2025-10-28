import { Box, Fab } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import CenterSpinner from "@/components/spinner/centerSpinner";
import StopIcon from "@mui/icons-material/Stop";
import { blue, red } from "@mui/material/colors";
import CircularProgress from "@mui/material/CircularProgress";
import { Mic } from "./mic";

function RecordButton({
  recording,
  setRecording,
  onSubmit,
  isPending,
}: {
  recording: boolean;
  setRecording: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: string, size?: number) => void;
  isPending: boolean;
}) {
  const mic = useRef<Mic | null>(null);

  const buttonSx = {
    ...(recording && {
      bgcolor: blue[500],
      "&:hover": {
        bgcolor: red[700],
      },
    }),
  };

  return (
    <Box sx={{ m: 1, position: "relative" }}>
      <Fab
        disabled={!Mic.isAvaiable() || isPending}
        color="primary"
        aria-label="microphone"
        sx={buttonSx}
        onClick={async () => {
          try {
            if (!recording) {
              mic.current = new Mic(
                () => setRecording(true),
                (data, size) => {
                  onSubmit(data, size);
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
          size={68}
          sx={{
            color: blue[500],
            position: "absolute",
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
}

interface MicInputProps {
  onSubmit: (data: string, size?: number) => void;
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
