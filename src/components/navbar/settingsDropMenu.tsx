"use client";

import {
  ListItemIcon,
  MenuItem,
  Divider,
  IconButton,
  Menu,
} from "@mui/material";

import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";

import { MouseEvent, useContext, useState } from "react";
import { UserHeader } from "./userHeader";

import { Session } from "next-auth";
import { SettingsDialog } from "../chat/settings";
import { aIContext } from "../chat/context";
import { updateProvider, updateTools } from "@/libs/chat/storage";

export function SettingsDropMenu({ session }: { session: Session }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { openSettings, setOpenSettings } = useContext(aIContext);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? "settings-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <SettingsIcon
          sx={{
            color: "white",
          }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: "200px",
            },
          },
          list: {
            "aria-labelledby": "settings-button",
          },
        }}
        sx={{
          zIndex: 20000,
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenSettings(true);
            handleClose();
          }}
        >
          <ListItemIcon>
            <DisplaySettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <UserHeader
            session={session}
            avatarSize={24}
            color="text.secondary"
            name={true}
          />
        </MenuItem>
      </Menu>
      <SettingsDialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        updateProvider={(auth, id) => updateProvider({ id, auth })}
        updateTool={updateTools}
      />
    </>
  );
}
