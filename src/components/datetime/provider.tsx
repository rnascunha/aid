"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ReactNode } from "react";

export function LocalizerProvider({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      {children}
    </LocalizationProvider>
  );
}
