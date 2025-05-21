import { Product } from '@/models/Product';
import { getProductById, getProducts } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductDetails from './ProductDetails';

// Generate static params for all products at build time
export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
      id: product._id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const product = await getProductById(params.id);
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.'
      };
    }

    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images && product.images.length > 0 ? [product.images[0]] : ['/products/default-product.jpg']
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the product.'
    };
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    return notFound();
  }

  return <ProductDetails product={product} />;
}
