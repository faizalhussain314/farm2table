import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import {
  getCategories,
  Category,
  deleteCategory,
} from "../../services/categories/categoryService";
import AddCategoryModal from "../components/AddCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import toast from "react-hot-toast";


const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  /* paging */
const [page, setPage]   = useState(1);
const [limit, setLimit] = useState(10);          // rows per page selector

/* slice the categories list for the current page */
const start = (page - 1) * limit;
const end   = start + limit;
const currentCats = categories.slice(start, end);

const totalPages = Math.ceil(categories.length / limit);

useEffect(() => setPage(1), [categories]);


  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories.");
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
          className="bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded-lg flex items-center space-x-2">
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
              currentCats.map((category) => (
                <tr key={category._id} className="border-b border-gray-700">
                  <td className="p-4">{category.name}</td>
                  <td className="p-4">
                    <img
                      src={`${category.image}`}
                      alt={category.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  </td>
                  <td className="p-4">{category.isActive ? "Yes" : "No"}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-2 hover:bg-background rounded-lg text-primary">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="p-2 hover:bg-background rounded-lg text-red-500">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {editingCategory && (
              <EditCategoryModal
                category={editingCategory}
                onClose={() => setEditingCategory(null)}
                onUpdated={async () => {
                  setEditingCategory(null);
                  const updated = await getCategories();
                  setCategories(updated);
                }}
              />
            )}
          </tbody>
        </table>
        {/*── Pager — hidden when only one page ──*/}


      </div>
      {totalPages > 1 && (
  <nav className="flex items-center justify-between mt-4 flex-col sm:flex-row gap-4">
    {/* rows selector */}
    <div className="flex items-center gap-2 text-sm bg-white">
      <span>Rows:</span>
      <select
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);              // reset when page‑size changes
        }}
        className="border rounded px-2 py-1 bg-white"
      >
        {[10, 20, 50].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>

    {/* page numbers */}
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
        const visible = n === 1 || n === totalPages || Math.abs(n - page) <= 1;
        if (!visible) return null;
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
      {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
    </div>
  );
};

export default Categories;
