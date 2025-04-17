import { useEffect, useState } from "react";
import { getOrders } from "../../services/orders/orderService";
import { EyeIcon } from "@heroicons/react/24/outline";

// Define the detailed order interface based on the provided API response
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
  status: string;
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
}

const Orders = () => {
  const [orders, setOrders] = useState<SimplifiedOrder[]>([]);
  const [detailedOrder, setDetailedOrder] = useState<DetailedOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data  = await getOrders();
        
        // Map the API response into SimplifiedOrder format
        const transformedOrders: SimplifiedOrder[] = data.map((order: DetailedOrder) => ({
          id: order._id,
          customer: order.customer.name,
          product: order.items.map((item) => item.productId.name).join(", "),  // Join product names
          date: new Date(order.createdAt).toLocaleDateString(),
          total: order.totalPrice,  // Ensure the totalPrice is correct
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),  // Capitalize status
        }));

        setOrders(transformedOrders);  // Set the transformed data
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError("Failed to fetch orders.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-500";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "cancelled":
        return "bg-red-500/20 text-red-500";
      case "placed":
        return "bg-blue-500/20 text-blue-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const openModal = async (orderId: string) => {
    try {
      const data = await getOrders();
      const selectedOrder = data.find((order: DetailedOrder) => order._id === orderId);
      if (selectedOrder) {
        setDetailedOrder(selectedOrder);  // Set detailed order correctly
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
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Action</th>
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
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.customer}</td>
                  {/* <td className="p-4">{order.product}</td> */}
                  <td className="p-4">{order.date}</td>
                  <td className="p-4">₹{order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block rounded-lg px-3 py-1 text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => openModal(order.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for detailed order view */}
      {isModalOpen && detailedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Details - {detailedOrder._id}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
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
                <p>Active Status: {detailedOrder.customer.isActive ? "Active" : "Deactivated"}</p>
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
                    {detailedOrder.items.map((item) => (
                      <tr key={item._id} className="border-b border-gray-200">
                        <td className="py-2">{item.productId.name}</td>
                        <td className="py-2">{item.productId.category}</td>
                        <td className="py-2">${item.productId.price.toFixed(2)}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">${(item.productId.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="font-medium">Order Summary</h3>
                <p>Total Price: ${detailedOrder.totalPrice.toFixed(2)}</p>
                <p>Status: {detailedOrder.status}</p>
                <p>Created: {new Date(detailedOrder.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(detailedOrder.updatedAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
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
