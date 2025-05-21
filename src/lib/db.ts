import { connectDB } from './mongodb.server';
import { ObjectId } from 'mongodb';

export type ConnectDBFunction = typeof connectDB;

export async function getProducts() {
  const db = await connectDB();
  return db.collection('products').find().toArray();
}

export async function getProductById(id: string) {
  const db = await connectDB();
  try {
    const objectId = new ObjectId(id);
    const productDoc = await db.collection('products').findOne({ _id: objectId });
    
    if (!productDoc) {
      return null;
    }

    // Convert MongoDB document to Product type
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
    };
  } catch (error) {
    console.error('Invalid ObjectId:', error);
    return null;
  }
}

export async function addProduct(product: any) {
  const db = await connectDB();
  return db.collection('products').insertOne(product);
}

export async function updateProduct(id: string, updates: any) {
  const db = await connectDB();
  try {
    const objectId = new ObjectId(id);
    return db.collection('products').updateOne({ _id: objectId }, { $set: updates });
  } catch (error) {
    console.error('Invalid ObjectId:', error);
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
