import { Dialog } from '@headlessui/react';
import { Mail, Phone } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Customer } from '../../services/customers/customerService';
import toast from 'react-hot-toast';

type Props = {
  customer: Customer | null;
  onClose: () => void;
};

const CustomerDetailsModal = ({ customer, onClose }: Props) => {
  if (!customer) return null;

  const handleCopyLocation = () => {
    if (
      typeof customer.latitude === 'number' &&
      typeof customer.longitude === 'number'
    ) {
      const link = `https://www.google.com/maps?q=${customer.latitude},${customer.longitude}`;
      navigator.clipboard.writeText(link);
      toast.success('Google Maps link copied!');
    }
  };

  return (
    <Dialog
      open={!!customer}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white dark:bg-secondary rounded-lg p-6 w-full max-w-xl mx-auto">
        {/* Header - Avatar and Name */}
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
                {customer.email || 'N/A'}
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                {customer.phoneNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Role & Status */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
            <p className="text-lg font-semibold capitalize">{customer.role}</p>
          </div>
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
        </div>

        {/* Address */}
        <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Address:
            </span>{' '}
            {customer.address || 'N/A'}
          </p>
        </div>

        {/* Map */}
        {typeof customer.latitude === 'number' &&
          typeof customer.longitude === 'number' && (
            <div className="mt-4 h-64 w-full rounded-lg overflow-hidden">
              <MapContainer
                center={[customer.latitude, customer.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[customer.latitude, customer.longitude]}>
                  <Popup>{customer.name}'s Location</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

        {/* Actions */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={handleCopyLocation}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Copy Location Link
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-background"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default CustomerDetailsModal;
