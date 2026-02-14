import { Stack } from "@mui/material";
import {
  ArrayString,
  DateTimeInput,
  ElementCarousel,
  InputField,
  ReadOnlyInputField,
  TimezoneAutocomplete,
} from "./general";
import { HotelType } from "./types";
import { containerSxProps } from "./constants";
import dayjs from "@/libs/dayjs";

interface HotelEditProps {
  hotel: HotelType;
}

function HotelEdit({ hotel }: HotelEditProps) {
  return (
    <Stack sx={containerSxProps}>
      <ReadOnlyInputField label="Ref" defaultValue={hotel.loc_ref} />
      <InputField label="Name" defaultValue={hotel.name} />
      <InputField label="Address" defaultValue={hotel.address} />
      <InputField
        label="Description"
        rows={3}
        multiline
        defaultValue={hotel.description}
      />
      <InputField label="Room Type" defaultValue={hotel.room_type} />
      <InputField label="Info" defaultValue={hotel.info} />
      <ArrayString title="Guests" data={hotel.guests} />
      <DateTimeInput
        label="Check In"
        format="DD/MM/YYYY HH:mm"
        defaultValue={dayjs.tz(
          `${hotel.checkin_date} ${hotel.checkin_time}`,
          "DD/MM/YYYY HH:mm",
          hotel.timezone,
        )}
        // timezone={hotel.timezone}
      />
      <DateTimeInput
        label="Check Out"
        format="DD/MM/YYYY HH:mm"
        defaultValue={dayjs.tz(
          `${hotel.checkout_date} ${hotel.checkout_time}`,
          "DD/MM/YYYY HH:mm",
          hotel.timezone,
        )}
        // timezone={hotel.timezone}
      />
      <TimezoneAutocomplete label="Timezone" value={hotel.timezone} />
    </Stack>
  );
}

export function HotelList({ hotels }: { hotels: HotelType[] }) {
  if (hotels.length === 0) return;

  return (
    <ElementCarousel
      data={hotels.map((hotel, index) => (
        <HotelEdit hotel={hotel} key={index} />
      ))}
    />
  );
}
