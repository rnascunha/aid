import { Stack } from "@mui/material";
import {
  BorderBox,
  DateTimeInput,
  InputField,
  ReadOnlyInputField,
  TimezoneAutocomplete,
} from "./general";
import { containerSxProps, defaultGap } from "./constants";
import { CarRentType } from "./types";
import { setDateTimePicker, updateDateTime } from "./functions";
import { ElementList } from "./component";

interface CarRentEditProps {
  data: CarRentType;
  original?: CarRentType;
  updateState: (name: keyof CarRentType, value: unknown) => void;
}

function CarRentEdit({
  data: carRent,
  original,
  updateState,
}: CarRentEditProps) {
  return (
    <Stack sx={containerSxProps}>
      <InputField
        label="Company Name"
        value={carRent.name}
        original={original?.name}
        updateState={(value) => updateState("name", value)}
      />
      <InputField
        label="Category"
        value={carRent.car_category}
        original={original?.car_category}
        updateState={(value) => updateState("car_category", value)}
      />
      <InputField
        label="Description"
        multiline
        rows={3}
        value={carRent.car_description}
        original={original?.car_description}
        updateState={(value) => updateState("car_description", value)}
      />
      <InputField
        label="Driver"
        value={carRent.driver}
        original={original?.driver}
        updateState={(value) => updateState("driver", value)}
      />
      <InputField
        label="Info"
        value={carRent.info}
        original={original?.info}
        updateState={(value) => updateState("info", value)}
      />
      <BorderBox title="Pick up">
        <Stack gap={defaultGap}>
          <ReadOnlyInputField
            label="Ref"
            defaultValue={carRent.pickup_loc_ref}
          />
          <InputField
            label="Airport"
            value={carRent.pickup_address}
            original={original?.pickup_address}
            updateState={(value) => updateState("pickup_address", value)}
          />
          <DateTimeInput
            label="Check In"
            format="DD/MM/YYYY HH:mm"
            value={setDateTimePicker(
              carRent.pickup_date,
              carRent.pickup_time,
              carRent.pickup_timezone,
            )}
            updateState={(v) => {
              updateDateTime(v, updateState, {
                date: "pickup_date",
                time: "pickup_time",
              });
            }}
            original={
              original
                ? setDateTimePicker(
                    original.pickup_date,
                    original.pickup_time,
                    original.pickup_timezone,
                  )
                : undefined
            }
            // timezone={hotel.timezone}
          />
          <TimezoneAutocomplete
            label="Timezeone"
            value={carRent.pickup_timezone}
            original={original?.pickup_timezone}
            updateState={(value) => updateState("pickup_timezone", value)}
          />
        </Stack>
      </BorderBox>
      <BorderBox title="Dropoff">
        <Stack gap={defaultGap}>
          <ReadOnlyInputField
            label="Ref"
            defaultValue={carRent.dropoff_loc_ref}
          />
          <InputField
            label="Airport"
            value={carRent.dropoff_address}
            original={original?.dropoff_address}
            updateState={(value) => updateState("dropoff_address", value)}
          />
          <DateTimeInput
            label="Check In"
            format="DD/MM/YYYY HH:mm"
            value={setDateTimePicker(
              carRent.dropoff_date,
              carRent.dropoff_time,
              carRent.dropoff_timezone,
            )}
            updateState={(v) => {
              updateDateTime(v, updateState, {
                date: "dropoff_date",
                time: "dropoff_time",
              });
            }}
            original={
              original
                ? setDateTimePicker(
                    original.dropoff_date,
                    original.dropoff_time,
                    original.dropoff_timezone,
                  )
                : undefined
            }
            // timezone={hotel.timezone}
          />
          <TimezoneAutocomplete
            label="Timezeone"
            value={carRent.dropoff_timezone}
            original={original?.dropoff_timezone}
            updateState={(value) => updateState("dropoff_timezone", value)}
          />
        </Stack>
      </BorderBox>
    </Stack>
  );
}

interface CarRentListProps {
  carRents: CarRentType[];
  original?: CarRentType[];
  updateState: (id: string, name: keyof CarRentType, value: unknown) => void;
  addElement?: () => number;
  removeElement?: (id: string) => void;
  resetValue?: () => void;
}

export function CarRentList({
  carRents,
  original,
  updateState,
  addElement,
  removeElement,
  resetValue,
}: CarRentListProps) {
  return (
    <ElementList
      elements={carRents}
      original={original}
      updateState={updateState}
      addElement={addElement}
      removeElement={removeElement}
      resetValue={resetValue}
      as={CarRentEdit}
    />
  );
}
