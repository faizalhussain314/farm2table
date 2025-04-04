import  { useEffect, useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { getCategories, Category } from '../../services/categories/categoryService';
import AddCategoryModal from '../components/AddCategoryModal';


const BASEURL = import.meta.env.VITE_WEB_URL;

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load categories.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Category</span>
        </button>
      </div>

      {showModal && <AddCategoryModal onClose={() => setShowModal(false)} />}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden ">
        <table className="w-full border-gray-800 border-b">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-200">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Active</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-300  animate-pulse">
                  <td className="p-4">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 rounded" />
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded" />
                      <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded" />
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}

            {!loading &&
              categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-700">
                  <td className="p-4">{category.name}</td>
                  <td className="p-4">
                    <img
                     
                      src={`${BASEURL}${category.image}`}
                      alt={category.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  </td>
                  <td className="p-4">{category.isActive ? 'Yes' : 'No'}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-background rounded-lg text-primary">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="p-2 hover:bg-background rounded-lg text-red-500">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default Categories;
