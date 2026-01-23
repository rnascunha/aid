const username = process.env.MONGODB_USERNAME as string;
const password = process.env.MONGODB_PASSWORD as string;

export const connectString = `mongodb+srv://${username}:${password}@aid0cluster.eenkh7c.mongodb.net/?appName=AId0Cluster`;

export const dbName = "AIdmain";

export const collections = {
  // General
  providers: "providers",
  tools: "tools",
  // Chat
  chatMessages: "chatMessages",
  chatSenders: "chatSenders",
  chatSettings: "chatSettings",
  // AudioToText
  audioToTextMessages: "audioToTextMessages",
  audioToTextSenders: "audioToTextSenders",
  audioToTextSettings: "audioToTextSettings",
  // Chatbot
  chatbotMessages: "chatbotMessages",
  chatbotSenders: "chatbotSenders",
  chatbotSettings: "chatbotSettings",
};

export type MongoDBCollecions = typeof collections;
