import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addVendor } from '../../services/vendors/vendorService';
import toast from 'react-hot-toast';

const AddVendor = () => {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [address, setAddress] = useState('');
  const [document, setDocument] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!document) {
      toast.error('Please upload government ID or proof.');
      return;
    }

    const formData = new FormData();
    formData.append('name', vendor.name);
    formData.append('email', vendor.email);
    formData.append('phoneNumber', vendor.phone);
    formData.append('password', vendor.password);
    formData.append('role', 'vendor');
    formData.append('address', address);
    formData.append('document', document); // government ID/proof

    const toastId = toast.loading('Adding vendor...');

    try {
      await addVendor(formData);
      toast.success('Vendor added successfully!', { id: toastId });
      navigate('/vendors');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add vendor', { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add New Vendor</h1>

      <div className="bg-white rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {['name', 'email', 'phone', 'password'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {field === 'phone' ? 'Phone Number' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                value={(vendor as any)[field]}
                onChange={(e) => setVendor({ ...vendor, [field]: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary bg-white dark:bg-background"
                required={field !== 'email'}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary bg-white dark:bg-background h-24"
              placeholder="Enter full address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Govt ID / Proof</label>
            <input
              type="file"
              onChange={(e) => setDocument(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
              accept="image/*,application/pdf"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/vendors')}
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white"
            >
              Add Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
