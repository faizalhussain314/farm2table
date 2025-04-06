import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCustomer } from "../../services/customers/customerService";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker } from "react-leaflet";// Adjust the path if needed
import "leaflet/dist/leaflet.css";
import { DraggableMarker } from "../components/DraggableMarker";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    password: "",
    email: "", // Optional but included here
  });
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 25.276987,
    lng: 55.296249,
  });
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phone,
      password: customer.password,
      role: 'customer' as const,
      address,
      latitude: location.lat,
      longitude: location.lng,
    };
    

    // Show loading toast
    const toastId = toast.loading("Adding customer...", {
      duration: 0, // Set duration to 0 to keep it open until manually closed
    });

    try {
      await addCustomer(payload);
      toast.success("Customer added successfully!", { id: toastId });
      navigate("/customers");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add customer", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add New Customer</h1>

      <div className="bg-white  rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary bg-white dark:bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email (optional)
            </label>
            <input
              type="email"
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary bg-white dark:bg-background"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary bg-white dark:bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={customer.password}
              onChange={(e) =>
                setCustomer({ ...customer, password: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary bg-white dark:bg-background"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary bg-white dark:bg-background h-24"
              placeholder="Enter full address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Drag Marker to Set Location
            </label>
            <div className="h-64 w-full rounded-lg overflow-hidden">
              <MapContainer
                center={location}
                zoom={13}
                style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <DraggableMarker
                  position={location}
                  onPositionChange={setLocation}
                />
              </MapContainer>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected: Latitude {location.lat.toFixed(4)}, Longitude{" "}
              {location.lng.toFixed(4)}
            </p>
          </div>

        

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-background">
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white">
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
