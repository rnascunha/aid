import { ExtractedDataKey, PlaceType, StateType } from "./editComponents/types";
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
import { useState } from "react";
import { emptyExtractedValues, emptyPlaces } from "./editComponents/constants";
import { generateUUID } from "@/libs/uuid";

interface EditStateTabProps {
  state: StateType;
}

export function EditStateTab({ state: originalState }: EditStateTabProps) {
  const [state, setState] = useState(
    structuredClone(originalState.extracted_data),
  );
  const [places, setPlaces] = useState(
    structuredClone(originalState.places_data),
  );

  const addElement = (namespace: ExtractedDataKey) => {
    const newPage = state[namespace].length + 1;
    setState((prev) => ({
      ...prev,
      [namespace]: [
        ...prev[namespace],
        { ...emptyExtractedValues[namespace], id: generateUUID() },
      ],
    }));
    return newPage;
  };

  const removeElement = (namespace: ExtractedDataKey, id: string) => {
    setState((prev) => ({
      ...prev,
      [namespace]: prev[namespace].filter((p) => p.id !== id),
    }));
  };

  const resetValue = (namespace: ExtractedDataKey) => {
    setState((prev) => ({
      ...prev,
      [namespace]: originalState.extracted_data[namespace],
    }));
  };

  const updateState = (
    namespace: ExtractedDataKey,
    index: number,
    name: string,
    value: unknown,
  ) => {
    setState((prev) => ({
      ...prev,
      [namespace]: (prev[namespace] as unknown[]).map((v, i) => {
        if (i !== index) return v;
        return { ...(v as object), [name]: value };
      }),
    }));
  };

  const addPlace = () => {
    const newPage = places.length + 1;
    setPlaces((prev) => [...prev, { ...emptyPlaces, id: generateUUID() }]);
    return newPage;
  };

  const removePlace = (id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  const resetPlaceValue = () => {
    setPlaces(originalState.places_data);
  };

  const updatePlaces = (index: number, name: keyof PlaceType, value: unknown) =>
    setPlaces((prev) =>
      prev.map((v, i) => (i !== index ? v : { ...v, [name]: value })),
    );

  const panels: PanelUnit[] = [
    {
      "aria-label": "Travelers",
      icon: <PersonIcon />,
      title: "Travelers",
      panel: (
        <TravelerList
          travelers={state.travelers}
          original={originalState.extracted_data.travelers}
          updateState={(index, name, value) =>
            updateState("travelers", index, name, value)
          }
          addElement={() => addElement("travelers")}
          removeElement={(id: string) => removeElement("travelers", id)}
          resetValue={() => resetValue("travelers")}
        />
      ),
    },
    {
      "aria-label": "Hotels",
      title: "Hotels",
      icon: <HotelIcon />,
      panel: (
        <HotelList
          hotels={state.hotels}
          original={originalState.extracted_data.hotels}
          updateState={(index, name, value) =>
            updateState("hotels", index, name, value)
          }
          addElement={() => addElement("hotels")}
          removeElement={(id: string) => removeElement("hotels", id)}
          resetValue={() => resetValue("hotels")}
        />
      ),
    },
    {
      "aria-label": "Flights",
      title: "Flights",
      icon: <LocalAirportIcon />,
      panel: (
        <FlightList
          flights={state.flights}
          original={originalState.extracted_data.flights}
          updateState={(index, name, value) =>
            updateState("flights", index, name, value)
          }
          addElement={() => addElement("flights")}
          removeElement={(id: string) => removeElement("flights", id)}
          resetValue={() => resetValue("flights")}
        />
      ),
    },
    {
      "aria-label": "BusTrain",
      title: "Bus and Trains",
      icon: <DirectionsBusIcon />,
      panel: (
        <BusTrainList
          busTrains={state.bus_trains}
          original={originalState.extracted_data.bus_trains}
          updateState={(index, name, value) =>
            updateState("bus_trains", index, name, value)
          }
          addElement={() => addElement("bus_trains")}
          removeElement={(id: string) => removeElement("bus_trains", id)}
          resetValue={() => resetValue("bus_trains")}
        />
      ),
    },
    {
      "aria-label": "CarRent",
      title: "Car Rent",
      icon: <CarRentalIcon />,
      panel: (
        <CarRentList
          carRents={state.car_rents}
          original={originalState.extracted_data.car_rents}
          updateState={(index, name, value) =>
            updateState("car_rents", index, name, value)
          }
          addElement={() => addElement("car_rents")}
          removeElement={(id: string) => removeElement("car_rents", id)}
          resetValue={() => resetValue("car_rents")}
        />
      ),
    },
    {
      "aria-label": "Event",
      title: "Event",
      icon: <TheaterComedyIcon />,
      panel: (
        <EventList
          events={state.events}
          original={originalState.extracted_data.events}
          updateState={(index, name, value) =>
            updateState("events", index, name, value)
          }
          addElement={() => addElement("events")}
          removeElement={(id: string) => removeElement("events", id)}
          resetValue={() => resetValue("events")}
        />
      ),
    },
    {
      "aria-label": "Place",
      title: "Place",
      icon: <LocationOnIcon />,
      panel: (
        <PlaceList
          places={places}
          original={originalState.places_data}
          updateState={updatePlaces}
          addElement={addPlace}
          removeElement={removePlace}
          resetValue={resetPlaceValue}
        />
      ),
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
      containerSx={{
        maxWidth: "calc(100% - 50px)",
      }}
    />
  );
}
