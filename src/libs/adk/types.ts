export interface GetSessionProps {
  url?: string;
  app_name: string;
  session: string;
  user: string;
}

export type DeleteSessionProps = GetSessionProps;

export interface InitiateSessionProps extends GetSessionProps {
  data?: Record<string, unknown>;
}

export interface UpdateSesionProps extends GetSessionProps {
  data: Record<string, unknown>;
}

export interface ADKPartText {
  text: string;
  thought?: boolean;
}

export interface ADKPartInlineData {
  displayName?: string;
  data: string;
  mimeType: string;
  thought?: boolean;
}

export type Part = ADKPartText | ADKPartInlineData;

export interface FetchQueryProps extends GetSessionProps {
  parts: Part[];
  sse?: boolean;
  streaming?: boolean;
}

export type SendQueryProps = Omit<FetchQueryProps, "sse" | "streming">;

export class ADKException extends Error {
  constructor(
    private _name: string,
    private _message: string,
    private _err?: Error
  ) {
    super(_message);
  }

  get name() {
    return this._name;
  }

  get detail() {
    return this._err;
  }

  get message() {
    return this._message;
  }

  json() {
    return {
      ok: false as const,
      error: this.name,
      detail: this.detail,
      message: this.message,
    };
  }
}
/**
 *
 *
 *
 *
 */

interface ToolConfirmation {
  confirmed: boolean;
  hint?: string;
  payload?: unknown;
}

// https://google.github.io/adk-docs/api-reference/typescript/interfaces/EventActions.html
interface EventActions {
  artifactDelta: { [key: string]: number };
  escalate?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestedAuthConfigs: { [key: string]: any };
  requestedToolConfirmations: { [key: string]: ToolConfirmation };
  skipSummarization?: boolean;
  stateDelta: { [key: string]: unknown };
  transferToAgent?: string;
}

export interface Content {
  role: "model" | "user";
  parts: Part[];
}

// https://google.github.io/adk-docs/api-reference/typescript/interfaces/Event.html
export interface ADKEvent {
  actions: EventActions;
  author?: string;
  branch?: string;
  content?: Content;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customMetadata?: { [key: string]: any };
  errorCode?: string;
  errorMessage?: string;
  // finishReason?: FinishReason;
  // groundingMetadata?: GroundingMetadata;
  id: string;
  // inputTranscription?: Transcription;
  interrupted?: boolean;
  invocationId: string;
  // liveSessionResumptionUpdate?: LiveServerSessionResumptionUpdate;
  longRunningToolIds?: string[];
  // outputTranscription?: Transcription;
  partial?: boolean;
  timestamp: number;
  turnComplete?: boolean;
  // usageMetadata?: GenerateContentResponseUsageMetadata;
}
