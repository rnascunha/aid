import { Stack } from "@mui/material";
import {
  ArrayString,
  DateTimeInput,
  InputField,
  ReadOnlyInputField,
  TimezoneAutocomplete,
} from "./general";
import { containerSxProps } from "./constants";
import { EventType } from "./types";
import { setDateTimePicker, updateDateTime } from "./functions";
import { ElementList } from "./component";

interface EventEditProps {
  data: EventType;
  original?: EventType;
  updateState: (name: keyof EventType, value: unknown) => void;
}

function EventEdit({ data: event, original, updateState }: EventEditProps) {
  return (
    <Stack sx={containerSxProps}>
      <InputField
        label="Name"
        value={event.name}
        original={original?.name}
        updateState={(value) => updateState("name", value)}
      />
      <ReadOnlyInputField label="Ref" defaultValue={event.address_loc_ref} />
      <InputField
        label="Address"
        value={event.address}
        original={original?.address}
        updateState={(value) => updateState("address", value)}
      />
      <InputField
        label="Info"
        value={event.info}
        original={original?.info}
        updateState={(value) => updateState("info", value)}
      />
      <ArrayString
        title="Seats"
        data={event.seats}
        original={original?.seats}
        updateState={(value) => updateState("seats", value)}
      />
      <ArrayString
        title="Travelers"
        data={event.travelers}
        original={original?.travelers}
        updateState={(value) => updateState("travelers", value)}
      />
      <DateTimeInput
        label="Check In"
        format="DD/MM/YYYY HH:mm"
        value={setDateTimePicker(event.date, event.begin_time, event.timezone)}
        updateState={(v) => {
          updateDateTime(v, updateState, {
            date: "date",
            time: "begin_time",
          });
        }}
        original={
          original
            ? setDateTimePicker(
                original.date,
                original.begin_time,
                original.timezone,
              )
            : undefined
        }
        // timezone={hotel.timezone}
      />
      <TimezoneAutocomplete
        label="Timezone"
        value={event.timezone}
        original={original?.timezone}
        updateState={(value) => updateState("timezone", value)}
      />
    </Stack>
  );
}

interface EventListProps {
  events: EventType[];
  original?: EventType[];
  updateState: (index: number, name: keyof EventType, value: unknown) => void;
  addElement?: () => number;
  removeElement?: (id: string) => void;
  resetValue?: () => void;
}

export function EventList({
  events,
  original,
  updateState,
  addElement,
  removeElement,
  resetValue,
}: EventListProps) {
  return (
    <ElementList
      elements={events}
      original={original}
      updateState={updateState}
      addElement={addElement}
      removeElement={removeElement}
      resetValue={resetValue}
      as={EventEdit}
    />
  );
}
