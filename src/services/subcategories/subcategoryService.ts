import axiosInstance from "../../utils/axiosInstance";

export interface Subcategory {
  _id: string;
  name: string;
  category: string;
  image: string;
  isActive: boolean;
}

export interface SubcategoryDetail {
  _id: string; // Or _id, depending on your backend
  name: string;
  category: string; // Assuming this is the parent category name
  image: string; // Assuming this is the image path relative to BASE_URL
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Add any other fields present in your API response
}

export const getSubcategories = async (): Promise<Subcategory[]> => {
  const res = await axiosInstance.get("/subcategories");
  return res.data.results;
};

export const getSubcategoryById = async (id: string): Promise<Subcategory> => {
  const res = await axiosInstance.get(`/subcategories/${id}`);
  return res.data;
};

export const addSubcategory = async (formData: FormData): Promise<void> => {
  await axiosInstance.post("/subcategories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateSubcategory = async (
  id: string,
  formData: FormData
): Promise<void> => {
  await axiosInstance.patch(`/subcategories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
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

export const getSubcategoriesByCategoryName = async (
  categoryName: string
): Promise<SubcategoryDetail[]> => {
  try {
    const response = await axiosInstance.get(`/subcategories`, {
      params: { category: categoryName },
    });
    return response.data.results;
  } catch (error) {
    console.error(
      `Error fetching subcategories for category "${categoryName}":`,
      error
    );

    throw new Error(
      `Failed to fetch subcategories: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
