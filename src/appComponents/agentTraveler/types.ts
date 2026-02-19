import { ADKData, ADKState } from "@/libs/chat/adk/types";
import { BaseSender } from "@/libs/chat/types";
import { StateType } from "./components/editComponents/types";

export interface SessionType extends BaseSender {
  state: ADKState & { state: StateType };
}

export type AgentTravelerData = ADKData;
