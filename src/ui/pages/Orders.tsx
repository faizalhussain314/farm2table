import { useEffect, useState } from "react";
import { getOrders, OrderResponse } from "../../services/orders/orderService";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";


interface Product {
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  unit: string;
  stock: number;
  active: boolean;
  description?: string;
  image: string;
  id: string;
}

interface Item {
  productId: Product;
  quantity: number;
  _id: string;
}

interface Customer {
  isActive: boolean;
  isVeg: boolean;
  email: string;
  name: string;
  phoneNumber: string;
  role: string;
  id: string;
}

interface DetailedOrder {
  _id: string;
  customer: Customer;
  items: Item[];
  totalPrice: number;
  orderId:string;
  status: string;
  order_id:string;
  date:string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SimplifiedOrder {
  id: string;
  customer: string;
  product: string;
  date: string;
  total: number;
  status: string;
  orderId:string;
}

const Orders = () => {
  const [orders, setOrders] = useState<SimplifiedOrder[]>([]);
  const [detailedOrder, setDetailedOrder] = useState<DetailedOrder | null>(
    null
  );
  const [page, setPage]   = useState(1);
const [limit, setLimit] = useState(10);
const [allOrders, setAllOrders] = useState<SimplifiedOrder[]>([]);// what the table shows
const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
    
        const data = await getOrders();  // API call to get the orders
        const detailed = data as unknown as DetailedOrder[];
  
        if (!detailed || detailed.length === 0) {
          setError("No orders found");
          return;
        }
  
        const simplified: SimplifiedOrder[] = detailed.map((o) => ({
          id: o._id,
          customer: o.customer?.name ?? "Unknown",
          product: (o.items && o.items.length > 0) ? o.items.map((it) => it.productId?.name).join(", ") : "No products",
          date: o.date,
          total: o.totalPrice,
          orderId:o.orderId,
          status: o.status[0].toUpperCase() + o.status.slice(1),
        }));
        
        setAllOrders(simplified);
  
        setTotalPages(Math.ceil(simplified.length / limit));
        setPage(1);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
              // ← fetch only once

  useEffect(() => {
    const start = (page - 1) * limit;
    const end   = start + limit;
  
    setOrders(allOrders.slice(start, end));
    setTotalPages(Math.ceil(allOrders.length / limit));
  }, [page, limit, allOrders]);
  
  

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "placed":
        return "bg-blue-500/20 text-blue-500"; // Indicates initiation
      case "packing":
        return "bg-indigo-500/20 text-indigo-500"; // Active preparation
      case "ready":
        return "bg-teal-500/20 text-teal-500"; // Prepared for next step
      case "dispatch":
        return "bg-orange-500/20 text-orange-500"; // In transit
      case "delivered":
        return "bg-green-500/20 text-green-500"; // Successful completion
      default:
        return "bg-gray-500/20 text-gray-500"; // Unknown or default state
    }
  };

  const openModal = async (orderId: string ) => {
    try {
      const data = await getOrders();
      const detailed = data as unknown as DetailedOrder[];
      const selectedOrder = detailed.find(
        (order: DetailedOrder) => order._id === orderId
      );
      if (selectedOrder) {
        setDetailedOrder(selectedOrder); // Set detailed order correctly
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch order details.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDetailedOrder(null);
  };

 const handleOrderClick = (orderId:string) =>{
  navigate(`/edit-order/${orderId}`);
 }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4">Order ID</th>
              <th className="text-left p-4">Customer</th>
              {/* <th className="text-left p-4">Product</th> */}
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Vendor</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  <div className="flex justify-center items-center">
                    <div>Loading orders...</div>
                  </div>
                </td>
              </tr>
            )}
            {orders.length === 0 ? (
              <tr className={loading ? "hidden" : ""}>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700">
                  <td className="p-4 underline cursor-pointer" onClick={()=>handleOrderClick(order.id)}>{order.orderId}</td>
                  <td className="p-4">{order.customer}</td>
                  {/* <td className="p-4">{order.product}</td> */}
                  <td className="p-4">{order.date}</td>
                  <td className="p-4">Vendor name here</td>
                  <td className="p-4">
                    <span
                      className={`inline-block rounded-lg px-3 py-1 text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                  ₹{order.total/1000}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
  <nav className="flex items-center justify-between p-4">
    <div className="flex items-center gap-2 text-sm">
      <span>Rows:</span>
      <select
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);              // reset page because totalPages changed
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

    <ul className="inline-flex items-center gap-1">
      <li>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded border text-sm disabled:opacity-40"
        >
          «
        </button>
      </li>

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

      {/* Modal for detailed order view */}
      {isModalOpen && detailedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold underline" >
                Order Details - {detailedOrder._id}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Customer Information</h3>
                <p>Name: {detailedOrder.customer.name}</p>
                <p>Email: {detailedOrder.customer.email}</p>
                <p>Phone: {detailedOrder.customer.phoneNumber}</p>
                <p>Role: {detailedOrder.customer.role}</p>
                <p>
                  Active Status:{" "}
                  {detailedOrder.customer.isActive ? "Active" : "Deactivated"}
                </p>
                <p>Vegetarian: {detailedOrder.customer.isVeg ? "Yes" : "No"}</p>
              </div>
              <div>
                <h3 className="font-medium">Order Items</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Product</th>
                      <th className="text-left py-2">Category</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">Quantity</th>
                      <th className="text-left py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      detailedOrder.items.filter((item) => item.productId) || []
                    ).map((item) => {
                      const product = item.productId;
                      const total = product.price * item.quantity;

                      return (
                        <tr key={item._id} className="border-b border-gray-200">
                          <td className="py-2">{product.name}</td>
                          <td className="py-2">{product.category}</td>
                          <td className="py-2">₹{product.price.toFixed(2)}</td>
                          <td className="py-2">{item.quantity}</td>
                          <td className="py-2">₹{total.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="font-medium">Order Summary</h3>
                <p>Total Price: ₹{detailedOrder.totalPrice.toFixed(2)}</p>
                <p>Status: {detailedOrder.status}</p>
                <p>
                  Created: {new Date(detailedOrder.createdAt).toLocaleString()}
                </p>
                <p>
                  Updated: {new Date(detailedOrder.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
