import { Stack } from "@mui/material";
import {
  ArrayString,
  ImageBoard,
  InputField,
  TimezoneAutocomplete,
} from "./general";
import { containerSxProps, defaultGap } from "./constants";
import { PlaceType } from "./types";
import { ElementList } from "./component";

interface PlaceEditProps {
  data: PlaceType;
  original?: PlaceType;
  updateState: (name: keyof PlaceType, value: unknown) => void;
}

function PlaceEdit({ data: place, original, updateState }: PlaceEditProps) {
  return (
    <Stack sx={containerSxProps}>
      <InputField
        label="Name"
        value={place.name}
        original={original?.name}
        updateState={(value) => updateState("name", value)}
      />
      <InputField
        label="Address"
        value={place.address}
        original={original?.address}
        updateState={(value) => updateState("address", value)}
      />
      <InputField
        label="Type"
        value={place.type}
        original={original?.type}
        updateState={(value) => updateState("type", value)}
      />
      <ArrayString
        title="Types"
        data={place.types}
        original={original?.types}
        updateState={(value) => updateState("types", value)}
      />
      <ArrayString title="Reference" data={place.reference} readOnly />
      <InputField
        label="Map URL"
        value={place.map_url}
        original={original?.map_url}
        updateState={(value) => updateState("map_url", value)}
      />
      <Stack direction="row" gap={defaultGap}>
        <InputField
          fullWidth
          label="Latitude"
          value={place.latitude}
          original={original?.latitude}
          updateState={(value) => updateState("latitude", value)}
        />
        <InputField
          fullWidth
          label="Longitude"
          value={place.longitude}
          original={original?.longitude}
          updateState={(value) => updateState("longitude", value)}
        />
      </Stack>
      <InputField
        label="Place ID"
        value={place.place_id}
        original={original?.place_id}
        updateState={(value) => updateState("place_id", value)}
      />
      <TimezoneAutocomplete
        label="Timezone"
        value={place.timezone}
        original={original?.timezone}
        updateState={(value) => updateState("timezone", value)}
      />
      <ImageBoard
        images={place.photos}
        alt={place.name}
        original={original?.photos}
        updateState={(value) => updateState("photos", value)}
      />
    </Stack>
  );
}

interface PlaceListProps {
  places: PlaceType[];
  original?: PlaceType[];
  updateState: (index: number, name: keyof PlaceType, value: unknown) => void;
  addElement?: () => number;
  removeElement?: (id: string) => void;
  resetValue?: () => void;
}

export function PlaceList({
  places,
  original,
  updateState,
  addElement,
  removeElement,
  resetValue,
}: PlaceListProps) {
  return (
    <ElementList
      elements={places}
      original={original}
      updateState={updateState}
      addElement={addElement}
      removeElement={removeElement}
      resetValue={resetValue}
      as={PlaceEdit}
    />
  );
}
