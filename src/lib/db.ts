import { ObjectId, WithId, Document } from 'mongodb';
import { connectDB } from './mongodb.server';
import { Product } from '@/models/Product';

export type ConnectDBFunction = typeof connectDB;

export async function getProducts(): Promise<Product[]> {
  const db = await connectDB();
  try {
    const products = await db.collection('products').find().toArray();
    return products.map((doc: WithId<Document>) => ({
      _id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      price: doc.price,
      category: doc.category,
      images: doc.images,
      stock: doc.stock,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await connectDB();
  try {
    const objectId = new ObjectId(id);
    const productDoc = await db.collection('products').findOne({ _id: objectId });
    
    if (!productDoc) {
      return null;
    }
    return {
      _id: productDoc._id.toString(),
      name: productDoc.name,
      description: productDoc.description,
      price: productDoc.price,
      category: productDoc.category,
      images: productDoc.images,
      stock: productDoc.stock,
      createdAt: productDoc.createdAt,
      updatedAt: productDoc.updatedAt
    } as Product;
  } catch (error: unknown) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function addProduct(product: Omit<Product, '_id'>) {
  const db = await connectDB();
  return db.collection('products').insertOne(product);
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, '_id'>>) {
  const db = await connectDB();
  try {
    const objectId = new ObjectId(id);
    return db.collection('products').updateOne({ _id: objectId }, { $set: updates });
  } catch (error: unknown) {
    console.error('Error updating product:', error);
    return { matchedCount: 0, modifiedCount: 0 };
  }
}

export async function deleteProduct(id: string) {
  const db = await connectDB();
  try {
    const objectId = new ObjectId(id);
    return db.collection('products').deleteOne({ _id: objectId });
  } catch (error) {
    console.error('Invalid ObjectId:', error);
    return { deletedCount: 0 };
  }
}

export { connectDB };
