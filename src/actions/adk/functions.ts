import { server_addr } from "./constants";

export function makeSessionAddress({
  url = server_addr,
  app_name,
  user,
  session,
}: {
  url?: string;
  app_name: string;
  user: string;
  session: string;
}): string {
  return `${url}/apps/${app_name}/users/${user}/sessions/${session}`;
}

export function makeQueryAddress({ url = server_addr }: { url?: string }) {
  return `${url}/run`;
}

export function makeListAppsAddress({ url = server_addr }: { url?: string }) {
  return `${url}/list-apps`;
}
