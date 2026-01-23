/**
 * run:
 *    npx tsx --env-file=".env" test/clearMongo.ts
 */
import { connect } from "@/libs/chat/storage/mongodb/connect";
import { StorageGeneralMongoDB } from "@/libs/chat/storage/mongodb/storageMongoDB";
import { dbName, collections } from "@/libs/chat/storage/mongodb/constants";

async function main() {
  let client;
  try {
    client = await connect();
    const general = new StorageGeneralMongoDB(client, dbName, collections);

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
