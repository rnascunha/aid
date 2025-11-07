"use client";

import MenuItem from "@mui/material/MenuItem";
import { SxProps, useColorScheme } from "@mui/material/styles";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import { MouseEvent, ReactNode, useState } from "react";
import CenterSpinner from "../spinner/centerSpinner";

type ThemeMode = "system" | "dark" | "light";
interface ModeConfig {
  icon: ReactNode;
  name: string;
}

const menuItem: Record<ThemeMode, ModeConfig> = {
  system: {
    icon: <SettingsBrightnessIcon />,
    name: "System",
  },
  dark: {
    icon: <DarkModeIcon />,
    name: "Dark",
  },
  light: {
    icon: <LightModeIcon />,
    name: "Light",
  },
};

export default function ModeSwitch({
  sx,
  color,
}: {
  sx?: SxProps;
  color?: string;
}) {
  const { mode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelect = (value: ThemeMode) => {
    setMode(value);
    handleClose();
  };

  return (
    <Box sx={sx}>
      {!mode ? (
        <CenterSpinner
          height={30}
          width={30}
          props={{
            fill: color ?? "var(--AppBar-color)",
            stroke: color ?? "var(--AppBar-color)",
          }}
        />
      ) : (
        <>
          <IconButton
            onClick={handleClick}
            aria-controls={open ? "mode-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={{
              color: color ?? "var(--AppBar-color)",
            }}
          >
            {menuItem[mode as ThemeMode].icon}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": "mode-button",
              },
            }}
            sx={{
              zIndex: 20000,
            }}
          >
            {(["system", "dark", "light"] as ThemeMode[]).map((m) => (
              <MenuItem onClick={() => handleSelect(m)} key={m} value={m}>
                <ListItemIcon>{menuItem[m].icon}</ListItemIcon>
                <ListItemText>{menuItem[m].name}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
}
