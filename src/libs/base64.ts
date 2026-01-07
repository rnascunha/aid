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

export function unicodeToBase64(str: string): string {
  const utf8Bytes: Uint8Array = new TextEncoder().encode(str);
  const binaryString: string = String.fromCharCode(...utf8Bytes);
  return btoa(binaryString);
}

export function calculateBase64SizeInBytes(base64: string) {
  // Remove any whitespace or newline characters if present
  base64 = base64.replace(/\s/g, "");
  const n = base64.length;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  const sizeInBytes = Math.floor((n * 3) / 4) - padding;

  return sizeInBytes;
}
