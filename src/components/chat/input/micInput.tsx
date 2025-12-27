import { Box, Fab, SxProps } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { ReactNode, useEffect, useRef, useState } from "react";
import CenterSpinner from "@/components/spinner/centerSpinner";
import StopIcon from "@mui/icons-material/Stop";
import { green, red } from "@mui/material/colors";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { Mic } from "../../../libs/mic";
import { PartInlineData, TypeMessage } from "@/libs/chat/types";
import { filePathToBase64 } from "@/libs/base64";

interface RecordButtonProps {
  onAddFile?: (data: PartInlineData, type: TypeMessage) => Promise<void>;
  disabled?: boolean;
  icon?: ReactNode;
  sx?: SxProps;
  progress?: CircularProgressProps;
}

function RecordButton({
  disabled,
  icon,
  sx,
  progress,
  onAddFile,
}: MicInputProps) {
  const [recording, setRecording] = useState(false);
  const mic = useRef<Mic | null>(null);

  const buttonSx = {
    ...(recording && {
      "&:hover": {
        bgcolor: red[700],
      },
    }),
    ...sx,
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Fab
        disabled={!Mic.isAvaiable() || disabled}
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
                  const d = await filePathToBase64(data, "audio/ogg");
                  onAddFile?.(
                    {
                      displayName: "recorded",
                      mimeType: "audio/ogg",
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
        {recording ? <StopIcon /> : icon ?? <MicIcon />}
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
          {...progress}
        />
      )}
    </Box>
  );
}

export interface MicInputProps extends RecordButtonProps {
  spinnerSize?: string;
}

export function MicInput(props: MicInputProps) {
  const [mount, setMount] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMount(true), []);

  return mount ? (
    <RecordButton {...props} />
  ) : (
    <CenterSpinner
      width={props.spinnerSize ?? "25px"}
      height={props.spinnerSize ?? "25px"}
    />
  );
}
