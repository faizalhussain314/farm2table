import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, ShoppingCart, DollarSign, ArrowLeft } from 'lucide-react';
import { getCustomerById, Customer } from '../../services/customers/customerService'; // Assuming getCustomerById exists
import { getCustomerOrders, Order } from '../../services/orders/orderService'; // Assuming getCustomerOrders and Order type exist
import { formatCurrency } from '../../utils/formatCurrency'; // Assuming a currency formatter utility

// Define a simple Order type if you don't have one yet
// interface Order {
//   id: string;
//   date: string; // Or Date type
//   status: string;
//   totalAmount: number;
//   // Add other relevant order properties
// }

const CustomerPage = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) {
        setError('Customer ID not provided.');
        setLoading(false);
        return;
      }

      try {
        // Fetch customer details
        const customerData = await getCustomerById(customerId); // Implement this service function
        setCustomer(customerData);

        // Fetch customer's orders
        const ordersData = await getCustomerOrders(customerId); // Implement this service function
        setOrders(ordersData || []);

      } catch (err) {
        console.error(err);
        setError('Failed to load customer data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]); // Refetch if customerId changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  if (!customer) {
    return <div className="text-center text-gray-500 mt-8">Customer not found.</div>;
  }

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Customers
      </button>

      {/* Profile Section (Full Width Banner/Card) */}
      <div className="bg-violet-600 dark:from-secondary-dark dark:to-secondary rounded-lg shadow-lg p-8 text-white relative overflow-hidden">
         {/* Background pattern or image can be added here for more flair */}
         {/* Example: <img src="/path/to/pattern.png" alt="background pattern" className="absolute inset-0 w-full h-full object-cover opacity-10" /> */}

        <div className="relative z-10 flex items-center space-x-6">
          <img
            src={
             
              'https://ui-avatars.com/api/?name=' +
              encodeURIComponent(customer.name) +
              '&background=random&color=fff&size=128' // White text for dark background
            }
            alt={customer.name}
            className="h-24 w-24 rounded-full object-cover border-4 border-white/50 shadow-md"
          />
          <div>
            <h1 className="text-4xl font-bold">{customer.name}</h1>
            <div className="flex items-center space-x-6 mt-2 text-lg opacity-90">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>{customer.phoneNumber}</span>
              </div>
            </div>
             <div className="mt-3 text-lg opacity-90">
                 <p className="capitalize">Vendor: <span className="font-semibold">{customer.role || 'N/A'} -vendor001</span></p> {/* Assuming customer has a role */}
                 <p>Status: <span className={`font-semibold ${customer.isActive ? 'text-green-300' : 'text-red-300'}`}>{customer.isActive ? 'Active' : 'Inactive'}</span></p>
             </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-secondary rounded-lg shadow p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-secondary rounded-lg shadow p-6 flex items-center space-x-4">
        <div className="p-3 px-5 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 text-xl font-bold flex items-center justify-center">
             ₹ {/* INR symbol */}
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white"> {formatCurrency(totalRevenue, 'INR')}</p> {/* Use a currency formatter */}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white dark:bg-secondary rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Order History</h2>
        {orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders found for this customer.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-secondary-light">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Total Amount
                  </th>
                  {/* Add more table headers for other order details */}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                       {new Date(order.date).toLocaleDateString()} {/* Format date */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                           order.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                           order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                           'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                       }`}>
                           {order.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(order.totalAmount, 'INR')}{/* Use currency formatter */}
                    </td>
                    {/* Add more table data cells */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;