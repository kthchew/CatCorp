import { MongoClient } from "mongodb";
import 'dotenv/config'
const Db = process.env.VITE_CONN_STRING;
const client = new MongoClient(Db);
 
var _db;
 
export async function connectToServer() {
  await client.connect();
  _db = client.db("catdata").collection("users");
  console.log("Connected to Database!");
  // let results = await _db.find({})
  // .limit(50)
  // .toArray();
  // console.log(results);
}
export function getDb() {
  return _db;
}