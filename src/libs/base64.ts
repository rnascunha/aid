export function blobTobase64(
  blob: Blob,
  mimeType: string,
  prefix: boolean = false
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrlPrefix = `data:${mimeType};base64,`;
      const base64WithDataUrlPrefix = reader.result as string;
      const base64 = !prefix
        ? base64WithDataUrlPrefix.replace(dataUrlPrefix, "")
        : base64WithDataUrlPrefix;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function filePathToBase64(
  path: string,
  type: string,
  prefix: boolean = false
) {
  const res = await fetch(path);
  const blob = await res.blob();
  return await blobTobase64(blob, type, prefix);
}
