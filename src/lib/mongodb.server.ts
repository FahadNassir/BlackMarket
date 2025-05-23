import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

const client: MongoClient = new MongoClient(uri || '', {
  tlsAllowInvalidCertificates: true, // This is only for Vercel build time
  serverSelectionTimeoutMS: 5000,     // Timeout after 5 seconds
});

const clientPromise: Promise<MongoClient> = client.connect();

export async function connectDB(): Promise<Db> {
  if (!uri || process.env.VERCEL === '1') {
    throw new Error('MongoDB connection not available during build time');
  }

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
