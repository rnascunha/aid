import { Stack } from "@mui/material";
import { TravelerType } from "./types";
import { ArrayString, ElementCarousel, InputField } from "./general";
import { containerSxProps } from "./constants";

interface TravelerEditProps {
  traveler: TravelerType;
}

function TravelerEdit({ traveler }: TravelerEditProps) {
  return (
    <Stack sx={containerSxProps}>
      <InputField label="Name" defaultValue={traveler.name} />
      <InputField
        label="Age"
        defaultValue={+traveler.age}
        type="number"
        slotProps={{
          htmlInput: {
            min: 0,
            step: 1,
          },
        }}
      />
      <InputField label="Passport" defaultValue={traveler.passport} />
      <ArrayString data={traveler.preferences} title="Preferences" />
      <InputField label="Info" defaultValue={traveler.passport} />
    </Stack>
  );
}

export function TravelerList({ travelers }: { travelers: TravelerType[] }) {
  if (travelers.length === 0) return;

  return (
    <ElementCarousel
      data={travelers.map((traveler, index) => (
        <TravelerEdit traveler={traveler} key={index} />
      ))}
    />
  );
}
