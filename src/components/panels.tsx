"use client";

import { generateUUID } from "@/libs/uuid";
import {
  Box,
  Stack,
  SxProps,
  Tab,
  TabProps,
  Tabs,
  TabsProps,
} from "@mui/material";
import { ReactNode, useState } from "react";

interface TabPanelProps {
  children: ReactNode;
  index: string | number;
  value: string | number;
}

function CustomTabPanel({ children, index, value }: TabPanelProps) {
  return value === index && children;
}

export interface PanelConfig {
  label: ReactNode;
  panel: ReactNode;
  id?: string | number;
}

interface ArrayPanelProps {
  sxHeader?: SxProps;
  sxTab?: SxProps;
  panels: PanelConfig[];
  value?: string | number;
  centerTabs?: boolean;
  variant?: "fullWidth" | "scrollable" | "standard";
  onChange?: (newValue: string | number) => void;
}

const calcId = (p: PanelConfig | PanelUnit, i: number) => p.id ?? i;

export function ArrayPanel({
  panels,
  sxHeader,
  sxTab,
  centerTabs,
  variant,
  value,
  onChange,
}: ArrayPanelProps) {
  const [tab, setTab] = useState<string | number>(
    value ?? (panels.length > 0 ? calcId(panels[0], 0) : 0),
  );

  if (panels.length === 0) return undefined;

  const idx = panels.find((p, i) => tab === calcId(p, i));
  if (idx === undefined) {
    setTab(calcId(panels[0], 0));
  }

  return (
    <>
      <Tabs
        sx={sxHeader}
        value={tab}
        onChange={(event, newValue) => {
          setTab(newValue);
          onChange?.(newValue);
        }}
        centered={centerTabs}
        variant={variant ?? "standard"}
      >
        {panels.map((p, i) => (
          <Tab
            key={calcId(p, i)}
            label={p.label}
            value={calcId(p, i)}
            sx={sxTab}
          />
        ))}
      </Tabs>
      {panels.map((p, i) => (
        <CustomTabPanel key={calcId(p, i)} value={tab} index={calcId(p, i)}>
          {p.panel}
        </CustomTabPanel>
      ))}
    </>
  );
}

export interface PanelUnit extends Omit<TabProps, "id"> {
  panel: ReactNode;
  id?: string | number;
}

interface PanelListProps extends Omit<TabsProps, "onChange"> {
  tabProps?: TabProps;
  value?: string | number;
  panels: PanelUnit[];
  onChange?: (newValue: string | number) => void;
}

export function PanelList({
  tabProps,
  value,
  panels,
  onChange,
  ...tabsProps
}: PanelListProps) {
  const [tab, setTab] = useState<string | number>(
    value ?? (panels.length > 0 ? calcId(panels[0], 0) : 0),
  );

  if (panels.length === 0) return undefined;

  const idx = panels.find((p, i) => tab === calcId(p, i));
  if (idx === undefined) {
    setTab(calcId(panels[0], 0));
  }

  return (
    <Stack
      sx={{
        height: "100%",
      }}
      gap={0.5}
      direction={tabsProps.orientation === "vertical" ? "row" : "column"}
    >
      <Tabs
        value={tab}
        onChange={(event, newValue) => {
          setTab(newValue);
          onChange?.(newValue);
        }}
        {...tabsProps}
      >
        {panels.map((p, i) => {
          const { panel, id, ...others } = p;
          return (
            <Tab
              key={calcId(p, i)}
              value={calcId(p, i)}
              {...tabProps}
              {...others}
            />
          );
        })}
      </Tabs>
      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        {panels.map((p, i) => (
          <CustomTabPanel key={calcId(p, i)} value={tab} index={calcId(p, i)}>
            {p.panel}
          </CustomTabPanel>
        ))}
      </Box>
    </Stack>
  );
}

export interface PanelConfigCheck<T> extends PanelConfig {
  check?: (data: T) => boolean;
}

interface ArrayPanelCheckProps<T> extends ArrayPanelProps {
  panels: PanelConfigCheck<T>[];
  data: T;
}

export function ArrayPanelCheck<T>({
  panels,
  data,
  ...others
}: ArrayPanelCheckProps<T>) {
  const npanels = panels.filter((p) => p.check === undefined || p.check(data));
  return <ArrayPanel panels={npanels} {...others} />;
}
