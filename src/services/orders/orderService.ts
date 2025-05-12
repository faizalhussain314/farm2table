import axios from 'axios';
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

export interface Order {
  id: string;
  customerId: string;
  date: string; // Or Date type
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled'; // Example statuses
  totalAmount: number;
  items: any[]; // Example for order items
  // Add other relevant properties
}

export const getOrders = async (): Promise<DetailedOrder[]> => {
  const response = await axiosInstance.get('/orders');
  return response.data.results;
};

export const updateOrderStatusApi = async (
  orderId: string,
  status: string
): Promise<void> => {
  await axiosInstance.patch(`/orders/${orderId}/status`, { status });
};

export const getOrderById = async(id:string | undefined):Promise<DetailedOrder> =>{
  const response = await axiosInstance.get<DetailedOrder>(`/orders/${id}`);
  return response.data;
}

export const getCustomerOrders = async (customerId: string): Promise<Order[]> => {
  console.log(`Simulating getCustomerOrders for Customer ID: ${customerId}`);
  // --- API Call (Commented Out) ---
  // try {
  //   const response = await axiosInstance.get<Order[]>(`/api/customers/${customerId}/orders`);
  //    if (!response.ok) {
  //      throw new Error(`Error fetching customer orders: ${response.statusText}`);
  //    }
  //   const data: Order[] = await response.json();
  //   return data;
  // } catch (error) {
  //    if (axios.isAxiosError(error)) {
  //      console.error('Axios error in getCustomerOrders:', error.message, error.response?.data);
  //    } else {
  //      console.error('Unexpected error in getCustomerOrders:', error);
  //    }
  //   throw error;
  // }
  // --- End API Call ---

  // --- Dummy Data Simulation ---
  const dummyOrders: Order[] = [
    {
      id: 'order-001',
      customerId: 'dummy-customer-1', // Link to the dummy customer
      date: '2023-10-26T10:00:00Z', // Example date string
      status: 'Completed',
      totalAmount: 150.75,
      items: [{ id: 'item-a', name: 'Product A', price: 50.25, quantity: 3 }],
    },
    {
      id: 'order-002',
      customerId: 'dummy-customer-1', // Link to the dummy customer
      date: '2023-11-15T14:30:00Z',
      status: 'Processing',
      totalAmount: 220.00,
      items: [{ id: 'item-b', name: 'Product B', price: 110.00, quantity: 2 }],
    },
    {
        id: 'order-003',
        customerId: 'dummy-customer-1', // Link to the dummy customer
        date: '2024-01-20T09:15:00Z',
        status: 'Shipped',
        totalAmount: 75.50,
        items: [{ id: 'item-c', name: 'Product C', price: 25.17, quantity: 3 }],
      },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      // Return dummy orders only if the customerId matches the dummy customer ID
      if (customerId === 'dummy-customer-1') {
         resolve(dummyOrders);
      } else {
         resolve([]); // Return empty array for other customer IDs
      }
    }, 1500); // Simulate network delay (slightly longer for orders)
  });
  // --- End Dummy Data ---
};
