export async function getIpiFyIP() {
  const data = await fetch("https://api.ipify.org?format=json");
  const ip = await data.json();
  return ip.ip;
}

export async function getIpiFyLocation(ip: string, apiKey: string) {
  const data = await fetch(
    `https://geo.ipify.org/api/v2/country?apiKey=${apiKey}&ipAddress=${ip}`
  );
  const location = await data.json();

  return location;
}
