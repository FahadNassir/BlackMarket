import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb.server';

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      throw new Error('Failed to connect to database');
    }

    const products = await db.collection('products').find().toArray();
    if (!Array.isArray(products)) {
      throw new Error('Invalid products data format');
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
