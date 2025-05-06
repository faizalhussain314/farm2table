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

type VendorLocation = {
  lng: number;
  lat: number;
};

type VendorServiceLocation = string; // or replace with the appropriate type if you have more details on serviceLocations

type VendorPayload = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  govtId: string; // Assuming the govtId is a string format
  address: string;
  longitude: string;
  latitude: string;
  vendorCode: string;
  serviceLocations: VendorServiceLocation[]; // Array of service locations, adjust if more detailed type required
};


export const getVendors = async (): Promise<Vendor[]> => {
  const response = await axiosInstance.get('/vendor');
  return response.data;
};

export const addVendor = async (formData: VendorPayload) => {
  await axiosInstance.post('/vendor', formData,);
};
