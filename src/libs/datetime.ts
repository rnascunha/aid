function getTimezoneOffsetMinutes(offset: string) {
  const offsetString = offset.split("GMT")[1];

  if (!offsetString) {
    return 0;
  }

  const parts = offsetString.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1] ? parseInt(parts[1], 10) : 0;

  const totalMinutes = (Math.abs(hours) * 60 + minutes) * Math.sign(hours);
  return totalMinutes;
}

export const timezones = Intl.supportedValuesOf("timeZone").map(
  (timeZone, i) => {
    const offset = new Intl.DateTimeFormat("en", {
      timeZone: timeZone,
      timeZoneName: "shortOffset",
    })
      .formatToParts()!
      .find((part: { type: string }) => part.type === "timeZoneName")!.value;

    const timeZoneAbbrivation = new Intl.DateTimeFormat("en", {
      timeZone: timeZone,
      timeZoneName: "long",
    })
      .formatToParts()
      .find((part) => part.type === "timeZoneName")!.value;
    return {
      id: i,
      timezone: timeZone,
      offset,
      name: timeZoneAbbrivation,
      offsetMinutes: getTimezoneOffsetMinutes(offset),
    };
  },
);
