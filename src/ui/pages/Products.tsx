import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  Product,
} from "../../services/products/productService";
import toast from "react-hot-toast"; // Importing react-hot-toast for showing toasts

const BASEURL = import.meta.env.VITE_WEB_URL;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(5);

  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.results || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get current products for the page
  /* paging state */
const [page, setPage]   = useState(1);
const [limit, setLimit] = useState(10);          // page‑size selector

/* slice products whenever page or limit changes */
const start = (page - 1) * limit;
const end   = start + limit;
const currentProducts = products.slice(start, end);

const totalPages = Math.ceil(products.length / limit);


  // Change page


  // Calculate total pages
  // const totalPages = Math.ceil(products.length / productsPerPage);

  const handleDelete = async (productId: string) => {
    const toastId = toast.loading("Deleting product...", {
      duration: 5000,
    });

    try {
      await deleteProduct(productId);
      setProducts(products.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully!", {
        id: toastId,
      });
    } catch (error) {
      toast.error("Failed to delete product. Please try again.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          to="/add-product"
          className="bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="w-full ">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-200">
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              [...Array(5)].map((_, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-300 animate-pulse">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-300  rounded-lg" />
                      <div className="h-4 w-24 bg-gray-300  rounded" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-20 bg-gray-300  rounded" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-12 bg-gray-300  rounded" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-12 bg-gray-300  rounded" />
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <div className="h-5 w-5 bg-gray-300  rounded" />
                      <div className="h-5 w-5 bg-gray-300  rounded" />
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}

            {!loading &&
              currentProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-700 transition">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`${product.image}`}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">₹{product.price}</td>
                  <td className="p-4">{product.stock}/kg</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-background rounded-lg text-primary">
                        <Link
                          to={`/edit-product/${product._id}`}
                          className="p-2 hover:bg-background rounded-lg text-primary">
                          <Edit className="h-5 w-5" />
                        </Link>
                      </button>
                      <button
                        className="p-2 hover:bg-background rounded-lg text-red-500"
                        onClick={() => handleDelete(product._id)} // Call handleDelete when clicked
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="">
       {/* ───── Pager ───── */}
{totalPages > 1  && (
  <nav className="flex items-center justify-between mt-4 flex-col sm:flex-row gap-4">
    {/* page‑size selector */}
    <div className="flex items-center gap-2 text-sm">
      <span>Rows:</span>
      <select
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);           // reset to first page when size changes
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

      {/* page numbers (first, last, current ±1) */}
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

      </div>
    </div>
  );
};

export default Products;
