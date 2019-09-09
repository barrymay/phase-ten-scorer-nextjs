// Import Dependencies
import url from 'url';
import { MongoClient, Db } from 'mongodb';
import { Response } from 'express';

// Create cached connection variable
const cachedDb: Db | null = null;

// A function for connecting to MongoDB,
// taking a single paramater of the connection string
async function connectToDatabase(uri: string) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });

  // Select the database through the connection,
  // using the database path of the connection string
  const db = await client.db(url.parse(uri).pathname.substr(1));

  // Cache the database connection and return the connection
  return db;
}

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
export default async (_req: Request, res: Response) => {
  // Get a database connection, cached or otherwise,
  // using the connection string environment variable as the argument
  const db = await (cachedDb || connectToDatabase(process.env.MONGODB_URI));

  // Select the "users" collection from the database
  const collection = await db.collection('users');

  // Select the users collection from the database
  const users = await collection.find({}).toArray();

  // Respond with a JSON string of all users in the collection
  res.status(200).json({ users });
};
