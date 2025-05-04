import React, { useState, useEffect, useRef } from "react";
import { Image, X } from "lucide-react";
import {
  updateSubcategory,
  Subcategory,
} from "../../services/subcategories/subcategoryService";
import {
  getCategories,
  Category,
} from "../../services/categories/categoryService";
import toast from "react-hot-toast";

type Props = {
  subcategory: Subcategory;
  onClose: () => void;
  onUpdated: () => void;
};

// const BASEURL = import.meta.env.VITE_WEB_URL;

const EditSubcategoryModal = ({ subcategory, onClose, onUpdated }: Props) => {
  const [name, setName] = useState(subcategory.name);
  const [category, setCategory] = useState(subcategory.category); // should be category ID
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    subcategory.image ? `${subcategory.image}` : null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const extractFileName = (url: string) => url.split("/").pop() ?? "image.jpg";

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load categories");
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    setName(subcategory.name);
    setCategory(subcategory.category);
    setPreviewUrl(subcategory.image ? `${subcategory.image}` : null);
    setImage(null);
  }, [subcategory]);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(`${subcategory.image}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category) {
      toast.error("Name and category are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      setSubmitting(true);
      await updateSubcategory(subcategory._id, formData);
      toast.success("Subcategory updated");
      onClose();
      onUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update subcategory");
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
        <h2 className="text-xl font-semibold mb-4">Edit Subcategory</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-background"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loadingCategories}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-background"
              required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {loadingCategories && (
              <p className="text-sm text-gray-400 mt-1">
                Loading categories...
              </p>
            )}
          </div>

          {/*──────── Replace Image block ────────*/}
          <div>
            <label className="block text-sm mb-1">Image </label>

            {/* hidden real input */}
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              className="hidden"
            />

            {/* visible trigger */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2 w-52 border border-gray-300 dark:border-gray-600 rounded text-gray-600 flex items-center gap-2">
              <span className="flex-1 text-left truncate">
                {image
                  ? image.name /* newly chosen file */
                  : previewUrl
                  ? extractFileName(previewUrl) /* backend image */
                  : "Choose image…"}
              </span>
              <Image />
            </button>

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
            {submitting ? "Updating..." : "Update Subcategory"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSubcategoryModal;
