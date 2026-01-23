/**
 * run:
 *    npx tsx --env-file=".env" test/storageMongo.ts
 */
import { chats, sessions } from "@/app/(app)/test/init";
import { connect } from "@/libs/chat/storage/mongodb/connect";
import {
  StorageChatMongoDB,
  StorageGeneralMongoDB,
} from "@/libs/chat/storage/mongodb/storageMongoDB";
import { dbName, collections } from "@/libs/chat/storage/mongodb/constants";

async function main() {
  let client;
  try {
    client = await connect();
    const general = new StorageGeneralMongoDB(client, dbName, collections);
    const storage = new StorageChatMongoDB(client, {
      dbName,
      messages: collections.chatMessages,
      senders: collections.chatSenders,
      settings: collections.chatSettings,
    });

    process.stdout.write("Deleting database ... ");
    await general.clear();
    console.log("OK");

    // Senders
    process.stdout.write("Add senders ... ");
    await Promise.all([sessions.map((s) => storage.addSender(s))]);
    // await storage.addSender(sessions[0]);
    console.log("OK");

    process.stdout.write("Gettings senders ... ");
    const newSenders = await storage.getSenders();
    console.log("OK");

    console.log(`Senders received ... [${newSenders.length}]`);

    process.stdout.write("Gettings messages (empty) ... ");
    const emptyMessages = await storage.getMessages(sessions.map((s) => s.id));
    console.log("OK");

    console.log(`Messages received ... [${emptyMessages.length}]`);

    process.stdout.write("Adding messages ... ");
    await storage.addMessage(Object.values(chats).flat());
    console.log("OK");

    process.stdout.write("Gettings messages (empty) ... ");
    const messages = await storage.getMessages(sessions.map((s) => s.id));
    console.log("OK");

    console.log(`Messages received ... [${messages.length}]`);
  } catch (e) {
    console.log("ERROR");
    console.error(e);
  } finally {
    await client?.close();
  }
}

main();
