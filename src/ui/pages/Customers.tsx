import  { useEffect, useState } from 'react';
import { Mail, Phone, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCustomers, Customer } from '../../services/customers/customerService';
import CustomerDetailsModal from '../components/CustomerDetailsModal';

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  /* paging */
const [page, setPage]   = useState(1);
const [limit, setLimit] = useState(10);          // cards per page selector

/* derive the slice to render */
const start = (page - 1) * limit;
const end   = start + limit;
const currentCustomers = customers.slice(start, end);

const totalPages = Math.ceil(customers.length / limit);

/* when list changes (e.g., after add), reset to page 1 if needed */
useEffect(() => setPage(1), [customers]);


  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load customers.');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Link
          to="/add-customer"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Customer</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading &&
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-secondary rounded-lg p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}

        {!loading && customers.length === 0 && (
          <div className="text-center text-gray-500 col-span-full">No customers found.</div>
        )}

        {!loading &&
          currentCustomers.map((customer) => (
            <div key={customer.id} className="bg-white dark:bg-secondary rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    customer.avatar ||
                    'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(customer.name) +
                      '&background=random'
                  }
                  alt={customer.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{customer.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {customer.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {customer.phoneNumber}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                  <p className="text-lg font-semibold capitalize">vendorname-id</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vendor</p>
                    <p
                      className={`text-lg font-semibold ${
                        customer.isActive ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <button
                    className="text-primary hover:text-primary-dark"
                    onClick={() => setSelectedCustomer(customer)}
                    title="View details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
{/*── Pager (hidden if only one page) ──*/}
{totalPages > 1 && (
  <nav className="flex items-center justify-between mt-6 flex-col sm:flex-row gap-4">
    {/* rows selector */}
    <div className="flex items-center gap-2 text-sm">
      <span>Rows:</span>
      <select
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);                   // reset to first when size changes
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

      {/* 👇 Modal Component */}
      <CustomerDetailsModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
    </div>
  );
};

export default Customers;
