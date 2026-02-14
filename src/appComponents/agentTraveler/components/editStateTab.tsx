import { StateType } from "./editComponents/types";
import { PanelList, PanelUnit } from "@/components/panels";
import { TravelerList } from "./editComponents/traveler";
import { HotelList } from "./editComponents/hotel";
import { FlightList } from "./editComponents/flight";
import { BusTrainList } from "./editComponents/busTrain";
import { CarRentList } from "./editComponents/carRent";
import { EventList } from "./editComponents/event";

import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import CarRentalIcon from "@mui/icons-material/CarRental";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { PlaceList } from "./editComponents/place";

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
    {
      "aria-label": "BusTrain",
      title: "Bus and Trains",
      icon: <DirectionsBusIcon />,
      panel: <BusTrainList busTrains={state.extracted_data.bus_trains} />,
    },
    {
      "aria-label": "CarRent",
      title: "Car Rent",
      icon: <CarRentalIcon />,
      panel: <CarRentList carRents={state.extracted_data.car_rents} />,
    },
    {
      "aria-label": "Event",
      title: "Event",
      icon: <TheaterComedyIcon />,
      panel: <EventList events={state.extracted_data.events} />,
    },
    {
      "aria-label": "Place",
      title: "Place",
      icon: <LocationOnIcon />,
      panel: <PlaceList places={state.places_data} />,
    },
  ];
  return (
    <PanelList
      orientation="vertical"
      panels={panels}
      sx={{
        width: "50px",
      }}
      tabProps={{
        sx: {
          minWidth: 0,
          width: "100%",
          p: 0,
        },
      }}
    />
  );
}
