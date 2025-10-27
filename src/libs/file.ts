import { writeFile } from "fs/promises";
import path from "path";

export async function saveFile(file: File, pathFile: string) {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  await writeFile(path.join(pathFile, file.name), data);
}
