import axios from 'axios';
import { Product } from '@/lib/types';

const API_URL = "http://localhost:5099";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(API_URL + '/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchProduct = async (id: number): Promise<Product> => {
  try {
    const response = await axios.get(API_URL + '/product/' + id);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};