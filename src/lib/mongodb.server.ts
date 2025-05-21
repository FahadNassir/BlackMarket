import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: process.cwd() + '/.env.local' });

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Initialize client and connection
client = new MongoClient(process.env.MONGODB_URI!);
clientPromise = client.connect();

export async function connectDB() {
  try {
    // Get cached client
    const client = await clientPromise;
    
    // Verify connection
    await client.db().command({ ping: 1 });
    return client.db();
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}
