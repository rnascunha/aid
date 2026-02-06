import { collections, dbName } from "./constants";
import { connect } from "./connect";
import {
  MongoDBAgentTravelerServer,
  MongoDBAudioToTextServer,
  MongoDBChatbotServer,
  MongoDBChatServer,
  MongoDBGeneralServer,
} from "./server";

export let generalStorage: MongoDBGeneralServer | undefined;
export let chatStorage: MongoDBChatServer | undefined;
export let audioToTextStorage: MongoDBAudioToTextServer | undefined;
export let chatbotStorage: MongoDBChatbotServer | undefined;
export let agentTravelerStorage: MongoDBAgentTravelerServer | undefined;

connect().then((c) => {
  generalStorage = new MongoDBGeneralServer(c, dbName, collections);
  chatStorage = new MongoDBChatServer(c, {
    dbName,
    messages: collections.chatMessages,
    senders: collections.chatSenders,
    settings: collections.chatSettings,
  });
  audioToTextStorage = new MongoDBAudioToTextServer(c, {
    dbName,
    messages: collections.audioToTextMessages,
    senders: collections.audioToTextSenders,
    settings: collections.audioToTextSettings,
  });
  chatbotStorage = new MongoDBChatbotServer(c, {
    dbName,
    messages: collections.chatbotMessages,
    senders: collections.chatbotSenders,
  });
  agentTravelerStorage = new MongoDBAgentTravelerServer(c, {
    dbName,
    messages: collections.agentTravelerMessages,
    senders: collections.agentTravelerSenders,
  });
});
