import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";



export interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  avatar?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  vendornameId?: string;
}

export interface Order {
  id: string;
  customerId: string;
  date: string; // Or Date type - using string for simplicity with dummy data
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled'; // Example statuses
  totalAmount: number;
  items: any[]; // Example for order items (can be simplified for dummy)
  // Add other relevant properties
}

  

export interface NewCustomer {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "customer";
}


export const getCustomers = async (): Promise<Customer[]> => {
    const response = await axiosInstance.get('/customers');
    return response.data.results;
  };
  

export const addCustomer = async (data: NewCustomer): Promise<void> => {
  await axiosInstance.post("/auth/register", data);
};

// ... (existing imports and getCustomers function)

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  console.log(`Simulating getCustomerById for ID: ${id}`);
  // --- API Call (Commented Out) ---
  // try {
  //   const response = await axiosInstance.get<Customer>(`/api/customers/${id}`);
  //   if (!response.data) {
  //      return null;
  //   }
  //   return response.data;
  // } catch (error) {
  //   if (axios.isAxiosError(error)) {
  //     if (error.response && error.response.status === 404) {
  //       console.warn(`Customer with ID ${id} not found.`);
  //       return null;
  //     }
  //      console.error('Axios error in getCustomerById:', error.message, error.response?.data);
  //   } else {
  //      console.error('Unexpected error in getCustomerById:', error);
  //   }
  //   throw error;
  // }
  // --- End API Call ---

  // --- Dummy Data Simulation ---
  const dummyCustomer: Customer = {
    id: 'dummy-customer-1', // Use a specific dummy ID
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg', // Example dummy avatar
    isActive: true,
    role: 'manikandan',
    vendornameId: 'vendor-abc',
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      // Return the dummy customer if the ID matches, otherwise return null
      if (id === dummyCustomer.id) {
        resolve(dummyCustomer);
      } else {
        resolve(null); // Simulate customer not found
      }
    }, 1000); // Simulate network delay
  });
  // --- End Dummy Data ---
};