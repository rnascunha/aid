import { Box, SxProps } from "@mui/material";
import { CSSProperties, SVGProps } from "react";
import Spinner from "./spinner";

export default function CenterSpinner({
  width = 150,
  height = 150,
  style,
  props,
}: {
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
  sx?: SxProps;
  props?: SVGProps<SVGSVGElement>;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Spinner width={width} height={height} style={style} props={props} />
    </Box>
  );
}
