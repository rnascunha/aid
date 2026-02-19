import { Stack } from "@mui/material";
import {
  BorderBox,
  DateTimeInput,
  InputField,
  ReadOnlyInputField,
  TimezoneAutocomplete,
} from "./general";
import { containerSxProps, defaultGap } from "./constants";
import { FlightType } from "./types";
import { setDateTimePicker, updateDateTime } from "./functions";
import { ElementList } from "./component";

interface FligthEditProps {
  data: FlightType;
  original?: FlightType;
  updateState: (name: keyof FlightType, value: unknown) => void;
}

function FlightEdit({ data: flight, original, updateState }: FligthEditProps) {
  return (
    <Stack sx={containerSxProps}>
      <InputField
        label="Company Name"
        value={flight.company_name}
        updateState={(value) => updateState("company_name", value)}
        original={original?.company_name}
      />
      <InputField
        label="Booking Reference"
        value={flight.booking_reference}
        updateState={(value) => updateState("booking_reference", value)}
        original={original?.booking_reference}
      />
      <InputField
        label="Flight Number"
        value={flight.flight_number}
        updateState={(value) => updateState("flight_number", value)}
        original={original?.flight_number}
      />
      <InputField
        label="Class Type"
        value={flight.class_type}
        updateState={(value) => updateState("class_type", value)}
        original={original?.class_type}
      />
      <InputField
        label="Baggage"
        value={flight.baggage}
        updateState={(value) => updateState("baggage", value)}
        original={original?.baggage}
      />
      <BorderBox title="Departure">
        <Stack gap={defaultGap}>
          <ReadOnlyInputField label="Ref" value={flight.departure_loc_ref} />
          <InputField
            label="Airport"
            value={flight.departure_airport}
            updateState={(value) => updateState("departure_airport", value)}
            original={original?.departure_airport}
          />
          <DateTimeInput
            label="Date/Time"
            format="DD/MM/YYYY HH:mm"
            value={setDateTimePicker(
              flight.departure_date,
              flight.departure_time,
              flight.departure_timezone,
            )}
            updateState={(v) => {
              updateDateTime(v, updateState, {
                date: "departure_date",
                time: "departure_time",
              });
            }}
            original={
              original
                ? setDateTimePicker(
                    original.departure_date,
                    original.departure_time,
                    original.departure_timezone,
                  )
                : undefined
            }
          />
          <TimezoneAutocomplete
            label="Timezone"
            value={flight.departure_timezone}
            original={original?.departure_timezone}
            updateState={(value) => updateState("departure_timezone", value)}
          />
        </Stack>
      </BorderBox>
      <BorderBox title="Arrival">
        <Stack gap={defaultGap}>
          <ReadOnlyInputField label="Ref" value={flight.arrival_loc_ref} />
          <InputField
            label="Airport"
            value={flight.arrival_airport}
            updateState={(value) => updateState("arrival_airport", value)}
            original={original?.arrival_airport}
          />
          <DateTimeInput
            label="Date/Time"
            format="DD/MM/YYYY HH:mm"
            value={setDateTimePicker(
              flight.arrival_date,
              flight.arrival_time,
              flight.arrival_timezone,
            )}
            updateState={(v) => {
              updateDateTime(v, updateState, {
                date: "arrival_date",
                time: "arrival_time",
              });
            }}
            original={
              original
                ? setDateTimePicker(
                    original.arrival_date,
                    original.arrival_time,
                    original.arrival_timezone,
                  )
                : undefined
            }
          />
          <TimezoneAutocomplete
            label="Timezone"
            value={flight.arrival_timezone}
            original={original?.arrival_timezone}
            updateState={(value) => updateState("arrival_timezone", value)}
          />
        </Stack>
      </BorderBox>
    </Stack>
  );
}

interface FlightListProps {
  flights: FlightType[];
  original?: FlightType[];
  updateState: (id: string, name: keyof FlightType, value: unknown) => void;
  addElement?: () => number;
  removeElement?: (id: string) => void;
  resetValue?: () => void;
  getLabel?: (f: FlightType) => string;
}

export function FlightList({
  flights,
  original,
  updateState,
  addElement,
  removeElement,
  resetValue,
  getLabel,
}: FlightListProps) {
  return (
    <ElementList
      elements={flights}
      original={original}
      updateState={updateState}
      addElement={addElement}
      removeElement={removeElement}
      resetValue={resetValue}
      as={FlightEdit}
      getLabel={getLabel as (f: { id: string }) => string}
    />
  );
}
