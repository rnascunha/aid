"use client";

import { Ref, forwardRef } from "react";
import { Drawer, DrawerProps, styled } from "@mui/material";

export const LeftMainSideMenu = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  width: number;
  open?: boolean;
}>(({ theme, open, width }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  margin: 0,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${width}px`,
  }),
}));

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  justifyContent: "space-between",
}));

interface LeftSideMenuProps extends Omit<DrawerProps, "anchor"> {
  width: number;
  onClose: (
    event?: object,
    reason?: "escapeKeyDown" | "backdropClick" | "closeButton"
  ) => void;
}

export const LeftSideMenu = forwardRef(function (
  props: LeftSideMenuProps,
  ref: Ref<HTMLDivElement>
) {
  const { width, open, children, onClose, sx, ...others } = props;

  return (
    <Drawer
      anchor="left"
      ref={ref}
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: width,
          boxSizing: "border-box",
        },
        ...sx,
      }}
      {...others}
    >
      {children}
    </Drawer>
  );
});

LeftSideMenu.displayName = "LeftMenu";
