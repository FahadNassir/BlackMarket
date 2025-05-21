import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: process.cwd() + '/.env.local' });

const client: MongoClient = new MongoClient(process.env.MONGODB_URI!);
const clientPromise: Promise<MongoClient> = client.connect();

export async function connectDB(): Promise<Db> {
  try {
    // Get cached client
    const client = await clientPromise;
    
    // Verify connection
    await client.db().command({ ping: 1 });
    return client.db();
  } catch (error: unknown) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
