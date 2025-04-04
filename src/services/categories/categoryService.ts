import axiosInstance from '../../utils/axiosInstance';

export interface Category {
  id: string;
  name: string;
  image: string;
  isActive: boolean;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>('/categories');
  console.log("Fetched categories:", response.data);
  return response.data;
};

export const addCategory = async (formData: FormData): Promise<void> => {
  await axiosInstance.post('/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
