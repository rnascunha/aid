/**
 *
 */

import {
  collections,
  connectString,
  dbName,
} from "@/libs/chat/storage/mongodb/constants";
import { MongoClient } from "mongodb";

async function main() {
  let client;
  try {
    client = await MongoClient.connect(connectString);

    const db = client.db(dbName);

    process.stdout.write("Creating providers ... ");
    await (
      await db.createCollection(collections.providers)
    ).createIndex({ id: 1 }, { unique: true });
    console.log("OK");
  } catch (e) {
    console.log("ERROR");
    console.error(e);
  } finally {
    await client?.close();
  }
}

main();
