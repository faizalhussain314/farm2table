import axiosInstance from "../../utils/axiosInstance";



export interface Customer {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    avatar?: string; 
  }
  

export interface NewCustomer {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "customer";
}


export const getCustomers = async (): Promise<Customer[]> => {
    const response = await axiosInstance.get<Customer[]>('/customers');
    return response.data;
  };
  

export const addCustomer = async (data: NewCustomer): Promise<void> => {
  await axiosInstance.post("/auth/register", data);
};
