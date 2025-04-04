import  { useEffect, useState } from "react";
import { getOrders, Order } from "../../services/orders/orderService";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data?.results || []); // ✅ safe fallback if results is undefined
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders.");
        setOrders([]); // ✅ also fallback to empty array on error
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
      default:
        return "bg-gray-500/20 text-gray-500";
    }
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
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {(loading) &&   <tr>  <td colSpan={6} className="p-4 text-center text-gray-500"> <div className="flex justify-center items-center"><div>Loading orders...</div></div> </td> </tr>}
            {orders.length === 0 ? (
              <tr className={loading ? "hidden" : ""}>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700">
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.customer}</td>
                  <td className="p-4">{order.product}</td>
                  <td className="p-4">{order.date}</td>
                  <td className="p-4">${order.total}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block rounded-lg px-3 py-1 text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default Orders;
