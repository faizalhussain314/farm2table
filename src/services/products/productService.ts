import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  active: boolean;
  image:string
}

interface ProductResponse {
  results: Product[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getProducts = async (): Promise<ProductResponse> => {
  const response = await axios.get<ProductResponse>(`${baseUrl}/products`);
  return response.data;
};

export const addProduct = async (formData: FormData): Promise<void> => {
  try {
    const response = await axiosInstance.post(`${baseUrl}/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product", error);
    throw new Error("Failed to add product.");
  }
};

export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/products/${productId}`);
  } catch (error) {
    console.error("Error deleting product", error);
    throw new Error("Failed to delete product.");
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (id: string, formData: FormData): Promise<void> => {
  await axiosInstance.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
