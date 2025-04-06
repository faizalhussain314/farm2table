import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import {
  updateCategory,
  Category,
} from "../../services/categories/categoryService";

interface Props {
  onClose: () => void;
  category: Category;
  onUpdated: () => void;
}

const BASEURL = import.meta.env.VITE_WEB_URL;

const EditCategoryModal = ({ onClose, category, onUpdated }: Props) => {
  const [name, setName] = useState(category.name);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    `${BASEURL}${category.image}`
  );
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(`${BASEURL}${category.image}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("image", image);
    }

    try {
      setSubmitting(true);
      await updateCategory(category.id, formData);
      toast.success("Category updated successfully");
      onClose();
      onUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-secondary p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700">
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Category Name</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-background"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              className="block w-full text-sm"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 h-24 w-24 object-cover rounded border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded transition">
            {submitting ? "Updating..." : "Update Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
