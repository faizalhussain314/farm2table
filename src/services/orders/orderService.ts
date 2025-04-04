import axiosInstance from '../../utils/axiosInstance';

export interface Order {
  id: string;
  customer: string;
  product: string;
  date: string;
  total: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

interface OrderResponse {
  results: Order[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export const getOrders = async (): Promise<OrderResponse> => {
  const response = await axiosInstance.get<OrderResponse>('/orders');
  return response.data;
};
