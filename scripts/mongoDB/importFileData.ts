/**
 * This script import data from a file and a user to to database
 *
 * To run:
 * npx tsx --env-file=.env scripts/mongoDB/importFileData.ts <file> <userId>
 */

import {
  collections,
  connectString,
  dbName,
} from "@/libs/chat/storage/mongodb/constants";
import { MongoClient } from "mongodb";
import fs from "fs/promises";
import {
  MongoDBAudioToTextServer,
  MongoDBChatbotServer,
  MongoDBChatServer,
  MongoDBGeneralServer,
} from "@/libs/chat/storage/mongodb/server";
import { DBExportFormatV1 } from "@/libs/chat/storage/types";

async function main(file: string, userId: string) {
  let client;
  try {
    client = await MongoClient.connect(connectString);

    process.stdout.write("Opening file ... ");
    const dataRaw = await fs.readFile(file, "utf-8");
    console.log("OK");

    process.stdout.write("Parsing file ... ");
    const data: DBExportFormatV1 = JSON.parse(dataRaw);
    console.log("OK");

    const general = new MongoDBGeneralServer(client, dbName, collections);
    const chat = new MongoDBChatServer(client, {
      dbName,
      messages: collections.chatMessages,
      senders: collections.chatSenders,
      settings: collections.chatSettings,
    });
    const audioToText = new MongoDBAudioToTextServer(client, {
      dbName,
      messages: collections.audioToTextMessages,
      senders: collections.audioToTextSenders,
      settings: collections.audioToTextSettings,
    });
    const chatbot = new MongoDBChatbotServer(client, {
      dbName,
      messages: collections.chatbotMessages,
      senders: collections.chatbotSenders,
    });

    process.stdout.write("Importing data ... ");
    await Promise.all([
      // General
      general.addProvider(data.providers, userId),
      data.tools
        ? general.updateTools({ ip: "", ...data.tools }, userId)
        : undefined,
      // Chat
      chat.addMessage(data.chatMessages, userId),
      chat.addSender(data.chatModels, userId),
      data.chatSettings
        ? chat.updateSettings(data.chatSettings, userId)
        : undefined,
      // AudioToText
      audioToText.addMessage(data.audioToTextMessages, userId),
      audioToText.addSender(data.audioToTextModels, userId),
      data.audioToTextSettings
        ? audioToText.updateSettings(data.audioToTextSettings, userId)
        : undefined,
      // Chatbot
      chatbot.addMessage(data.chatbotMessages, userId),
      chatbot.addSender(data.chatbotSenders, userId),
    ]);
    console.log("OK");
  } catch (e) {
    console.log("ERROR");
    console.error(e);
  } finally {
    await client?.close();
  }
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true; // File exists
  } catch {
    return false; // File does not exist or other access error
  }
}

async function checkParams(params: string[]) {
  if (params.length !== 2) {
    console.log(
      `Wrong number or argumnts! Found ${params.length}, should be 2`,
    );
    console.log("\t<file> <userId>");
    process.exit(1);
  }

  const exists = await fileExists(params[0]);
  if (!exists) {
    console.log(`File '${params[0]}' does no exits`);
    process.exit(2);
  }
  return params;
}

checkParams(process.argv.slice(2)).then((p) => {
  main(p[0], p[1]);
});
