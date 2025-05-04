import axiosInstance from '../../utils/axiosInstance';

export interface Category {
  _id: string;
  name: string;
  image: string;
  isActive: boolean;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>('/categories');
  return response.data;
};

export const addCategory = async (formData: FormData): Promise<void> => {
  await axiosInstance.post('/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateCategory = async (id: string, formData: FormData): Promise<void> => {
  await axiosInstance.put(`/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteCategory = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};
