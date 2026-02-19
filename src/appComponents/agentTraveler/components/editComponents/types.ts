import z from "zod";

const BaseElementType = z.object({
  id: z.string(),
});

const TravelerType = BaseElementType.extend({
  name: z.string(),
  age: z.string(),
  passport: z.string(),
  preferences: z.array(z.string()),
  info: z.string(),
});
export type TravelerType = z.infer<typeof TravelerType>;

const HotelType = BaseElementType.extend({
  name: z.string(),
  address: z.string(),
  checkin_date: z.string(),
  checkin_time: z.string(),
  checkout_date: z.string(),
  checkout_time: z.string(),
  description: z.string(),
  guests: z.array(z.string()),
  room_type: z.string(),
  info: z.string(),
  timezone: z.string(),
  loc_ref: z.string(),
});
export type HotelType = z.infer<typeof HotelType>;

const FlightType = BaseElementType.extend({
  company_name: z.string(),
  booking_reference: z.string(),
  flight_number: z.string(),
  departure_loc_ref: z.string(),
  departure_airport: z.string(),
  departure_date: z.string(),
  departure_time: z.string(),
  departure_timezone: z.string(),
  arrival_loc_ref: z.string(),
  arrival_airport: z.string(),
  arrival_date: z.string(),
  arrival_time: z.string(),
  arrival_timezone: z.string(),
  class_type: z.string(),
  baggage: z.string(),
});
export type FlightType = z.infer<typeof FlightType>;

const BusTrainType = BaseElementType.extend({
  company_name: z.string(),
  type: z.literal(["bus", "train"]),
  ticket_reference: z.string(),
  travel_number: z.string(),
  origin: z.string(),
  departure_loc_ref: z.string(),
  departure_address: z.string(),
  departure_date: z.string(),
  departure_time: z.string(),
  departure_timezone: z.string(),
  destination: z.string(),
  arrival_loc_ref: z.string(),
  arrival_address: z.string(),
  arrival_date: z.string(),
  arrival_time: z.string(),
  arrival_timezone: z.string(),
  seats: z.array(z.string()),
  travelers: z.array(z.string()),
  info: z.string(),
});
export type BusTrainType = z.infer<typeof BusTrainType>;

const CarRentType = BaseElementType.extend({
  name: z.string(),
  pickup_loc_ref: z.string(),
  pickup_address: z.string(),
  pickup_date: z.string(),
  pickup_time: z.string(),
  pickup_timezone: z.string(),
  dropoff_loc_ref: z.string(),
  dropoff_address: z.string(),
  dropoff_date: z.string(),
  dropoff_time: z.string(),
  dropoff_timezone: z.string(),
  car_category: z.string(),
  car_description: z.string(),
  info: z.string(),
  driver: z.string(),
});
export type CarRentType = z.infer<typeof CarRentType>;

const EventType = BaseElementType.extend({
  name: z.string(),
  address: z.string(),
  address_loc_ref: z.string(),
  date: z.string(),
  begin_time: z.string(),
  seats: z.array(z.string()),
  travelers: z.array(z.string()),
  info: z.string(),
  timezone: z.string(),
});
export type EventType = z.infer<typeof EventType>;

const ExtractedDataType = z.object({
  travelers: z.array(TravelerType),
  hotels: z.array(HotelType),
  flights: z.array(FlightType),
  bus_trains: z.array(BusTrainType),
  car_rents: z.array(CarRentType),
  events: z.array(EventType),
});
export type ExtractedDataType = z.infer<typeof ExtractedDataType>;

const PlaceType = BaseElementType.extend({
  name: z.string(),
  type: z.string(),
  types: z.array(z.string()),
  address: z.string(),
  reference: z.array(z.string()),
  place_id: z.string(),
  photos: z.array(z.string()),
  latitude: z.string(),
  longitude: z.string(),
  map_url: z.string(),
  timezone: z.string(),
});
export type PlaceType = z.infer<typeof PlaceType>;

const DestinationDataType = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  brief: z.string(),
  reference: z.string(),
  highlights: z.array(z.string()),
  map_url: z.string(),
  address: z.string(),
  type: z.string(),
});
export type DestinationDataType = z.infer<typeof DestinationDataType>;

// const HighlightType = z.object({
//   name: z.string(),
//   address: z.string(),
//   map_url: z.string(),
//   type: z.string(),
//   photos: z.array(z.string()),
// });
// export type HighlightType = z.infer<typeof HighlightType>;

// const DestinationType = z.object({
//   id: z.string(),
//   name: z.string(),
//   country: z.string(),
//   brief: z.string(),
//   highlights: z.array(HighlightType),
// });
// export type DestinationType = z.infer<typeof DestinationType>;

const WhatToPackType = z.object({
  what_to_pack_data: z.array(z.string()),
});
export type WhatToPackType = z.infer<typeof WhatToPackType>;

const ProblemDataType = z.object({
  problem_data: z.array(z.string()),
});
export type ProblemDataType = z.infer<typeof ProblemDataType>;

const StateType = z.object({
  extracted_data: ExtractedDataType,
  places_data: z.array(PlaceType),
  destination_data: z.array(DestinationDataType),
  // destinations: z.array(DestinationType),
  what_to_pack_data: WhatToPackType,
  problem_data: ProblemDataType,
});
export type StateType = z.infer<typeof StateType>;

export type ExtractedDataKey = keyof StateType["extracted_data"];
export type ExtractedDataValue<T extends ExtractedDataKey> =
  StateType["extracted_data"][T][number];

export type EmptyExtracredValuesType = {
  [K in ExtractedDataKey]: ExtractedDataValue<K>;
};

export type StateDataKey = keyof Omit<
  StateType,
  "extracted_data" | "what_to_pack_data" | "problem_data"
>;
export type StateDataValue<T extends StateDataKey> = StateType[T][number];

export type EmptyDataValues = {
  [K in StateDataKey]: StateDataValue<K>;
};
