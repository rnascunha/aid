import {
  ExtractedDataKey,
  PlaceType,
  StateDataKey,
  StateType,
} from "./editComponents/types";
import { PanelList, PanelUnit } from "@/components/panels";
import { TravelerList } from "./editComponents/traveler";
import { HotelList } from "./editComponents/hotel";
import { FlightList } from "./editComponents/flight";
import { BusTrainList } from "./editComponents/busTrain";
import { CarRentList } from "./editComponents/carRent";
import { EventList } from "./editComponents/event";

import { PlaceList } from "./editComponents/place";
import { useState } from "react";
import {
  emptyExtractedValues,
  stateEmptyValues,
} from "./editComponents/constants";
import { generateUUID } from "@/libs/uuid";
import { WhatToPackList } from "./editComponents/whatToPack";

import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import CarRentalIcon from "@mui/icons-material/CarRental";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BackpackIcon from "@mui/icons-material/Backpack";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MapIcon from "@mui/icons-material/Map";

import { ProblemList } from "./editComponents/problem";
import { DestinationDataList } from "./editComponents/destinationData";

interface EditStateTabProps {
  state: StateType;
}

export function EditStateTab({ state: originalState }: EditStateTabProps) {
  const [state, setState] = useState(structuredClone(originalState));

  const addExtracted = (namespace: ExtractedDataKey) => {
    const newPage = state.extracted_data[namespace].length + 1;
    setState((prev) => ({
      ...prev,
      extracted_data: {
        ...prev.extracted_data,
        [namespace]: [
          ...prev.extracted_data[namespace],
          { ...emptyExtractedValues[namespace], id: generateUUID() },
        ],
      },
    }));
    return newPage;
  };

  const removeExtracted = (namespace: ExtractedDataKey, id: string) => {
    setState((prev) => ({
      ...prev,
      extracted_data: {
        ...prev.extracted_data,
        [namespace]: prev.extracted_data[namespace].filter((p) => p.id !== id),
      },
    }));
  };

  const resetExtracted = (namespace: ExtractedDataKey) => {
    setState((prev) => ({
      ...prev,
      extracted_data: {
        ...prev.extracted_data,
        [namespace]: originalState.extracted_data[namespace],
      },
    }));
  };

  const updateExtracted = (
    namespace: ExtractedDataKey,
    id: string,
    name: string,
    value: unknown,
  ) => {
    setState((prev) => ({
      ...prev,
      extracted_data: {
        ...prev.extracted_data,
        [namespace]: (prev.extracted_data[namespace] as { id: string }[]).map(
          (v) => {
            if (v.id !== id) return v;
            return { ...(v as object), [name]: value };
          },
        ),
      },
    }));
  };

  const addState = (namespace: StateDataKey) => {
    const newPage = state[namespace].length + 1;
    setState((prev) => ({
      ...prev,
      [namespace]: [
        ...prev[namespace],
        { ...stateEmptyValues[namespace], id: generateUUID() },
      ],
    }));
    return newPage;
  };

  const removeState = (namespace: StateDataKey, id: string) => {
    setState((prev) => ({
      ...prev,
      [namespace]: prev[namespace].filter((p) => p.id !== id),
    }));
  };

  const resetStateValue = (namespace: StateDataKey) => {
    setState((prev) => ({
      ...prev,
      [namespace]: originalState[namespace],
    }));
  };

  const updateState = (
    namespace: StateDataKey,
    id: string,
    name: string,
    value: unknown,
  ) =>
    setState((prev) => ({
      ...prev,
      [namespace]: prev[namespace].map((v) =>
        v.id !== id ? v : { ...v, [name]: value },
      ),
    }));

  const panels: PanelUnit[] = [
    {
      "aria-label": "Travelers",
      icon: <PersonIcon />,
      title: "Travelers",
      panel: (
        <TravelerList
          travelers={state.extracted_data.travelers}
          original={originalState.extracted_data.travelers}
          updateState={(id, name, value) =>
            updateExtracted("travelers", id, name, value)
          }
          addElement={() => addExtracted("travelers")}
          removeElement={(id: string) => removeExtracted("travelers", id)}
          resetValue={() => resetExtracted("travelers")}
        />
      ),
    },
    {
      "aria-label": "Hotels",
      title: "Hotels",
      icon: <HotelIcon />,
      panel: (
        <HotelList
          hotels={state.extracted_data.hotels}
          original={originalState.extracted_data.hotels}
          updateState={(id, name, value) =>
            updateExtracted("hotels", id, name, value)
          }
          addElement={() => addExtracted("hotels")}
          removeElement={(id: string) => removeExtracted("hotels", id)}
          resetValue={() => resetExtracted("hotels")}
        />
      ),
    },
    {
      "aria-label": "Flights",
      title: "Flights",
      icon: <LocalAirportIcon />,
      panel: (
        <FlightList
          flights={state.extracted_data.flights}
          original={originalState.extracted_data.flights}
          updateState={(id, name, value) =>
            updateExtracted("flights", id, name, value)
          }
          addElement={() => addExtracted("flights")}
          removeElement={(id: string) => removeExtracted("flights", id)}
          resetValue={() => resetExtracted("flights")}
          getLabel={(f) => `${f.company_name} ${f.flight_number}`}
        />
      ),
    },
    {
      "aria-label": "BusTrain",
      title: "Bus and Trains",
      icon: <DirectionsBusIcon />,
      panel: (
        <BusTrainList
          busTrains={state.extracted_data.bus_trains}
          original={originalState.extracted_data.bus_trains}
          updateState={(id, name, value) =>
            updateExtracted("bus_trains", id, name, value)
          }
          addElement={() => addExtracted("bus_trains")}
          removeElement={(id: string) => removeExtracted("bus_trains", id)}
          resetValue={() => resetExtracted("bus_trains")}
          getLabel={(f) => `${f.company_name}: ${f.origin} - ${f.destination}`}
        />
      ),
    },
    {
      "aria-label": "CarRent",
      title: "Car Rent",
      icon: <CarRentalIcon />,
      panel: (
        <CarRentList
          carRents={state.extracted_data.car_rents}
          original={originalState.extracted_data.car_rents}
          updateState={(id, name, value) =>
            updateExtracted("car_rents", id, name, value)
          }
          addElement={() => addExtracted("car_rents")}
          removeElement={(id: string) => removeExtracted("car_rents", id)}
          resetValue={() => resetExtracted("car_rents")}
        />
      ),
    },
    {
      "aria-label": "Event",
      title: "Event",
      icon: <TheaterComedyIcon />,
      panel: (
        <EventList
          events={state.extracted_data.events}
          original={originalState.extracted_data.events}
          updateState={(id, name, value) =>
            updateExtracted("events", id, name, value)
          }
          addElement={() => addExtracted("events")}
          removeElement={(id: string) => removeExtracted("events", id)}
          resetValue={() => resetExtracted("events")}
        />
      ),
    },
    {
      "aria-label": "Place",
      title: "Place",
      icon: <LocationOnIcon />,
      panel: (
        <PlaceList
          places={state.places_data}
          original={originalState.places_data}
          updateState={(id, name, value) =>
            updateState("places_data", id, name, value)
          }
          addElement={() => addState("places_data")}
          removeElement={(id) => removeState("places_data", id)}
          resetValue={() => resetStateValue("places_data")}
        />
      ),
    },
    {
      "aria-label": "Destination data",
      title: "Destination Data",
      icon: <MapIcon />,
      panel: (
        <DestinationDataList
          destinationsData={state.destination_data}
          original={originalState.destination_data}
          updateState={(id, name, value) =>
            updateState("destination_data", id, name, value)
          }
          addElement={() => addState("destination_data")}
          removeElement={(id) => removeState("destination_data", id)}
          resetValue={() => resetStateValue("destination_data")}
        />
      ),
    },
    {
      "aria-label": "What to pack",
      title: "What To Pack",
      icon: <BackpackIcon />,
      panel: (
        <WhatToPackList
          whatToPack={state.what_to_pack_data}
          original={originalState.what_to_pack_data}
          updateState={(v) =>
            setState((prev) => ({
              ...prev,
              what_to_pack_data: { what_to_pack_data: v },
            }))
          }
        />
      ),
    },
    {
      "aria-label": "Point of attention",
      title: "Point of Attention",
      icon: <ReportProblemIcon />,
      panel: (
        <ProblemList
          problems={state.problem_data}
          original={originalState.problem_data}
          updateState={(v) =>
            setState((prev) => ({
              ...prev,
              problem_data: { problem_data: v },
            }))
          }
          multiline
          rows={4}
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
