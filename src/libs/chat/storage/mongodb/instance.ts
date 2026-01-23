import { StorageChatMongoDB, StorageGeneralMongoDB } from "./storageMongoDB";
import { collections, dbName } from "./constants";
import { connect } from "./connect";

export let generalStorage: StorageGeneralMongoDB | undefined;
export let chatStorage: StorageChatMongoDB | undefined;
connect().then((c) => {
  generalStorage = new StorageGeneralMongoDB(c, dbName, collections);
  chatStorage = new StorageChatMongoDB(c, {
    dbName,
    messages: collections.chatMessages,
    senders: collections.chatSenders,
    settings: collections.chatSettings,
  });
});
