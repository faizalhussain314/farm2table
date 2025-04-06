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
          customers.map((customer) => (
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
                  <p className="text-lg font-semibold capitalize">{customer.role}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
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

      {/* 👇 Modal Component */}
      <CustomerDetailsModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
    </div>
  );
};

export default Customers;
