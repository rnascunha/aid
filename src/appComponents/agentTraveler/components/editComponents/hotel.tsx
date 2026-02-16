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
import { setDateTimePicker, updateDateTime } from "./functions";

interface HotelEditProps {
  hotel: HotelType;
  original?: HotelType;
  updateState: (name: keyof HotelType, value: unknown) => void;
}

function HotelEdit({ hotel, original, updateState }: HotelEditProps) {
  return (
    <Stack sx={containerSxProps}>
      <ReadOnlyInputField label="Ref" defaultValue={hotel.loc_ref} />
      <InputField
        label="Name"
        value={hotel.name}
        original={original?.name}
        updateState={(value) => updateState("name", value)}
      />
      <InputField
        label="Address"
        value={hotel.address}
        original={original?.address}
        updateState={(value) => updateState("address", value)}
      />
      <InputField
        label="Description"
        rows={3}
        multiline
        value={hotel.description}
        original={original?.description}
        updateState={(value) => updateState("description", value)}
      />
      <InputField
        label="Room Type"
        value={hotel.room_type}
        original={original?.room_type}
        updateState={(value) => updateState("room_type", value)}
      />
      <InputField
        label="Info"
        value={hotel.info}
        original={original?.info}
        updateState={(value) => updateState("info", value)}
      />
      <ArrayString
        title="Guests"
        data={hotel.guests}
        original={original?.guests}
        updateState={(value) => updateState("guests", value)}
      />
      <DateTimeInput
        label="Check In"
        format="DD/MM/YYYY HH:mm"
        value={setDateTimePicker(
          hotel.checkin_date,
          hotel.checkin_time,
          hotel.timezone,
        )}
        updateState={(v) => {
          updateDateTime(v, updateState, {
            date: "checkin_date",
            time: "checkin_time",
          });
        }}
        original={
          original
            ? setDateTimePicker(
                original.checkin_date,
                original.checkin_time,
                original.timezone,
              )
            : undefined
        }
        // timezone={hotel.timezone}
      />
      <DateTimeInput
        label="Check Out"
        format="DD/MM/YYYY HH:mm"
        value={setDateTimePicker(
          hotel.checkout_date,
          hotel.checkout_time,
          hotel.timezone,
        )}
        updateState={(v) => {
          updateDateTime(v, updateState, {
            date: "checkout_date",
            time: "checkout_time",
          });
        }}
        original={
          original
            ? setDateTimePicker(
                original.checkout_date,
                original.checkout_time,
                original.timezone,
              )
            : undefined
        }
        // timezone={hotel.timezone}
      />
      <TimezoneAutocomplete
        label="Timezone"
        value={hotel.timezone}
        original={original?.timezone}
        updateState={(value) => updateState("timezone", value)}
      />
    </Stack>
  );
}

interface HotelListProps {
  hotels: HotelType[];
  original?: HotelType[];
  updateState: (index: number, name: keyof HotelType, value: unknown) => void;
}

export function HotelList({ hotels, original, updateState }: HotelListProps) {
  if (hotels.length === 0) return;

  return (
    <ElementCarousel
      data={hotels.map((hotel, index) => (
        <HotelEdit
          hotel={hotel}
          key={index}
          original={original?.[index]}
          updateState={(name, value) => updateState(index, name, value)}
        />
      ))}
    />
  );
}
