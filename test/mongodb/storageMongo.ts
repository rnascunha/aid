/**
 * run:
 *    npx tsx --env-file=".env" test/storageMongo.ts
 */
import { chats, sessions } from "@/app/(app)/test/init";
import { connect } from "@/libs/chat/storage/mongodb/connect";
import {
  MongoDBGeneralServer,
  MongoDBChatServer,
} from "@/libs/chat/storage/mongodb/server";
import { dbName, collections } from "@/libs/chat/storage/mongodb/constants";

const userId = "guest";

async function main() {
  let client;
  try {
    client = await connect();
    const general = new MongoDBGeneralServer(client, dbName, collections);
    const storage = new MongoDBChatServer(client, {
      dbName,
      messages: collections.chatMessages,
      senders: collections.chatSenders,
      settings: collections.chatSettings,
    });

    process.stdout.write("Deleting database ... ");
    await general.clear(userId);
    console.log("OK");

    // Senders
    process.stdout.write("Add senders ... ");
    await Promise.all([sessions.map((s) => storage.addSender(s, userId))]);
    // await storage.addSender(sessions[0]);
    console.log("OK");

    process.stdout.write("Gettings senders ... ");
    const newSenders = await storage.getSenders(userId);
    console.log("OK");

    console.log(`Senders received ... [${newSenders.length}]`);

    process.stdout.write("Gettings messages (empty) ... ");
    const emptyMessages = await storage.getMessages(
      sessions.map((s) => s.id),
      userId,
    );
    console.log("OK");

    console.log(`Messages received ... [${emptyMessages.length}]`);

    process.stdout.write("Adding messages ... ");
    await storage.addMessage(Object.values(chats).flat(), userId);
    console.log("OK");

    process.stdout.write("Gettings messages (empty) ... ");
    const messages = await storage.getMessages(
      sessions.map((s) => s.id),
      userId,
    );
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
