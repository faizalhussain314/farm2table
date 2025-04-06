import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getCategories, Category } from '../../services/categories/categoryService';
import { addSubcategory } from '../../services/subcategories/subcategoryService';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onAdded: () => void;
}

const AddSubcategoryModal = ({ onClose, onAdded }: Props) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load categories');
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category || !image) {
      toast.error('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('image', image);

    try {
      setSubmitting(true);
      await addSubcategory(formData);
      toast.success('Subcategory added!');
      onClose();
      onAdded();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add subcategory');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-secondary p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Subcategory</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Subcategory Name</label>
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
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {loadingCategories && <p className="text-sm text-gray-400 mt-1">Loading categories...</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              required
              className="block w-full text-sm file:bg-primary file:text-white file:rounded file:px-4 file:py-2"
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
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded"
          >
            {submitting ? 'Adding...' : 'Add Subcategory'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubcategoryModal;
