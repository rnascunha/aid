import z from "zod";

const TravelerType = z.object({
  name: z.string(),
  age: z.string(),
  passport: z.string(),
  preferences: z.array(z.string()),
  info: z.string(),
});
export type TravelerType = z.infer<typeof TravelerType>;

const HotelType = z.object({
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

const FlightType = z.object({
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

const ExtractedDataType = z.object({
  travelers: z.array(TravelerType),
  hotels: z.array(HotelType),
  flights: z.array(FlightType),
});
export type ExtractedDataType = z.infer<typeof ExtractedDataType>;

const StateType = z.object({
  extracted_data: ExtractedDataType,
});
export type StateType = z.infer<typeof StateType>;
