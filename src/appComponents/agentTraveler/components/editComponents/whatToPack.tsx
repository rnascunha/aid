import { WhatToPackType } from "./types";
import { ElementArrayString } from "./component";

interface WhatToPackListProps {
  whatToPack: WhatToPackType;
  original?: WhatToPackType;
  updateState: (value: string[]) => void;
}

export function WhatToPackList({
  whatToPack,
  original,
  updateState,
}: WhatToPackListProps) {
  return (
    <ElementArrayString
      elements={whatToPack.what_to_pack_data}
      original={original?.what_to_pack_data}
      updateState={updateState}
      title="What To Pack"
    />
  );
}
