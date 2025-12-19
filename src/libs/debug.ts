export function printDeep(
  data: unknown,
  { depth = null }: { depth: null | number }
) {
  console.dir(data, { depth });
}
