import { connectDB } from '../src/lib/db';
import { Product } from '../src/models/Product';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path:'.env' });

const sampleProducts: Omit<Product, '_id'>[] = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium wireless headphones with active noise cancellation",
    price: 199.99,
    category: "Electronics",
    images: ["/products/headphones.jpg"],
    stock: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Smartwatch",
    description: "Feature-rich smartwatch with fitness tracking and notifications",
    price: 299.99,
    category: "Electronics",
    images: ["/products/smartwatch.jpg"],
    stock: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Gaming Laptop",
    description: "High-performance gaming laptop with NVIDIA RTX 3060",
    price: 1499.99,
    category: "Electronics",
    images: ["/products/laptop.jpg"],
    stock: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Smartphone",
    description: "Latest flagship smartphone with 5G and triple camera",
    price: 999.99,
    category: "Electronics",
    images: ["/products/smartphone.jpg"],
    stock: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with RGB lighting",
    price: 49.99,
    category: "Electronics",
    images: ["/products/mouse.jpg"],
    stock: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Gaming Keyboard",
    description: "Mechanical gaming keyboard with RGB backlighting",
    price: 129.99,
    category: "Electronics",
    images: ["/products/keyboard.jpg"],
    stock: 40,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedProducts() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set in .env.local');
    }

    console.log('Connecting to database...');
    const db = await connectDB();
    const productsCollection = db.collection('products');
    
    // Delete existing products
    console.log('Clearing existing products...');
    await productsCollection.deleteMany({});
    
    // Insert sample products
    console.log('Inserting sample products...');
    await productsCollection.insertMany(sampleProducts);
    
    console.log('Successfully seeded products!');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
