"use server";

import * as adk from "./adk/base";
import { ADKException, SendQueryProps } from "./adk/types";

export async function sendQuery({
  app_name,
  user,
  session,
  url,
  parts,
}: SendQueryProps) {
  try {
    const response = await adk.sendQuery({
      app_name,
      user,
      session,
      parts,
      url,
    });
    if (response.status !== 404) return response;

    const initResponse = await adk.initiateSession({
      app_name,
      user,
      session,
      url,
    });

    if (![200, 409].includes(initResponse.status as number))
      return initResponse;

    return await adk.sendQuery({
      app_name,
      user,
      session,
      parts,
      url,
    });
  } catch (e) {
    return (e as ADKException).json();
  }
}
