"use server";

import { signIn, signOut } from "@/auth";
import { loginPath, restrictedPath } from "@/constants";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function googleLogin(redirect?: string) {
  try {
    const redirectTo = redirect ? `${redirect}` : restrictedPath;
    await signIn("google", { redirectTo });
  } catch(e) {
    if (e)
    if (isRedirectError(e))
      throw e;
    console.error(e);
  }
  
}

export async function googleLogout() {
  await signOut({ redirectTo: loginPath });
}
