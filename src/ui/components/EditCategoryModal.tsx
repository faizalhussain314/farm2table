import { useState, useEffect, useRef } from "react";
import { Image, X } from "lucide-react";
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

const EditCategoryModal = ({ onClose, category, onUpdated }: Props) => {
  const [name, setName] = useState(category.name);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    `${category.image}`
  );
  const [fileLabel, setFileLabel] = useState(`${category.image}`);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractFileName = (url: string) => url.split("/").pop() ?? "image.jpg";

  const handleImageChange = (file: File | null) => {
    setImage(file);
    setFileLabel(file ? file.name : "No file chosen");
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(`${category.image}`);
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
      await updateCategory(category._id, formData);
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

          {/* ───────── Image picker block (replace old <div> that held the file input) ───────── */}
          <div>
            <label className="block text-sm mb-1">Image </label>

            {/* hidden file input */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              ref={inputRef} // need a ref
              className="hidden"
            />

            {/* visible trigger */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2 w-52 border border-gray-300 dark:border-gray-600 rounded text-gray-600 flex items-center gap-2">
              <span className="flex-1 text-left truncate">
                {image
                  ? image.name // new file chosen
                  : previewUrl
                  ? extractFileName(previewUrl) // existing backend image
                  : "Choose image…"}
              </span>
              <Image />
            </button>

            {/* preview */}
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
