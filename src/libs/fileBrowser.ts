export function readFileText(file: File, encoding: string = "UTF-8") {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result);
    };

    reader.onerror = (e) => {
      reject(e.target?.error);
    };

    reader.readAsText(file, encoding);
  });
}
