import { makeSessionAddress, makeQueryAddress } from "./functions";
import {
  DeleteSessionProps,
  GetSessionProps,
  InitiateSessionProps,
  SendQueryProps,
  UpdateSesionProps,
  ADKException,
  FetchQueryProps,
  ADKEvent,
  Part,
} from "./types";

export async function initiateSession({
  app_name,
  user,
  session,
  url,
  data,
}: InitiateSessionProps) {
  try {
    const address = makeSessionAddress({
      app_name,
      user,
      session,
      url,
    });
    const headers = {
      "Content-Type": "application/json",
    };
    const body = data ? JSON.stringify(data) : undefined;

    const response = await fetch(address, {
      method: "POST",
      headers,
      body,
    });
    const raw = await response.json();

    return {
      ok: true as const,
      status: response.status,
      statusText: response.statusText,
      data: raw,
    };
  } catch (e) {
    throw new ADKException("Fetch error", (e as Error).message, e as Error);
  }
}

export async function updateSession({
  app_name,
  user,
  session,
  url,
  data,
}: UpdateSesionProps) {
  try {
    const address = makeSessionAddress({
      app_name,
      user,
      session,
      url,
    });
    const headers = {
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      stateDelta: data,
    });

    const response = await fetch(address, {
      method: "PATCH",
      headers,
      body,
    });
    const raw = await response.json();

    return {
      ok: true as const,
      status: response.status,
      statusText: response.statusText,
      data: raw,
    };
  } catch (e) {
    throw new ADKException("Fetch error", (e as Error).message, e as Error);
  }
}

export async function getSession({
  app_name,
  user,
  session,
  url,
}: GetSessionProps) {
  try {
    const address = makeSessionAddress({
      app_name,
      user,
      session,
      url,
    });
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(address, {
      method: "GET",
      headers,
    });
    const raw = await response.json();

    return {
      ok: true as const,
      status: response.status,
      statusText: response.statusText,
      data: raw,
    };
  } catch (e) {
    throw new ADKException("Fetch error", (e as Error).message, e as Error);
  }
}

export async function deleteSession({
  app_name,
  user,
  session,
  url,
}: DeleteSessionProps) {
  try {
    const address = makeSessionAddress({
      app_name,
      user,
      session,
      url,
    });
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(address, {
      method: "DELETE",
      headers,
    });
    const raw = await response.json();

    return {
      ok: true as const,
      status: response.status,
      statusText: response.statusText,
      data: raw,
    };
  } catch (e) {
    throw new ADKException("Fetch error", (e as Error).message, e as Error);
  }
}

export async function fetchQuery({
  app_name,
  user,
  session,
  url,
  parts,
  sse,
  streaming,
}: FetchQueryProps) {
  try {
    const address = makeQueryAddress({ url, sse });

    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      appName: app_name,
      userId: user,
      sessionId: session,
      newMessage: {
        role: "user",
        parts,
      },
      streaming,
    };

    return await fetch(address, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new ADKException("Fetch error", (e as Error).message, e as Error);
  }
}

export async function sendQuery({
  app_name,
  user,
  session,
  url,
  parts,
}: SendQueryProps) {
  try {
    const response = await fetchQuery({
      app_name,
      user,
      session,
      url,
      parts,
    });

    const raw = await response.json();
    return {
      ok: true as const,
      status: response.status,
      statusText: response.statusText,
      data: raw,
    };
  } catch (e) {
    throw new ADKException("Fetch error", (e as Error).message, e as Error);
  }
}

class JoinData {
  private _data: string[] = [];

  getData() {
    const d = this._data;
    this._data = [];
    return d;
  }

  addData(chunk: string) {
    if (chunk.startsWith("data: ") || this._data.length === 0) {
      this._data.push(...chunk.split("\n"));
    } else {
      const last = this._data.at(-1) + chunk;
      this._data[this._data.length - 1] = last;
    }
  }

  getLines(): string[] {
    const reamining = this._data.slice(0, -1);
    this._data = this._data.slice(-1);
    return reamining;
  }
}

function processLines(
  lines: string[],
  handler: (event: ADKEvent | Error, error: boolean) => void,
) {
  for (const line of lines) {
    if (line.startsWith("data: ")) {
      try {
        const event = JSON.parse(line.replace("data: ", ""));
        handler(event, false);
      } catch (e) {
        console.log(line);
        console.log(e);
        handler(e as Error, true);
      }
    }
  }
}

export async function readQuerySSE(
  response: Response,
  handler: (event: ADKEvent | Error, error: boolean) => void,
) {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  const jdata = new JoinData();

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      processLines(jdata.getData(), handler);
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    jdata.addData(chunk);

    processLines(jdata.getLines(), handler);
  }
}

export class PartialDataAggregator {
  private _data: string = "";
  private _current_partial: boolean = false;
  private _is_thought: boolean = false;

  get data() {
    return this._data;
  }

  get is_partial() {
    return this._current_partial;
  }

  get is_thought() {
    return this._is_thought;
  }

  get parts(): Part[] {
    return [
      {
        text: this._data,
        thought: this._is_thought,
      },
    ];
  }

  addMessage(message: ADKEvent) {
    const curr = this._current_partial;
    this._current_partial = message.partial ?? false;
    if (!message.partial) {
      this._data = "";
      return curr;
    }
    const [res, data, thought] = PartialDataAggregator.getContent(message);
    this._is_thought = thought;
    if (!res) {
      this._data = "";
      return curr;
    }
    this._data += data;
    return curr;
  }

  private static getContent(message: ADKEvent): [boolean, string, boolean] {
    const content = message.content;
    if (content && "text" in content.parts?.[0]) {
      const text = content.parts[0].text;
      const thought = content.parts[0].thought ?? false;
      return [true, text, thought];
    }
    return [false, "", false];
  }
}
