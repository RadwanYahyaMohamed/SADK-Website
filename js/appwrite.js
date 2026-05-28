import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("69a8b588001ea207b07c");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

client.ping();

export { client, account, databases, storage };
