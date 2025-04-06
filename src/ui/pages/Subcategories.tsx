import { useEffect, useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import {
  getSubcategories,
  deleteSubcategory,
  Subcategory,
} from '../../services/subcategories/subcategoryService';
import AddSubcategoryModal from '../components/AddSubcategoryModal';
import EditSubcategoryModal from '../components/EditSubcategoryModal';
import toast from 'react-hot-toast';

const BASEURL = import.meta.env.VITE_WEB_URL;

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);

  const fetchSubcategories = async () => {
    try {
      const data = await getSubcategories();
      setSubcategories(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load subcategories.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubcategory(id);
      toast.success('Subcategory deleted');
      setSubcategories(prev => prev.filter(sub => sub.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete subcategory');
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Subcategories</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Subcategory</span>
        </button>
      </div>

      {showModal && (
        <AddSubcategoryModal
          onClose={() => setShowModal(false)}
          onAdded={fetchSubcategories}
        />
      )}

      {editingSubcategory && (
        <EditSubcategoryModal
          subcategory={editingSubcategory}
          onClose={() => setEditingSubcategory(null)}
          onUpdated={fetchSubcategories}
        />
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="w-full border-gray-800 border-b">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-200">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-300 animate-pulse">
                  <td className="p-4"><div className="h-4 w-24 bg-gray-300 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-24 bg-gray-300 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-12 bg-gray-300 rounded" /></td>
                  <td className="p-4 flex space-x-2"><div className="h-5 w-5 bg-gray-300 rounded" /></td>
                </tr>
              ))}

            {!loading && subcategories.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">No subcategories found.</td>
              </tr>
            )}

            {!loading &&
              subcategories.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-700">
                  <td className="p-4">{sub.name}</td>
                  <td className="p-4">{sub.name}</td>
                  <td className="p-4">
                    <img
                      src={`${BASEURL}${sub.image}`}
                      alt={sub.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  </td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => setEditingSubcategory(sub)}
                      className="text-primary hover:text-primary-dark"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => { void handleDelete(sub.id); }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Subcategories;
