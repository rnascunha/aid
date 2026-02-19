import { ProblemDataType, WhatToPackType } from "./types";
import { ElementArrayString } from "./component";

interface ProblemListProps {
  problems: ProblemDataType;
  original?: ProblemDataType;
  updateState: (value: string[]) => void;
  multiline?: boolean;
  rows?: number;
}

export function ProblemList({
  problems,
  original,
  updateState,
  multiline,
  rows,
}: ProblemListProps) {
  return (
    <ElementArrayString
      elements={problems.problem_data}
      original={original?.problem_data}
      updateState={updateState}
      title="Points of Attention"
      multiline={multiline}
      rows={rows}
    />
  );
}
