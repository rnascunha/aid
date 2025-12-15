import { SessionType } from "./types";
import { v4 as uuidv4 } from "uuid";

export function createNewSession(name: string = ""): SessionType {
  return {
    name: name || `Session-${Math.floor(Math.random() * 100)}`,
    id: uuidv4(),
  };
}
