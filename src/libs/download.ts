export function download(
  data: BlobPart | BlobPart[],
  type: string,
  fileName: string
): void {
  const blob: Blob = new Blob(Array.isArray(data) ? data : [data], { type });
  const objectUrl: string = URL.createObjectURL(blob);
  const a: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;

  a.href = objectUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}
