"use client";

import { OnSelectProps, ReactJsonViewProps } from "@microlink/react-json-view";
import { useColorScheme } from "@mui/material";
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

const darkScheme = {
  base00: "var(--mui-palette-background-default)",
  base01: "#282a2e",
  base02: "#373b41",
  base03: "#969896",
  base04: "#b4b7b4",
  base05: "#c5c8c6",
  base06: "#e0e0e0",
  base07: "#ffffff",
  base08: "#cc6666",
  base09: "#de935f",
  base0A: "#f0c674",
  base0B: "#b5bd68",
  base0C: "#8abeb7",
  base0D: "#81a2be",
  base0E: "#b294bb",
  base0F: "#a3685a",
};

const chooseTheme = (
  mode: "light" | "dark" | "system" | undefined,
  systemMode: "light" | "dark" | undefined,
) =>
  mode === "system"
    ? systemMode === "light"
      ? "rjv-default"
      : darkScheme
    : mode === "light"
      ? "rjv-default"
      : darkScheme;

export function followIfLink({ value, type }: OnSelectProps) {
  if (type !== "string") return;
  const isUrl = /^http[s]?:\/\//.test(value as string);
  if (!isUrl) return;
  window.open(value as string, "_blank")?.focus();
}

export default function JSONOutput(props: ReactJsonViewProps) {
  const { mode, systemMode } = useColorScheme();
  return (
    <ReactJson
      theme={chooseTheme(mode, systemMode)}
      collapseStringsAfterLength={124}
      name={false}
      displayDataTypes={false}
      quotesOnKeys={false}
      collapsed={2}
      {...props}
    />
  );
}
