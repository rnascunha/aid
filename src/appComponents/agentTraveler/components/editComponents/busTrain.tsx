import { Stack } from "@mui/material";
import { containerSxProps, defaultGap } from "./constants";
import { BusTrainType } from "./types";
import {
  ArrayString,
  BorderBox,
  DateTimeInput,
  ElementCarousel,
  InputField,
  ReadOnlyInputField,
  SelectChoices,
  TimezoneAutocomplete,
} from "./general";
import dayjs from "@/libs/dayjs";
import { VList } from "virtua";

function BusTrainEdit({ busTrain }: { busTrain: BusTrainType }) {
  return (
    <Stack sx={containerSxProps}>
      <InputField label="Company Name" defaultValue={busTrain.company_name} />
      <SelectChoices
        title="Type"
        selected={busTrain.type}
        options={["bus", "train"]}
      />
      <InputField
        label="Ticket Reference"
        defaultValue={busTrain.ticket_reference}
      />
      <InputField label="Travel Number" defaultValue={busTrain.travel_number} />
      <ArrayString data={busTrain.travelers} title="Passengers" />
      <ArrayString data={busTrain.seats} title="Seats" />
      <BorderBox title="Departure">
        <Stack gap={defaultGap}>
          <InputField label="Origin" defaultValue={busTrain.origin} />
          <ReadOnlyInputField
            label="Ref"
            defaultValue={busTrain.departure_loc_ref}
          />
          <InputField
            label="Origin Address"
            defaultValue={busTrain.departure_address}
          />
          <DateTimeInput
            label="Date/Time"
            format="DD/MM/YYYY HH:mm"
            defaultValue={dayjs.tz(
              `${busTrain.departure_date} ${busTrain.departure_time}`,
              "DD/MM/YYYY HH:mm",
              busTrain.departure_timezone,
            )}
          />
          <TimezoneAutocomplete
            label="Timezeone"
            value={busTrain.departure_timezone}
          />
        </Stack>
      </BorderBox>
      <BorderBox title="Arrival">
        <Stack gap={defaultGap}>
          <InputField label="Destination" defaultValue={busTrain.destination} />
          <ReadOnlyInputField
            label="Ref"
            defaultValue={busTrain.arrival_loc_ref}
          />
          <InputField label="Airport" defaultValue={busTrain.arrival_address} />
          <DateTimeInput
            label="Date/Time"
            format="DD/MM/YYYY HH:mm"
            defaultValue={dayjs.tz(
              `${busTrain.arrival_date} ${busTrain.arrival_time}`,
              "DD/MM/YYYY HH:mm",
              busTrain.arrival_timezone,
            )}
          />
          <TimezoneAutocomplete
            label="Timezeone"
            value={busTrain.arrival_timezone}
          />
        </Stack>
      </BorderBox>
      <InputField label="Info" defaultValue={busTrain.info} />
    </Stack>
  );
}

export function BusTrainList({ busTrains }: { busTrains: BusTrainType[] }) {
  if (busTrains.length === 0) return;

  return (
    <ElementCarousel
      data={busTrains.map((busTrain, index) => (
        <BusTrainEdit busTrain={busTrain} key={index} />
      ))}
    />
  );
}
