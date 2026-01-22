import { MongoClient } from "mongodb";
import { connectString } from "./constants";

let client: MongoClient | null = null;

export async function connect() {
    if (client) return client;
    client = await MongoClient.connect(connectString);
    return client;
}

connect()