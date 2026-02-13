import dayjs from "@/libs/dayjs";
import {
  ArrayString,
  BorderBox,
  DateTimeInput,
  InputField,
  ReadOnlyInputField,
  TimezoneAutocomplete,
} from "./supportBaseComponents";
import { FlightType, HotelType, StateType, TravelerType } from "./types";
import { Stack } from "@mui/material";
import { PanelList, PanelUnit } from "@/components/panels";

import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import { VList } from "virtua";

interface TravelerEditProps {
  traveler: TravelerType;
}

const defaultGap = 0.75;
const marginBottomDefault = 2;

function TravelerEdit({ traveler }: TravelerEditProps) {
  return (
    <Stack
      gap={defaultGap}
      sx={{
        mb: marginBottomDefault,
      }}
    >
      <InputField label="Name" defaultValue={traveler.name} />
      <InputField label="Age" defaultValue={+traveler.age} type="number" />
      <InputField label="Passport" defaultValue={traveler.passport} />
      <ArrayString data={traveler.preferences} title="Preferences" />
      <InputField label="Info" defaultValue={traveler.passport} />
    </Stack>
  );
}

function TravelerList({ travelers }: { travelers: TravelerType[] }) {
  if (travelers.length === 0) return;

  return (
    <Stack
      sx={{
        height: "100%",
      }}
    >
      <VList data={travelers} style={{ paddingTop: 10 }} bufferSize={1000}>
        {(traveler, index) => <TravelerEdit traveler={traveler} key={index} />}
      </VList>
    </Stack>
  );
}

interface HotelEditProps {
  hotel: HotelType;
}

function HotelEdit({ hotel }: HotelEditProps) {
  return (
    <Stack gap={defaultGap} sx={{ mb: marginBottomDefault }}>
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

function HotelList({ hotels }: { hotels: HotelType[] }) {
  if (hotels.length === 0) return;

  return (
    <Stack
      sx={{
        height: "100%",
      }}
    >
      <VList data={hotels} style={{ paddingTop: 10 }} bufferSize={1000}>
        {(hotel, index) => <HotelEdit hotel={hotel} key={index} />}
      </VList>
    </Stack>
  );
}

function FilghEdit({ flight }: { flight: FlightType }) {
  return (
    <Stack gap={defaultGap} sx={{ mb: marginBottomDefault }}>
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

function FlightList({ flights }: { flights: FlightType[] }) {
  if (flights.length === 0) return;

  return (
    <Stack
      sx={{
        height: "100%",
      }}
    >
      <VList data={flights} style={{ paddingTop: 10 }} bufferSize={1000}>
        {(flight, index) => <FilghEdit flight={flight} key={index} />}
      </VList>
    </Stack>
  );
}

interface EditStateTabProps {
  state: StateType;
}

export function EditStateTab({ state }: EditStateTabProps) {
  const panels: PanelUnit[] = [
    {
      "aria-label": "Travelers",
      icon: <PersonIcon />,
      title: "Travelers",
      panel: <TravelerList travelers={state.extracted_data.travelers} />,
    },
    {
      "aria-label": "Hotels",
      title: "Hotels",
      icon: <HotelIcon />,
      panel: <HotelList hotels={state.extracted_data.hotels} />,
    },
    {
      "aria-label": "Flights",
      title: "Flights",
      icon: <LocalAirportIcon />,
      panel: <FlightList flights={state.extracted_data.flights} />,
    },
  ];
  return <PanelList orientation="vertical" panels={panels} />;
}
