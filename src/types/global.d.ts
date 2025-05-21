declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
import { MongoClient } from 'mongodb';

export {};
