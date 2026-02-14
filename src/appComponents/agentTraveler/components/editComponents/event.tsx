import { Stack } from "@mui/material";
import {
  ArrayString,
  DateTimeInput,
  ElementCarousel,
  InputField,
  ReadOnlyInputField,
  TimezoneAutocomplete,
} from "./general";
import { containerSxProps } from "./constants";
import dayjs from "@/libs/dayjs";
import { EventType } from "./types";

function EventEdit({ event }: { event: EventType }) {
  return (
    <Stack sx={containerSxProps}>
      <InputField label="Name" defaultValue={event.name} />
      <ReadOnlyInputField label="Ref" defaultValue={event.address_loc_ref} />
      <InputField label="Address" defaultValue={event.address} />
      <InputField label="Info" defaultValue={event.info} />
      <ArrayString title="Seats" data={event.seats} />
      <ArrayString title="Travelers" data={event.travelers} />
      <DateTimeInput
        label="Date/Time"
        format="DD/MM/YYYY HH:mm"
        defaultValue={dayjs.tz(
          `${event.date} ${event.begin_time}`,
          "DD/MM/YYYY HH:mm",
          event.timezone,
        )}
        // timezone={hotel.timezone}
      />
      <TimezoneAutocomplete label="Timezone" value={event.timezone} />
    </Stack>
  );
}

export function EventList({ events }: { events: EventType[] }) {
  if (events.length === 0) return;

  return (
    <ElementCarousel
      data={events.map((event, index) => (
        <EventEdit event={event} key={index} />
      ))}
    />
  );
}
