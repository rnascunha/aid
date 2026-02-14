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
import { CarRentType } from "./types";
import dayjs from "@/libs/dayjs";

function CarRentEdit({ carRent }: { carRent: CarRentType }) {
  return (
    <Stack sx={containerSxProps}>
      <InputField label="Company Name" defaultValue={carRent.name} />
      <InputField label="Category" defaultValue={carRent.car_category} />
      <InputField
        label="Description"
        multiline
        rows={3}
        defaultValue={carRent.car_description}
      />
      <InputField label="Driver" defaultValue={carRent.driver} />
      <InputField label="Info" defaultValue={carRent.info} />
      <BorderBox title="Pick up">
        <Stack gap={defaultGap}>
          <ReadOnlyInputField
            label="Ref"
            defaultValue={carRent.pickup_loc_ref}
          />
          <InputField label="Airport" defaultValue={carRent.pickup_address} />
          <DateTimeInput
            label="Date/Time"
            format="DD/MM/YYYY HH:mm"
            defaultValue={dayjs.tz(
              `${carRent.pickup_date} ${carRent.pickup_time}`,
              "DD/MM/YYYY HH:mm",
              carRent.pickup_timezone,
            )}
          />
          <TimezoneAutocomplete
            label="Timezeone"
            value={carRent.pickup_timezone}
          />
        </Stack>
      </BorderBox>
      <BorderBox title="Dropoff">
        <Stack gap={defaultGap}>
          <ReadOnlyInputField
            label="Ref"
            defaultValue={carRent.dropoff_loc_ref}
          />
          <InputField label="Airport" defaultValue={carRent.dropoff_address} />
          <DateTimeInput
            label="Date/Time"
            format="DD/MM/YYYY HH:mm"
            defaultValue={dayjs.tz(
              `${carRent.dropoff_date} ${carRent.dropoff_time}`,
              "DD/MM/YYYY HH:mm",
              carRent.dropoff_timezone,
            )}
          />
          <TimezoneAutocomplete
            label="Timezeone"
            value={carRent.dropoff_timezone}
          />
        </Stack>
      </BorderBox>
    </Stack>
  );
}

export function CarRentList({ carRents }: { carRents: CarRentType[] }) {
  if (carRents.length === 0) return;

  return (
    <ElementCarousel
      data={carRents.map((carRent, index) => (
        <CarRentEdit carRent={carRent} key={index} />
      ))}
    />
  );
}
