/**
 * This script will drop all collections and create new ones
 *
 * To run:
 * npx tsx --env-file=.env scripts/mongoDB/createCollections.ts
 */

import {
  collections,
  connectString,
  dbName,
} from "@/libs/chat/storage/mongodb/constants";
import { Db, MongoClient } from "mongodb";

async function dropAllCollections(db: Db, collections: string[]) {
  const promises = collections.map(async (c) => {
    await db.collection(c).drop();
  });
  await Promise.all(promises);
}

async function main() {
  let client;
  try {
    client = await MongoClient.connect(connectString);

    const db = client.db(dbName);

    process.stdout.write("Dropping collections ... ");
    await dropAllCollections(db, Object.values(collections));
    console.log("OK");

    const noIndexCollections = [
      collections.tools,
      collections.chatSettings,
      collections.audioToTextSettings,
    ].map(async (c) => {
      await db.createCollection(c);
    });

    const indexCollections = [
      collections.providers,
      collections.chatMessages,
      collections.chatSenders,
      collections.audioToTextMessages,
      collections.audioToTextSenders,
      collections.chatbotMessages,
      collections.chatbotSenders,
    ].map(async (c) => {
      const col = await db.createCollection(c);
      await col.createIndexes([
        { key: { id: 1 } },
        { key: { userId: 1 } },
      ]);
    });

    process.stdout.write("Creating collections ... ");
    await Promise.all([...noIndexCollections, ...indexCollections]);

    console.log("OK");
  } catch (e) {
    console.log("ERROR");
    console.error(e);
  } finally {
    await client?.close();
  }
}

main();
