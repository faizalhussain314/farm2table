import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  updateProduct, // Import the updateProduct service
  Product,
  ProductPayload,
} from "../../services/products/productService";
import toast from "react-hot-toast"; // Importing react-hot-toast for showing toasts

// Import the ToggleSwitch component from its new location
import ToggleSwitch from "../components/ToggleSwitch"; // Adjust the path based on your file structure

const BASEURL = import.meta.env.VITE_WEB_URL;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // page‑size selector

  // Fetch products on component mount
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

  // Calculate current products for the page and total pages based on pagination state
  const start = (page - 1) * limit;
  const end = start + limit;
  const currentProducts = products.slice(start, end);
  const totalPages = Math.ceil(products.length / limit);

  // Handler for deleting a product
  const handleDelete = async (productId: string) => {
    const toastId = toast.loading("Deleting product...", {
      duration: 5000,
    });

    try {
      await deleteProduct(productId);
      // Update local state by filtering out the deleted product
      setProducts(products.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully!", {
        id: toastId,
      });
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product. Please try again.", {
        id: toastId,
      });
    }
  };

  // Handler for toggling the Quick Pick status
  const handleQuickPickToggle = async (product: Product) => {
    const newQuickPicksStatus = !product.quickPicks;
  
    const toastId = toast.loading(
      `Updating "${product.name}" Quick Pick status…`
    );
  
    try {
      // ① Build the minimal JSON patch
      const patch: Partial<ProductPayload> = { quickPicks: newQuickPicksStatus };
  
      // ② Call the service
      await updateProduct(product._id, patch);
  
      // ③ Optimistically update local state
      setProducts(prev =>
        prev.map(p =>
          p._id === product._id ? { ...p, quickPicks: newQuickPicksStatus } : p
        )
      );
  
      toast.success(`"${product.name}" Quick Pick status updated!`, {
        id: toastId,
      });
    } catch (err) {
      console.error('Failed to update quick pick status:', err);
  
      // revert UI
      setProducts(prev =>
        prev.map(p =>
          p._id === product._id ? { ...p, quickPicks: product.quickPicks } : p
        )
      );
  
      toast.error(
        `Failed to update "${product.name}" Quick Pick status.`,
        { id: toastId }
      );
    }
  };
  


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          to="/add-product"
          className="bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded-lg flex items-center space-x-2"
        >
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
              <th className="text-left p-4">Quick Picks</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Loading state placeholders */}
            {loading &&
              [...Array(limit)].map((_, idx) => ( // Use 'limit' for number of loading rows
                <tr
                  key={idx}
                  className="border-b border-gray-300 animate-pulse"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-300 rounded-lg" />
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-20 bg-gray-300 rounded" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-12 bg-gray-300 rounded" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-12 bg-gray-300 rounded" />
                  </td>
                  <td className="p-4">
                     {/* Placeholder for toggle */}
                    <div className="h-6 w-11 bg-gray-300 rounded-full" />
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <div className="h-5 w-5 bg-gray-300 rounded" />
                      <div className="h-5 w-5 bg-gray-300 rounded" />
                    </div>
                  </td>
                </tr>
              ))}

            {/* No products found message */}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}

            {/* Render product rows */}
            {!loading &&
              currentProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-700 transition"
                >
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
                  <td className="p-4">
                    {product.stock}
                    {product.unit === "kg" && "/kg"}
                    {product.unit === "nos" && "/nos"}
                    {/* Add other units as needed */}
                  </td>
                  <td className="p-4">
                    {/* Use the ToggleSwitch component */}
                    <ToggleSwitch
                        isChecked={product.quickPicks}
                        onChange={() => handleQuickPickToggle(product)} 
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Link
                         to={`/edit-product/${product._id}`}
                         className="p-2 hover:bg-background rounded-lg text-primary"
                      >
                         <Edit className="h-5 w-5" />
                      </Link>
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
        {totalPages > 1 && (
          <nav className="flex items-center justify-between mt-4 flex-col sm:flex-row gap-4">
            {/* page‑size selector */}
            <div className="flex items-center gap-2 text-sm">
              <span>Rows:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1); // reset to first page when size changes
                }}
                className="border rounded px-2 py-1 bg-white"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
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
                // Show first, last, and pages around the current page
                const show = n === 1 || n === totalPages || Math.abs(n - page) <= 1;
                if (!show) return null; // Don't render if not visible

                return (
                  <li key={n}>
                    <button
                      onClick={() => setPage(n)}
                      className={`px-3 py-1 rounded border text-sm ${
                        n === page ? "bg-primary text-white" : "" // Highlight current page
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
