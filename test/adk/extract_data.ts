import { fetchQuery, getSession, initiateSession } from "@/libs/adk/base";
import { Part } from "@/libs/adk/types";
import { PartInlineData } from "@/libs/chat/types";
import { generateUUID } from "@/libs/uuid";
import { Dirent } from "fs";
import fs from "fs/promises";
// import * as adk from "@/libs/adk/base";

const app_name = "extract_data";
const user = "user_test";
const session = generateUUID();
const url = "http://127.0.0.1:8000";

const file_path = "/home/rnascunha/Downloads/users/data/italia-franca/";

const outputFile = "/home/rnascunha/Downloads/test.json";

function print(data: unknown) {
  console.dir(data, { depth: null });
}

async function readFiles(path: string) {
  return (
    await fs.readdir(path, {
      withFileTypes: true,
    })
  ).filter((f) => f.isFile() && /.*\.(pdf|png|jpg)/.test(f.name));
}

function getTypeByName(name: string) {
  const extension = name.slice(name.lastIndexOf(".") + 1);
  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "png":
    case "jpg":
      return `image/${extension}`;
  }
  throw new Error(`Undefined file type [${extension}]`);
}

async function toPartInlineParts(files: Dirent[]): Promise<PartInlineData[]> {
  const promises = files.map(async (f) => {
    const type = getTypeByName(f.name);
    const buffer = await fs.readFile(`${f.parentPath}/${f.name}`, {
      flag: "r",
    });
    const data = Buffer.from(buffer).toString("base64");
    return {
      data,
      mimeType: type,
      displayName: f.name,
    } as PartInlineData;
  });

  return await Promise.all(promises);
}

async function fetchADKData({
  app_name,
  user,
  session,
  parts,
}: {
  app_name: string;
  user: string;
  session: string;
  parts: Part[];
}) {
  const initResponse = await initiateSession({
    app_name,
    user,
    session,
  });

  if (![200, 409].includes(initResponse.status))
    throw new Error(
      `Error initiaing response ${initResponse.status}/${initResponse.statusText}`,
    );

  const response = await fetchQuery({
    app_name,
    user,
    session,
    parts,
    url,
  });

  return await response.json();
}

async function main() {
  try {
    process.stdout.write("Reading files ... ");
    const files = await readFiles(file_path);
    console.log(`OK [${files.length}]`);

    if (files.length === 0) {
      console.log("No files found");
      return;
    }

    process.stdout.write("Creating parts ... ");
    const parts = (await toPartInlineParts(files)).map((p) => ({
      inlineData: p,
    }));
    console.log("OK");

    // console.log(parts)

    process.stdout.write("Sending request ... ");
    await fetchADKData({
      app_name,
      user,
      session,
      parts,
    });
    console.log("OK");

    // print(response);

    process.stdout.write("Getting session ... ");
    const sessionResponse = await getSession({
      app_name,
      user,
      session,
    });
    console.log("OK");

    process.stdout.write("Saving files ... ");
    await fs.writeFile(outputFile, JSON.stringify(sessionResponse.data));
    console.log("OK");

    // print(sessionResponse);
  } catch (e) {
    console.log("ERROR");
    console.log(e);
  }
}

main();
