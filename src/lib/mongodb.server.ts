import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const client: MongoClient = new MongoClient(uri, {
  tlsAllowInvalidCertificates: true, // This is only for Vercel build time
  serverSelectionTimeoutMS: 5000,     // Timeout after 5 seconds
  retryWrites: true,
  w: 'majority'
});

const clientPromise: Promise<MongoClient> = client.connect();

export async function connectDB(): Promise<Db> {
  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    console.log('Successfully connected to MongoDB');
    return client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}
