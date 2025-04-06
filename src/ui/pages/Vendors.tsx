import React, { useEffect, useState } from 'react';
import { Mail, Phone, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVendors, Vendor } from '../../services/vendors/vendorService';

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getVendors();
        setVendors(data || []);
      } catch (err) {
        console.error('Failed to load vendors', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Vendors</h1>
        <Link
          to="/add-vendor"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Vendor</span>
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
            </div>
          ))}

        {!loading && vendors.length === 0 && (
          <div className="text-center text-gray-500 col-span-full">No vendors found.</div>
        )}

        {!loading &&
          vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white dark:bg-secondary rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    vendor.avatar ||
                    'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(vendor.name) +
                      '&background=random'
                  }
                  alt={vendor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{vendor.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {vendor.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {vendor.phoneNumber}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                  <p className="text-lg font-semibold capitalize">{vendor.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className={`text-lg font-semibold ${vendor.isActive ? 'text-green-500' : 'text-red-500'}`}>
                    {vendor.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Vendors;
