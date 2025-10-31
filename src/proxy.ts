import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { NextURL } from "next/dist/server/web/next-url";
import { loginPath, restrictedPath } from "./constants";

function goToPath(nextUrl: NextURL, path: string, addRedirect: boolean) {
  const newURL = new URL(path, nextUrl);
  if (addRedirect && nextUrl.pathname !== path)
    newURL.searchParams.append("redirect", nextUrl.pathname);
  return NextResponse.redirect(newURL);
}

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const session = await auth();
  const isAuthenticated = !!session?.user;

  if (isAuthenticated && nextUrl.pathname === loginPath)
    return goToPath(nextUrl, restrictedPath, false);
  if (!isAuthenticated && nextUrl.pathname === restrictedPath)
    return goToPath(nextUrl, loginPath, true);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon[0-9]?.png|manifest.json|sitemap.xml|robots.txt).*)",
  ],
};
