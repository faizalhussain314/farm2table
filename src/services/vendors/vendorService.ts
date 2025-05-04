import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role: string;
  isActive: boolean;
  avatar?: string;
  address?: string;
  documentUrl?: string;
}

export const getVendors = async (): Promise<Vendor[]> => {
  const response = await axiosInstance.get('/vendor');
  return response.data;
};

export const addVendor = async (formData: FormData) => {
  await axiosInstance.post('/vendor', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
