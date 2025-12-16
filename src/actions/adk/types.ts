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

export interface PartText {
  text: string;
}

export interface PartInlineData {
  displayName?: string;
  data: string;
  mimeType: string;
}

export type Part = PartText | PartInlineData;

export interface SendQueryProps extends GetSessionProps {
  parts: Part[];
}

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
