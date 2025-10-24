"use client";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SxProps, useColorScheme } from "@mui/material/styles";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import { ListItemIcon, ListItemText } from "@mui/material";
import { ReactNode } from "react";
import CenterSpinner from "./spinner/centerSpinner";

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

export default function ModeSwitch({ sx }: { sx?: SxProps }) {
  const { mode, setMode } = useColorScheme();

  return (
    <Box sx={{ width: "56px", height: "41px", ...sx }}>
      {!mode ? (
        <CenterSpinner
          height={30}
          width={30}
          props={{
            fill: "var(--AppBar-color)",
            stroke: "var(--AppBar-color)",
          }}
        />
      ) : (
        <FormControl size="small">
          <Select
            labelId="mode-select-label"
            id="mode-select"
            value={mode ?? ""}
            renderValue={(value) =>
              value ? menuItem[value as ThemeMode].icon : ""
            }
            onChange={(event) => setMode(event.target.value as typeof mode)}
            sx={{
              color: "var(--App-color)",
              outline: "none",
              // ".MuiSelect-icon": {
              // display: "none",
              // },
              ".MuiSelect-select": {
                border: "none",
                display: "flex",
                px: 0,
              },
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": { border: 0 },
              "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: "none",
                },
            }}
          >
            {(["system", "dark", "light"] as ThemeMode[]).map((m) => (
              <MenuItem key={m} value={m}>
                <ListItemIcon>{menuItem[m].icon}</ListItemIcon>
                <ListItemText>{menuItem[m].name}</ListItemText>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
