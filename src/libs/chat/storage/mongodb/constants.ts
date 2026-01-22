const username = process.env.MONGODB_USERNAME as string;
const password = process.env.MONGODB_PASSWORD as string;

export const connectString = `mongodb+srv://${username}:${password}@aid0cluster.eenkh7c.mongodb.net/?appName=AId0Cluster`;

export const dbName = "AIdmain";

export const collections = {
  providers: "providers",
  tools: "tools",
  chatMessages: "chatMessages",
  chatSenders: "chatSenders",
};
