// services/dashboardService.ts
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

// Define the type for the API response
export interface DashboardSummary {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
}

const API_URL = '/admin/dashboard-summary'; 

// Function to fetch dashboard data
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const response = await axiosInstance.get<DashboardSummary>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary data', error);
    throw error;
  }
};
