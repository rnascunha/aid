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

export function downloadString(
  str: string,
  name: string,
  type = "text/plain"
) {
  const a = document.createElement("a");
  a.href = `data:${type};charset=utf-8, ${encodeURIComponent(str)}`;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadBase64(base64Data: string, fileName: string): void {
  const linkSource = base64Data.startsWith('data:') 
    ? base64Data 
    : `data:application/octet-stream;base64,${base64Data}`;

  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}