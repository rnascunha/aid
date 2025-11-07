export interface GeneralSettings {
  temperature: number;
}

export interface ContextSettings {
  systemPrompt: string;
  maxContextMessages: number;
  maxElapsedTimeMessages: number;
}

export interface Tool {
  id: string;
  label: string;
}

export interface ToolsSettings {
  tools: string[];
  maxTurns: number;
}

export interface ChatSettings {
  general: GeneralSettings;
  context: ContextSettings;
  tools: ToolsSettings;
}
