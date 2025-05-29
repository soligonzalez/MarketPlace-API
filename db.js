import { MongoClient } from "mongodb";

const connectionString = "mongodb+srv://soligonzalez:Lopanebn3!@mymongodb.njix4eg.mongodb.net/";


const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("AgroMarketPlace");

export default db;
