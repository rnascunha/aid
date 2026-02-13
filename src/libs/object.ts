export function isEmpty(obj: Record<string, unknown>) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

export function updateDeep(
  original: Record<string, unknown>,
  keys: string[],
  value?: object | string | number | boolean | null,
) {
  if (keys.length === 0 && typeof value === "object") {
    return value as Record<string, unknown>;
  }

  let current = original;
  for (let i = 0; i < keys.length - 1; ++i) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = Array.isArray(current) ? [] : {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
  return original;
}
