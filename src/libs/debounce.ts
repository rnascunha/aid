export function debounce<T extends unknown[]>(
  func: (...a: T) => void,
  delay: number
) {
  let timeout_id: ReturnType<typeof setTimeout>;
  return <U extends T>(...args: U) => {
    clearTimeout(timeout_id);
    timeout_id = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function debounce_r<T extends unknown[], R>(
  func: (...a: T) => R,
  delay: number
) {
  let timeout_id: ReturnType<typeof setTimeout>;
  return <U extends T>(...args: U) => {
    return new Promise((resolve, reject) => {
      clearTimeout(timeout_id);
      timeout_id = setTimeout(() => {
        try {
          resolve(func(...args));
        } catch (e) {
          reject(e);
        }
      }, delay);
    });
  };
}
