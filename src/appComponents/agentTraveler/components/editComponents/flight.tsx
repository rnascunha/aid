import { Stack } from "@mui/material";
import {
  BorderBox,
  DateTimeInput,
  ElementCarousel,
  InputField,
  ReadOnlyInputField,
  TimezoneAutocomplete,
} from "./general";
import { containerSxProps, defaultGap } from "./constants";
import { FlightType } from "./types";
import dayjs from "@/libs/dayjs";

function FilghEdit({ flight }: { flight: FlightType }) {
  return (
    <Stack sx={containerSxProps}>
      <InputField label="Company Name" defaultValue={flight.company_name} />
      <InputField
        label="Booking Reference"
        defaultValue={flight.booking_reference}
      />
      <InputField label="Flight Number" defaultValue={flight.flight_number} />
      <InputField label="Class Type" defaultValue={flight.class_type} />
      <InputField label="Baggage" defaultValue={flight.baggage} />
      <BorderBox title="Departure">
        <Stack gap={defaultGap}>
          <ReadOnlyInputField
            label="Ref"
            defaultValue={flight.departure_loc_ref}
          />
          <InputField label="Airport" defaultValue={flight.departure_airport} />
          <DateTimeInput
            label="Date/Time"
            format="DD/MM/YYYY HH:mm"
            defaultValue={dayjs.tz(
              `${flight.departure_date} ${flight.departure_time}`,
              "DD/MM/YYYY HH:mm",
              flight.departure_timezone,
            )}
          />
          <TimezoneAutocomplete
            label="Timezeone"
            value={flight.departure_timezone}
          />
        </Stack>
      </BorderBox>
      <BorderBox title="Arrival">
        <Stack gap={defaultGap}>
          <ReadOnlyInputField
            label="Ref"
            defaultValue={flight.arrival_loc_ref}
          />
          <InputField label="Airport" defaultValue={flight.arrival_airport} />
          <DateTimeInput
            label="Date/Time"
            format="DD/MM/YYYY HH:mm"
            defaultValue={dayjs.tz(
              `${flight.arrival_date} ${flight.arrival_time}`,
              "DD/MM/YYYY HH:mm",
              flight.arrival_timezone,
            )}
          />
          <TimezoneAutocomplete
            label="Timezeone"
            value={flight.arrival_timezone}
          />
        </Stack>
      </BorderBox>
    </Stack>
  );
}

export function FlightList({ flights }: { flights: FlightType[] }) {
  if (flights.length === 0) return;

  return (
    <ElementCarousel
      data={flights.map((flight, index) => (
        <FilghEdit flight={flight} key={index} />
      ))}
    />
  );
}
