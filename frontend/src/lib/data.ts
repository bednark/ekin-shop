import { Product } from '@/lib/types';

const API_URL = process.env.API_URL || 'http://localhost:5099';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error('Error fetching products:', response.statusText);
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data: Product[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProduct = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/product/${id}`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      console.error(`Error fetching product with id ${id}:`, response.statusText);
      throw new Error(`Failed to fetch product with id ${id}: ${response.status}`);
    }

    const data: Product[] = await response.json();
    return data[0];
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};
