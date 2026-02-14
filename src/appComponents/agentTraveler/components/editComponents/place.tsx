import { Stack } from "@mui/material";
import {
  ArrayString,
  ElementCarousel,
  ImageBoard,
  InputField,
  TimezoneAutocomplete,
} from "./general";
import { containerSxProps, defaultGap } from "./constants";
import { PlaceType } from "./types";

function PlaceEdit({ place }: { place: PlaceType }) {
  return (
    <Stack sx={containerSxProps}>
      <InputField label="Name" defaultValue={place.name} />
      <InputField label="Address" defaultValue={place.address} />
      <InputField label="Type" defaultValue={place.type} />
      <ArrayString title="Types" data={place.types} />
      <ArrayString title="Reference" data={place.reference} readOnly />
      <InputField label="Map URL" defaultValue={place.map_url} />
      <Stack direction="row" gap={defaultGap}>
        <InputField fullWidth label="Latitude" defaultValue={place.latitude} />
        <InputField
          fullWidth
          label="Longitude"
          defaultValue={place.longitude}
        />
      </Stack>
      <InputField label="Place ID" defaultValue={place.place_id} />
      <TimezoneAutocomplete label="Timezone" value={place.timezone} />
      <ImageBoard images={place.photos} alt={place.name} />
    </Stack>
  );
}

export function PlaceList({ places }: { places: PlaceType[] }) {
  if (places.length === 0) return;

  return (
    <ElementCarousel
      data={places.map((place, index) => (
        <PlaceEdit place={place} key={index} />
      ))}
    />
  );
}
