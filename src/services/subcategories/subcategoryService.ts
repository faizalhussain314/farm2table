import axiosInstance from "../../utils/axiosInstance";

export interface Subcategory {
  id: string;
  name: string;
  category: string;
  image: string;
  isActive: boolean;
}

// ✅ 1. Get all subcategories
export const getSubcategories = async (): Promise<Subcategory[]> => {
  const res = await axiosInstance.get('/subcategories');
  return res.data;
};

// ✅ 2. Get subcategory by ID
export const getSubcategoryById = async (id: string): Promise<Subcategory> => {
  const res = await axiosInstance.get(`/subcategories/${id}`);
  return res.data;
};

// ✅ 3. Create subcategory
export const addSubcategory = async (formData: FormData): Promise<void> => {
  await axiosInstance.post('/subcategories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// ✅ 4. Update subcategory by ID
export const updateSubcategory = async (
  id: string,
  formData: FormData
): Promise<void> => {
  await axiosInstance.patch(`/subcategories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// ✅ 5. Delete subcategory
export const deleteSubcategory = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/subcategories/${id}`);
};

// ✅ 6. Change status (active/inactive)
export const changeSubcategoryStatus = async (
  id: string,
  isActive: boolean
): Promise<void> => {
  await axiosInstance.patch(`/subcategories/${id}/status`, { isActive });
};
