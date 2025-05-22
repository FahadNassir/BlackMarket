import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

const client: MongoClient = new MongoClient(uri);
const clientPromise: Promise<MongoClient> = client.connect();

export async function connectDB(): Promise<Db> {
  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    return client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
