import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined. Please set it in your environment variables.');
  process.exit(1);
}

const client: MongoClient = new MongoClient(uri);
const clientPromise: Promise<MongoClient> = client.connect();

export async function connectDB(): Promise<Db> {
  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    console.log('Successfully connected to MongoDB');
    return client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
