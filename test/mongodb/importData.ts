/**
 *
 */

import {
  collections,
  connectString,
  dbName,
} from "@/libs/chat/storage/mongodb/constants";
import { MongoClient } from "mongodb";
import fs from "fs/promises";

const fileOutput = "data.json";

async function main() {
  let client;
  try {
    client = await MongoClient.connect(connectString);

    const db = client.db(dbName);

    const data = await Object.values(collections).reduce(
      async (acc, c) => {
        const result = await acc;
        process.stdout.write(`Getting '${c}' ... `);
        const values = await db
          .collection(c)
          .find({}, { projection: { _id: 0 } })
          .toArray();
        result[c] = values as unknown;
        console.log(`OK [${values.length}]`);
        return result;
      },
      {} as Promise<Record<string, unknown>>,
    );

    await fs.writeFile(
      `${__dirname}/${fileOutput}`,
      JSON.stringify(data, null, 2),
    );
  } catch (e) {
    console.log("ERROR");
    console.error(e);
  } finally {
    await client?.close();
  }
}

main();
