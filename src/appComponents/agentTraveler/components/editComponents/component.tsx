import { ComponentProps, ElementType, useState } from "react";
import {
  AddRemoveElement,
  ArrayString,
  ElementCarousel,
  EmptyElement,
  ScrollableContainer,
} from "./general";

type ElementProps<E extends ElementType, T> = {
  as: E;
  data: T;
  original?: T;
  updateState: (name: keyof T, value: unknown) => void;
} & ComponentProps<E>;

function Element<E extends ElementType, T extends { id: string }>({
  as: El,
  data,
  original,
  updateState,
}: ElementProps<E, T>) {
  return <El data={data} original={original} updateState={updateState} />;
}

interface ElementListProps<T extends { id: string }> {
  elements: T[];
  original?: T[];
  updateState: (id: string, name: keyof T, value: unknown) => void;
  addElement?: () => number;
  removeElement?: (id: string) => void;
  resetValue?: () => void;
  as: ElementType;
  getLabel?: (op: { id: string }) => string;
}

export function ElementList<T extends { id: string }>({
  elements,
  original,
  updateState,
  addElement,
  removeElement,
  resetValue,
  as: El,
  getLabel,
}: ElementListProps<T>) {
  const [page, setPage] = useState(1);

  return (
    <AddRemoveElement
      addElement={
        addElement
          ? () => {
              const newPage = addElement();
              setPage(newPage as number);
            }
          : undefined
      }
      removeElement={
        removeElement
          ? () => {
              removeElement?.(elements[page - 1].id);
              setPage(Math.max(1, page - 1));
            }
          : undefined
      }
      resetValue={
        resetValue
          ? () => {
              resetValue();
              setPage(1);
            }
          : undefined
      }
      // endElement={
      //   elements.length > 0 ? (
      //     <SelectElement
      //       options={elements}
      //       selected={elements[page - 1].id}
      //       title=""
      //       updatePage={setPage}
      //       getName={(op) => ("name" in op ? op.name : op.id) as string}
      //     />
      //   ) : undefined
      // }
    >
      {elements.length !== 0 ? (
        <ElementCarousel
          page={page}
          updatePage={setPage}
          elements={elements}
          getLabel={getLabel}
          data={elements.map((element) => (
            <Element
              as={El}
              data={element}
              key={element.id}
              original={original?.find((o) => o.id === element.id)}
              updateState={(name: keyof T, value: unknown) =>
                updateState(element.id, name, value)
              }
            />
          ))}
        />
      ) : (
        <EmptyElement />
      )}
    </AddRemoveElement>
  );
}

interface ElementArrayStringProps {
  elements: string[];
  original?: string[];
  updateState: (value: string[]) => void;
  title: string;
  multiline?: boolean;
  rows?: number;
}

export function ElementArrayString({
  elements,
  original,
  updateState,
  title,
  multiline,
  rows,
}: ElementArrayStringProps) {
  return (
    <ScrollableContainer>
      <ArrayString
        data={elements}
        original={original}
        title={title}
        updateState={updateState}
        multiline={multiline}
        rows={rows}
      />
    </ScrollableContainer>
  );
}
