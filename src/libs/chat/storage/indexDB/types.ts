import { Table } from "dexie";
import { BaseSender, MessageProps, ToolsProps } from "../../types";

export type ToolsDB = Omit<ToolsProps, "ip">;

export type TableMessages = Table<MessageProps, [string, string]>;
export type TableSenders = Table<BaseSender, string>;
