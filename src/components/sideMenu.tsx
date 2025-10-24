"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { sections as catSections, Section } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LeftMainSideMenu, LeftSideMenu } from "./leftMenu";

interface LeftSideMenuContextType {
  smallScreen: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const leftSideMenuContext = createContext<LeftSideMenuContextType>({
  smallScreen: false,
  open: false,
  setOpen: () => {},
});

export function SideMenuContextWrapper({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);

  return (
    <leftSideMenuContext.Provider
      value={{
        open,
        setOpen,
        smallScreen,
      }}
    >
      {children}
    </leftSideMenuContext.Provider>
  );
}

interface MainContentProps {
  leftMenuChildren: ReactNode;
  children: ReactNode;
  width: number;
  sx?: SxProps;
}

export function MainContent({
  children,
  leftMenuChildren,
  width,
  sx,
}: MainContentProps) {
  const { open, setOpen, smallScreen } = useContext(leftSideMenuContext);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        flex: 1,
        overflow: "hidden",
        ...sx,
      }}
    >
      <LeftSideMenu
        width={width}
        variant="persistent"
        onClose={() => setOpen(false)}
        open={open}
      >
        {leftMenuChildren}
      </LeftSideMenu>
      <LeftMainSideMenu
        width={smallScreen ? 0 : width}
        open={open}
        sx={{
          height: "100%",
        }}
      >
        {children}
      </LeftMainSideMenu>
    </Box>
  );
}

export function SideMenuButton() {
  const { open, setOpen, smallScreen } = useContext(leftSideMenuContext);

  useEffect(() => setOpen(smallScreen ? false : true), [setOpen, smallScreen]);

  return (
    <IconButton onClick={() => setOpen((prev) => !prev)}>
      {open ? (
        <CloseIcon
          sx={{
            color: "white",
          }}
        />
      ) : (
        <MenuIcon
          sx={{
            color: "white",
          }}
        />
      )}
    </IconButton>
  );
}

export function SideMenuContent({ sx }: { sx?: SxProps }) {
  const { setOpen, smallScreen } = useContext(leftSideMenuContext);
  const pathname = usePathname();

  const sections: (Section | "divider")[] = catSections;

  return (
    <List
      sx={{
        height: "100%",
        ...sx,
      }}
    >
      {sections.map((s) =>
        s === "divider" ? (
          <Divider key={0} />
        ) : (
          s.path && (
            <ListItemButton
              key={s.id}
              LinkComponent={Link}
              href={s.path}
              onClick={() => {
                if (smallScreen) setOpen(false);
              }}
              sx={{
                filter: pathname === s.path ? "opacity(0.5)" : undefined,
                textAlign: "center",
              }}
            >
              <ListItemIcon>{s.icon}</ListItemIcon>
              <ListItemText>{s.name}</ListItemText>
            </ListItemButton>
          )
        )
      )}
    </List>
  );
}
