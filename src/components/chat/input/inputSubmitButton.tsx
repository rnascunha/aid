import { Fab, FabProps } from "@mui/material";
import { ReactNode } from "react";

import SendRoundedIcon from "@mui/icons-material/SendRounded";

export interface InputSubmitProps extends FabProps {
  icon?: ReactNode;
}

export function InputSubmit({
  size,
  color,
  icon,
  ...others
}: InputSubmitProps) {
  return (
    <Fab size={size ?? "small"} color={color ?? "primary"} {...others}>
      {icon ?? <SendRoundedIcon />}
    </Fab>
  );
}
