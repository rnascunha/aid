import { Stack } from "@mui/material";
import { containerSxProps, defaultGap } from "./constants";
import { BusTrainType } from "./types";
import {
  ArrayString,
  BorderBox,
  DateTimeInput,
  InputField,
  ReadOnlyInputField,
  SelectChoices,
  TimezoneAutocomplete,
} from "./general";
import { setDateTimePicker, updateDateTime } from "./functions";
import { ElementList } from "./component";

interface BusTrainEditProps {
  data: BusTrainType;
  original?: BusTrainType;
  updateState: (name: keyof BusTrainType, value: unknown) => void;
}

function BusTrainEdit({
  data: busTrain,
  original,
  updateState,
}: BusTrainEditProps) {
  return (
    <Stack sx={containerSxProps}>
      <InputField
        label="Company Name"
        value={busTrain.company_name}
        original={original?.company_name}
        updateState={(value) => updateState("company_name", value)}
      />
      <SelectChoices
        title="Type"
        selected={busTrain.type}
        options={["bus", "train"]}
        original={original?.type}
        updateState={(value) => updateState("type", value)}
      />
      <InputField
        label="Ticket Reference"
        value={busTrain.ticket_reference}
        original={original?.ticket_reference}
        updateState={(value) => updateState("ticket_reference", value)}
      />
      <InputField
        label="Travel Number"
        value={busTrain.travel_number}
        original={original?.travel_number}
        updateState={(value) => updateState("travel_number", value)}
      />
      <ArrayString
        data={busTrain.travelers}
        title="Passengers"
        original={original?.travelers}
        updateState={(value) => updateState("travelers", value)}
      />
      <ArrayString
        data={busTrain.seats}
        title="Seats"
        original={original?.seats}
        updateState={(value) => updateState("seats", value)}
      />
      <BorderBox title="Departure">
        <Stack gap={defaultGap}>
          <InputField label="Origin" value={busTrain.origin} />
          <ReadOnlyInputField label="Ref" value={busTrain.departure_loc_ref} />
          <InputField
            label="Origin Address"
            value={busTrain.departure_address}
            original={original?.departure_address}
            updateState={(value) => updateState("departure_address", value)}
          />
          <DateTimeInput
            label="Check In"
            format="DD/MM/YYYY HH:mm"
            value={setDateTimePicker(
              busTrain.departure_date,
              busTrain.departure_time,
              busTrain.departure_timezone,
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
            // timezone={hotel.timezone}
          />
          <TimezoneAutocomplete
            label="Timezeone"
            value={busTrain.departure_timezone}
            original={original?.departure_timezone}
            updateState={(value) => updateState("departure_timezone", value)}
          />
        </Stack>
      </BorderBox>
      <BorderBox title="Arrival">
        <Stack gap={defaultGap}>
          <InputField
            label="Destination"
            value={busTrain.destination}
            original={original?.destination}
            updateState={(value) => updateState("destination", value)}
          />
          <ReadOnlyInputField label="Ref" value={busTrain.arrival_loc_ref} />
          <InputField
            label="Airport"
            value={busTrain.arrival_address}
            original={original?.arrival_address}
            updateState={(value) => updateState("arrival_address", value)}
          />
          <DateTimeInput
            label="Check In"
            format="DD/MM/YYYY HH:mm"
            value={setDateTimePicker(
              busTrain.arrival_date,
              busTrain.arrival_time,
              busTrain.arrival_timezone,
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
            // timezone={hotel.timezone}
          />
          <TimezoneAutocomplete
            label="Timezeone"
            value={busTrain.arrival_timezone}
            original={original?.arrival_timezone}
            updateState={(value) => updateState("arrival_timezone", value)}
          />
        </Stack>
      </BorderBox>
      <InputField
        label="Info"
        value={busTrain.info}
        original={original?.info}
        updateState={(value) => updateState("info", value)}
      />
    </Stack>
  );
}

interface BusTraisListProps {
  busTrains: BusTrainType[];
  original?: BusTrainType[];
  updateState: (
    index: number,
    name: keyof BusTrainType,
    value: unknown,
  ) => void;
  addElement?: () => number;
  removeElement?: (id: string) => void;
  resetValue?: () => void;
}

export function BusTrainList({
  busTrains,
  original,
  updateState,
  addElement,
  removeElement,
  resetValue,
}: BusTraisListProps) {
  return (
    <ElementList
      elements={busTrains}
      original={original}
      updateState={updateState}
      addElement={addElement}
      removeElement={removeElement}
      resetValue={resetValue}
      as={BusTrainEdit}
    />
  );
}
