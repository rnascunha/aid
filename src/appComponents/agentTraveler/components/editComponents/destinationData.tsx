import { Stack } from "@mui/material";
import { containerSxProps } from "./constants";
import { DestinationDataType } from "./types";
import { ArrayString, InputField, ReadOnlyInputField } from "./general";
import { ElementList } from "./component";

interface DestinationDataEditProps {
  data: DestinationDataType;
  original?: DestinationDataType;
  updateState: (name: keyof DestinationDataType, value: unknown) => void;
}

function DestinationDataEdit({
  data,
  original,
  updateState,
}: DestinationDataEditProps) {
  return (
    <Stack sx={containerSxProps}>
      <InputField
        label="Name"
        value={data.name}
        original={original?.name}
        updateState={(value) => updateState("name", value)}
      />
      <InputField
        label="Country"
        value={data.country}
        original={original?.country}
        updateState={(value) => updateState("country", value)}
      />
      <InputField
        label="Brief"
        value={data.brief}
        original={original?.brief}
        updateState={(value) => updateState("brief", value)}
        multiline
        rows={3}
      />
      <InputField
        label="Map Link"
        value={data.map_url}
        original={original?.map_url}
        updateState={(value) => updateState("map_url", value)}
      />
      <InputField
        label="Type"
        value={data.type}
        original={original?.type}
        updateState={(value) => updateState("type", value)}
      />
      <ReadOnlyInputField defaultValue={data.reference} label="Ref" />
      <ArrayString
        data={data.highlights}
        original={data.highlights}
        title="Highlights"
        updateState={(value) => updateState("highlights", value)}
      />
    </Stack>
  );
}

interface DestinationDataListProps {
  destinationsData: DestinationDataType[];
  original?: DestinationDataType[];
  updateState: (
    id: string,
    name: keyof DestinationDataType,
    value: unknown,
  ) => void;
  addElement?: () => number;
  removeElement?: (id: string) => void;
  resetValue?: () => void;
}

export function DestinationDataList({
  destinationsData,
  original,
  updateState,
  addElement,
  removeElement,
  resetValue,
}: DestinationDataListProps) {
  return (
    <ElementList
      elements={destinationsData}
      original={original}
      updateState={updateState}
      addElement={addElement}
      removeElement={removeElement}
      resetValue={resetValue}
      as={DestinationDataEdit}
    />
  );
}
