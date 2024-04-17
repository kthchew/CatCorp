import { MongoClient } from "mongodb";
import 'dotenv/config'
const Db = process.env.VITE_CONN_STRING;
const client = new MongoClient(Db);
 
var _dbU;
var _dbC;
 
export async function connectToServer() {
  await client.connect();
  _dbU = client.db("catdata").collection("users");
  _dbC = client.db("catdata").collection("classes");
  console.log("Connected to Database!");
  // let results = await _db.find({})
  // .limit(50)
  // .toArray();
  // console.log(results);
}
export function getUserDB() {
  return _dbU;
}

export function getClassDB() {
  return _dbC;
}