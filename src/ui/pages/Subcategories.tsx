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



const Subcategories = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  /* paging */
const [page, setPage]   = useState(1);
const [limit, setLimit] = useState(10);        // rows per page selector

/* compute the slice to show */
const start = (page - 1) * limit;
const end   = start + limit;
const currentSubs = subcategories.slice(start, end);

const totalPages = Math.ceil(subcategories.length / limit);

/* whenever the list changes (add / delete / edit), reset to page 1 */
useEffect(() => setPage(1), [subcategories]);


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
      setSubcategories(prev => prev.filter(sub => sub._id !== id));
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
              currentSubs.map((sub) => (
                <tr key={sub._id} className="border-b border-gray-700">
                  <td className="p-4">{sub.name}</td>
                  <td className="p-4">{sub.name}</td>
                  <td className="p-4">
                    <img
                      src={`${sub.image}`}
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
                      onClick={() => { void handleDelete(sub._id); }}
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
      
      {/*── Pager (hidden when only one page) ──*/}
{totalPages > 1 && (
  <nav className="flex items-center justify-between mt-4 flex-col sm:flex-row gap-4">
    {/* rows‑per‑page selector */}
    <div className="flex items-center gap-2 text-sm">
      <span>Rows:</span>
      <select
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);                 // reset page when size changes
        }}
        className="border rounded px-2 py-1 bg-white"
      >
        {[10, 20, 50].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>

    {/* numbered pager */}
    <ul className="inline-flex items-center gap-1">
      {/* prev */}
      <li>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded border text-sm disabled:opacity-40"
        >
          «
        </button>
      </li>

      {/* first, current±1, last */}
      {Array.from({ length: totalPages }).map((_, i) => {
        const n = i + 1;
        const show = n === 1 || n === totalPages || Math.abs(n - page) <= 1;
        if (!show) return null;
        return (
          <li key={n}>
            <button
              onClick={() => setPage(n)}
              className={`px-3 py-1 rounded border text-sm ${
                n === page ? "bg-primary text-white" : ""
              }`}
            >
              {n}
            </button>
          </li>
        );
      })}

      {/* next */}
      <li>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded border text-sm disabled:opacity-40"
        >
          »
        </button>
      </li>
    </ul>
  </nav>
)}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Subcategories;
