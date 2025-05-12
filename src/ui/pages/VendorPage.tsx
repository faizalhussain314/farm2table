// src/pages/VendorPage/VendorPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mail, Phone, ArrowLeft, Briefcase, User as UserIcon, FileText, MapPin, Users, ListOrdered, ShoppingCart,
  DollarSign, ChevronLeft, ChevronRight, AlertCircle, Building // Added Building for Vendor Code
} from 'lucide-react';

// Import from your actual vendorService file
import {
  VendorResponse,
  getVendorDetailsById,
  getCustomersForVendor, // Mocked
  getOrdersForVendor     // Mocked
} from '../../services/vendors/vendorService'; // Adjust path as needed

// Import list item types from vendorData or vendorService if re-exported
import { CustomerForVendorList, OrderForVendorList } from '../../services/vendors/vendorData'; // Adjust path

import { formatCurrency } from '../../utils/formatCurrency'; // Assuming this utility exists

interface VendorPageStats {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
}

const VendorPage = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();

  const [vendorDetails, setVendorDetails] = useState<VendorResponse | null>(null);
  const [vendorStats, setVendorStats] = useState<VendorPageStats | null>(null);

  const [customers, setCustomers] = useState<CustomerForVendorList[]>([]);
  const [customerCurrentPage, setCustomerCurrentPage] = useState<number>(1);
  const [customerTotalPages, setCustomerTotalPages] = useState<number>(0);

  const [orders, setOrders] = useState<OrderForVendorList[]>([]);
  const [orderCurrentPage, setOrderCurrentPage] = useState<number>(1);
  const [orderTotalPages, setOrderTotalPages] = useState<number>(0);

  const [loadingVendor, setLoadingVendor] = useState<boolean>(true);
  const [loadingCustomers, setLoadingCustomers] = useState<boolean>(false);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!vendorId) {
        setError('Vendor ID not provided.');
        setLoadingVendor(false);
        return;
      }
      setLoadingVendor(true);
      setError('');
      try {
        const details = await getVendorDetailsById(vendorId);
        setVendorDetails(details);

        // Fetch initial lists and stats (stats are derived from these mock calls)
        await fetchAndSetVendorCustomers(vendorId, 1, details._id); // Pass actual vendorId from response
        await fetchAndSetVendorOrders(vendorId, 1, details._id);

      } catch (err: any) {
        console.error("Error fetching vendor details:", err);
        setError(err.response?.data?.message || err.message || 'Failed to load vendor data.');
        setVendorDetails(null); // Clear previous data on error
      } finally {
        setLoadingVendor(false);
      }
    };
    fetchVendorData();
  }, [vendorId]);


  const fetchAndSetVendorCustomers = async (idFromParams: string, page: number, actualVendorIdForMock: string) => {
    setLoadingCustomers(true);
    try {
      // Use actualVendorIdForMock for mock service key, idFromParams for consistency if needed elsewhere
      const customerData = await getCustomersForVendor(actualVendorIdForMock, page);
      setCustomers(customerData.customers);
      setCustomerCurrentPage(customerData.currentPage);
      setCustomerTotalPages(customerData.totalPages);
      setVendorStats(prevStats => ({
        ...prevStats!,
        totalCustomers: customerData.totalCustomers,
      }));
    } catch (err) {
      console.error("Failed to load customers:", err);
      // Append to error or set specific error for customers
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchAndSetVendorOrders = async (idFromParams: string, page: number, actualVendorIdForMock: string) => {
    setLoadingOrders(true);
    try {
      const orderData = await getOrdersForVendor(actualVendorIdForMock, page);
      setOrders(orderData.orders);
      setOrderCurrentPage(orderData.currentPage);
      setOrderTotalPages(orderData.totalPages);
      setVendorStats(prevStats => ({
        ...prevStats!,
        totalOrders: orderData.totalOrders,
        totalRevenue: orderData.totalRevenue, // This mock function returns totalRevenue
      }));
    } catch (err) {
      console.error("Failed to load orders:", err);
      // Append to error or set specific error for orders
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCustomerPageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= customerTotalPages && vendorDetails?._id) {
      fetchAndSetVendorCustomers(vendorId!, newPage, vendorDetails._id);
    }
  };

  const handleOrderPageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= orderTotalPages && vendorDetails?._id) {
      fetchAndSetVendorOrders(vendorId!, newPage, vendorDetails._id);
    }
  };


  if (loadingVendor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !vendorDetails) {
    return (
      <div className="container mx-auto p-6 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-500 mb-2">Error Loading Vendor</h2>
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!vendorDetails) {
    return <div className="text-center text-gray-500 dark:text-gray-300 mt-8">Vendor not found or ID missing.</div>;
  }

  // Destructure from vendorDetails and vendorDetails.user
  const { user, vendorCode, govtId, rating, status, serviceLocations, } = vendorDetails;

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      {/* Vendor Profile Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-lg shadow-xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="relative z-10 md:flex md:items-center md:space-x-6">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fff&color=3730a3&size=128&font-size=0.33&bold=true`}
            alt={user.name} // Assuming user.name is the main display name (e.g., company name or primary contact)
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-4 border-white/70 shadow-md mb-4 md:mb-0 flex-shrink-0 bg-white"
          />
          <div className="flex-grow">
            <h1 className="text-3xl sm:text-4xl font-bold">{user.name}</h1>
            <p className="text-lg opacity-90 flex items-center mt-1">
                <Building className="w-5 h-5 mr-2 opacity-80" />Vendor Code: {vendorCode}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-sm opacity-90">
              <div className="flex items-center"><Mail className="w-4 h-4 mr-2 opacity-80" />{user.email}</div>
              <div className="flex items-center"><Phone className="w-4 h-4 mr-2 opacity-80" />{user.phoneNumber}</div>
              <div className="flex items-center"><FileText className="w-4 h-4 mr-2 opacity-80" />Govt ID: {govtId}</div>
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 opacity-80" />{user.address}</div>
            </div>
            <div className="mt-3 text-sm opacity-90">
                <p>Joined: <span className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</span></p>
                <p>Status: <span className={`font-semibold ${status === 'active' ? 'text-green-300' : 'text-red-300'}`}>{status}</span></p>
                {/* <p>Rating: <span className="font-semibold">{rating}/5</span></p> */}
                {serviceLocations && serviceLocations.length > 0 && (
                    <p>Service Locations: <span className="font-semibold">{serviceLocations.join(', ')}</span></p>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      {vendorStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-secondary rounded-lg shadow p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300"> <Users className="w-6 h-6" /> </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{vendorStats.totalCustomers}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-secondary rounded-lg shadow p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"> <ShoppingCart className="w-6 h-6" /> </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{vendorStats.totalOrders}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-secondary rounded-lg shadow p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"> <DollarSign className="w-6 h-6" /> </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Sales Revenue</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(vendorStats.totalRevenue, 'INR')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Customer List Table */}
      <div className="bg-white dark:bg-secondary rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Vendor's Customers</h2>
        {loadingCustomers && customers.length === 0 && <div className="text-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto"></div></div>}
        {!loadingCustomers && customers.length === 0 && <div className="text-center text-gray-500 dark:text-gray-400 py-4">No customers found for this vendor.</div>}
        {customers.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {/* Table Head */}
                <thead className="bg-gray-50 dark:bg-secondary-light">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Phone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">City</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Total Spent</th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody className="bg-white dark:bg-secondary divide-y divide-gray-200 dark:divide-gray-700">
                  {customers.map((cust) => (
                    <tr key={cust.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{cust.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{cust.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{cust.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{cust.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(cust.totalSpentWithVendor, 'INR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Customer Pagination */}
            {customerTotalPages > 1 && (
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <button onClick={() => handleCustomerPageChange(customerCurrentPage - 1)} disabled={customerCurrentPage <= 1 || loadingCustomers} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:cursor-not-allowed"> <ChevronLeft className="w-5 h-5 inline mr-1" /> Previous </button>
                <span className="text-sm text-gray-700 dark:text-gray-400"> Page {customerCurrentPage} of {customerTotalPages} </span>
                <button onClick={() => handleCustomerPageChange(customerCurrentPage + 1)} disabled={customerCurrentPage >= customerTotalPages || loadingCustomers} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:cursor-not-allowed"> Next <ChevronRight className="w-5 h-5 inline ml-1" /> </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order List Table */}
      <div className="bg-white dark:bg-secondary rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Order History (from this Vendor)</h2>
        {loadingOrders && orders.length === 0 && <div className="text-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto"></div></div>}
        {!loadingOrders && orders.length === 0 && <div className="text-center text-gray-500 dark:text-gray-400 py-4">No orders found for this vendor.</div>}
        {orders.length > 0 && (
           <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {/* Table Head */}
                <thead className="bg-gray-50 dark:bg-secondary-light">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Order ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Items</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Total</th>
                  </tr>
                </thead>
                 {/* Table Body */}
                <tbody className="bg-white dark:bg-secondary divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{order.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            order.status === 'Pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' // Cancelled
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{order.itemCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(order.totalAmount, 'INR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             {/* Order Pagination */}
            {orderTotalPages > 1 && (
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <button onClick={() => handleOrderPageChange(orderCurrentPage - 1)} disabled={orderCurrentPage <= 1 || loadingOrders} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:cursor-not-allowed"> <ChevronLeft className="w-5 h-5 inline mr-1" /> Previous</button>
                <span className="text-sm text-gray-700 dark:text-gray-400"> Page {orderCurrentPage} of {orderTotalPages} </span>
                <button onClick={() => handleOrderPageChange(orderCurrentPage + 1)} disabled={orderCurrentPage >= orderTotalPages || loadingOrders} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:cursor-not-allowed"> Next <ChevronRight className="w-5 h-5 inline ml-1" /> </button>
              </div>
            )}
          </>
        )}
      </div>
      {error && <div className="text-center text-red-500 mt-4 p-4 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-md">{error}</div>}
    </div>
  );
};

export default VendorPage;