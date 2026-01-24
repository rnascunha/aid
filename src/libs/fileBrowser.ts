export function readFileText(
  file: File,
  encoding: string = "UTF-8",
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };

    reader.onerror = (e) => {
      reject(e.target?.error);
    };

    reader.readAsText(file, encoding);
  });
}
