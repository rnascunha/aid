import { Stack } from "@mui/material";
import { TravelerType } from "./types";
import { ArrayString, ElementCarousel, InputField } from "./general";
import { containerSxProps } from "./constants";

interface TravelerEditProps {
  traveler: TravelerType;
  original?: TravelerType;
  updateState: (name: keyof TravelerType, value: unknown) => void;
}

function TravelerEdit({ traveler, original, updateState }: TravelerEditProps) {
  return (
    <Stack sx={containerSxProps}>
      <InputField
        label="Name"
        value={traveler.name}
        updateState={(value) => updateState("name", value)}
        original={original?.name}
      />
      <InputField
        label="Age"
        value={+traveler.age}
        type="number"
        slotProps={{
          htmlInput: {
            min: 0,
            step: 1,
          },
        }}
        updateState={(value) => updateState("age", value)}
        original={original ? +original.age : undefined}
      />
      <InputField
        label="Passport"
        value={traveler.passport}
        updateState={(value) => updateState("passport", value)}
        original={original?.passport}
      />
      <ArrayString
        data={traveler.preferences}
        title="Preferences"
        original={original?.preferences}
        updateState={(value) => updateState("preferences", value)}
      />
      <InputField
        label="Info"
        value={traveler.info}
        updateState={(value) => updateState("info", value)}
        original={original?.info}
      />
    </Stack>
  );
}

interface TravelerListProps {
  travelers: TravelerType[];
  original?: TravelerType[];
  updateState: (
    index: number,
    name: keyof TravelerType,
    value: unknown,
  ) => void;
}

export function TravelerList({
  travelers,
  original,
  updateState,
}: TravelerListProps) {
  if (travelers.length === 0) return;

  return (
    <ElementCarousel
      data={travelers.map((traveler, index) => (
        <TravelerEdit
          traveler={traveler}
          key={index}
          original={original?.[index]}
          updateState={(name, value) => updateState(index, name, value)}
        />
      ))}
    />
  );
}
