import React, { useEffect, useState } from 'react';
import { Mail, Phone, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVendors, Vendor, VendorResponse } from '../../services/vendors/vendorService';

const Vendors = () => {
  const [vendors, setVendors] = useState<VendorResponse[]>([]);
  const [loading, setLoading] = useState(true);
 /* paging */
const [page, setPage]   = useState(1);
const [limit, setLimit] = useState(10);          // cards per page

/* derive slice to render */
const start = (page - 1) * limit;
const end   = start + limit;
const currentVendors = vendors.slice(start, end);

const totalPages = Math.ceil(vendors.length / limit);

/* reset to page 1 whenever the list changes (e.g., after add) */
useEffect(() => setPage(1), [vendors]);


  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getVendors();
        console.log("data",data)
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

        {loading  && (
          <div className="text-center text-gray-500 col-span-full">No vendors found.</div>
        )}

        {!loading && currentVendors.length > 0 &&
          currentVendors.map((vendor) => (
            <div key={vendor._id} className="bg-white dark:bg-secondary rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(vendor.user.name) +
                      '&background=random'
                  }
                  alt={vendor.user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <Link to={"/vendors/vendor123"}> <h3 className="text-lg font-semibold underline">{vendor.user.name}</h3></Link>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {vendor.user.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {vendor.user.phoneNumber}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                  <p className="text-lg font-semibold capitalize">{vendor.user.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className={`text-lg font-semibold ${vendor.status ? 'text-green-500' : 'text-red-500'}`}>
                    {vendor.status ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {/*── Pager (hidden if only one page) ──*/}


      </div>
      {totalPages > 1 && (
  <nav className="flex items-center justify-between mt-6 flex-col sm:flex-row gap-4">
    {/* rows selector */}
    <div className="flex items-center gap-2 text-sm">
      <span>Rows:</span>
      <select
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);                   // reset when size changes
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
    </div>
  );
};

export default Vendors;
