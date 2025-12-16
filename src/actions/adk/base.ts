"use server";

import { makeSessionAddress, makeQueryAddress } from "./functions";
import {
  DeleteSessionProps,
  GetSessionProps,
  InitiateSessionProps,
  SendQueryProps,
  UpdateSesionProps,
  ADKException,
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

export async function sendQuery({
  app_name,
  user,
  session,
  url,
  parts,
}: SendQueryProps) {
  try {
    const address = makeQueryAddress({ url });

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
    };

    const response = await fetch(address, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
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
