import axiosInstance from '../../utils/axiosInstance';

// Define the detailed order interface based on the provided API response
export interface DetailedOrder {
  _id: string;
  customer: {
    isActive: boolean;
    isVeg: boolean;
    email: string;
    name: string;
    phoneNumber: string;
    role: string;
    id: string;
  };
  items: {
    productId: {
      name: string;
      category: string;
      subcategory?: string;
      price: number;
      unit: string;
      stock: number;
      active: boolean;
      description?: string;
      image: string;
      id: string;
    };
    quantity: number;
    _id: string;
  }[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderResponse {
  results: DetailedOrder[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export const getOrders = async (): Promise<OrderResponse> => {
  const response = await axiosInstance.get<OrderResponse>('/orders');
  return response.data;
};