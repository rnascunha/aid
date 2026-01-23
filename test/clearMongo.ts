/**
 * run:
 *    npx tsx --env-file=".env" test/clearMongo.ts
 */
import { connect } from "@/libs/chat/storage/mongodb/connect";
import { MongoDBGeneralServer } from "@/libs/chat/storage/mongodb/server";
import { dbName, collections } from "@/libs/chat/storage/mongodb/constants";

async function main() {
  let client;
  try {
    client = await connect();
    const general = new MongoDBGeneralServer(client, dbName, collections);

    process.stdout.write("Deleting database ... ");
    await general.clear();
    console.log("OK");
  } catch (e) {
    console.log("ERROR");
    console.error(e);
  } finally {
    await client?.close(true);
  }
}

main();
