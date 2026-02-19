// import { Stack } from "@mui/material";
// import { containerSxProps } from "./constants";
// import { DestinationType, HighlightType } from "./types";
// import { InputField } from "./general";
// import { ElementList } from "./component";

// function HighlightsEdit({ hl }: { hl: HighlightType }) {
//   return <Stack></Stack>;
// }

// interface DestinationEditProps {
//   data: DestinationType;
//   original?: DestinationType;
//   updateState: (name: keyof DestinationType, value: unknown) => void;
// }

// function DestinationEdit({
//   data,
//   original,
//   updateState,
// }: DestinationEditProps) {
//   return (
//     <Stack sx={containerSxProps}>
//       <InputField
//         label="Name"
//         value={data.name}
//         original={original?.name}
//         updateState={(value) => updateState("name", value)}
//       />
//       <InputField
//         label="Country"
//         value={data.country}
//         original={original?.country}
//         updateState={(value) => updateState("country", value)}
//       />
//       <InputField
//         label="Brief"
//         value={data.brief}
//         original={original?.brief}
//         updateState={(value) => updateState("brief", value)}
//       />
//     </Stack>
//   );
// }

// interface DestinationListProps {
//   destinations: DestinationType[];
//   original?: DestinationType[];
//   updateState: (
//     id: string,
//     name: keyof DestinationType,
//     value: unknown,
//   ) => void;
//   addElement?: () => number;
//   removeElement?: (id: string) => void;
//   resetValue?: () => void;
// }

// export function DestinationList({
//   destinations,
//   original,
//   updateState,
//   addElement,
//   removeElement,
//   resetValue,
// }: DestinationListProps) {
//   return (
//     <ElementList
//       elements={destinations}
//       original={original}
//       updateState={updateState}
//       addElement={addElement}
//       removeElement={removeElement}
//       resetValue={resetValue}
//       as={DestinationEdit}
//     />
//   );
// }
