import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client()
    .setEndpoint("https://sadk.tech/v1")
    .setProject("69a8b588001ea207b07c");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };
