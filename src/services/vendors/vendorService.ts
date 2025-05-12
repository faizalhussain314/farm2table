// src/services/vendors/vendorService.ts
import axiosInstance from "../../utils/axiosInstance"; // Your existing import

import {
  mockVendorCustomers,
  mockVendorOrders,
  DEFAULT_ITEMS_PER_PAGE, // Correct import
  CustomerForVendorList, // Import from vendorData.ts
  OrderForVendorList, // Import from vendorData.ts
} from "./vendorData"; // Assuming vendorData.ts is in the same directory
// Using your defined VendorResponse and User interfaces
// No need to redefine Vendor, VendorLocation, VendorServiceLocation, VendorPayload if they are not directly used by VendorPage's display logic for *viewing* a vendor.
// The User and VendorResponse interfaces you provided are key.

// User embedded in the vendor document (as you provided)
export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password?: string; // already hashed
  role: "vendor" | string; // extend as needed
  isActive: boolean;
  address: string;
  latitude: number;
  longitude: number;
  isVeg: boolean;
  createdAt: string; // ISO-8601 date string
  updatedAt: string; // ISO-8601 date string
  __v: number;
  vendorId?: string; // ObjectId (as a string) of the parent vendor (optional if this is the user for the vendor)
}

// Top-level vendor document (as you provided)
export interface VendorResponse {
  _id: string;
  userId: string; // ObjectId (as a string) referencing User
  govtId: string; // URL or other opaque identifier
  vendorCode: string;
  serviceLocations: string[];
  rating: number;
  status: "active" | "inactive" | string; // Use 'active' | 'inactive' and potentially others
  __v: number;
  user: User; // fully embedded user document
}

// --- Actual API calls (as in your file) ---
export const getVendors = async (): Promise<VendorResponse[]> => {
  const response = await axiosInstance.get("/vendor"); // Ensure this matches your API: response.data can be { results: [] } or just []
  return Array.isArray(response.data)
    ? response.data
    : response.data.results || [];
};

export const addVendor = async (formData: FormData) => {
  // Assuming FormData is correct
  await axiosInstance.post("/vendor", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// --- Mocked Service Functions for Customer & Order Lists (as APIs are not ready) ---


// --- Mocked Vendor Details Data ---
// This data simulates the response from GET /vendor/:vendorId
const mockVendorDetails: { [key: string]: VendorResponse } = {
  // Use dummy IDs that you might use in your mock lists or routes
  "vendor-abc-123": {
    _id: "vendor-abc-123",
    userId: "user-xyz-456",
    govtId: "https://example.com/govt/doc123",
    vendorCode: "V-001",
    serviceLocations: ["Downtown", "Uptown"],
    rating: 4.5,
    status: "active",
    __v: 0,
    user: {
      // Embedded user data for this vendor
      _id: "user-xyz-456",
      name: "Green Groceries Inc.",
      email: "contact@greengroceries.com",
      phoneNumber: "9876543210",
      role: "vendor",
      isActive: true,
      address: "101 Green Street, Downtown",
      latitude: 40.7128,
      longitude: -74.006,
      isVeg: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
      vendorId: "vendor-abc-123", // Reference back to the vendor
    },
  },
  "vendor-def-456": {
    _id: "vendor-def-456",
    userId: "user-uvw-789",
    govtId: "https://example.com/govt/doc456",
    vendorCode: "V-002",
    serviceLocations: ["Midtown", "Financial District"],
    rating: 3.9,
    status: "active",
    __v: 0,
    user: {
      // Embedded user data for this vendor
      _id: "user-uvw-789",
      name: "Fresh Meats & More",
      email: "info@freshmeats.net",
      phoneNumber: "9988776655",
      role: "vendor",
      isActive: true,
      address: "202 Market Blvd, Midtown",
      latitude: 40.758,
      longitude: -73.9855,
      isVeg: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
      vendorId: "vendor-def-456", // Reference back to the vendor
    },
  },
  "vendor-ghi-789": {
    _id: "vendor-ghi-789",
    userId: "user-rst-012",
    govtId: "https://example.com/govt/doc789",
    vendorCode: "V-003",
    serviceLocations: ["Brooklyn", "Queens"],
    rating: 4.1,
    status: "inactive", // Example of an inactive vendor
    __v: 0,
    user: {
      // Embedded user data for this vendor
      _id: "user-rst-012",
      name: "Brooklyn Bakery",
      email: "support@brooklynbakery.org",
      phoneNumber: "9009988776",
      role: "vendor",
      isActive: false, // User is also inactive
      address: "303 Pastry Lane, Brooklyn",
      latitude: 40.6782,
      longitude: -73.9442,
      isVeg: true, // Bakery items are veg
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
      vendorId: "vendor-ghi-789", // Reference back to the vendor
    },
  }, // ADDED: Mock details for vendors that have associated customer/order lists
  vendor123: {
    _id: "vendor123",
    userId: "user123_from_vendor_details", // Distinct from mockVendorCustomers ID to show separation if needed
    govtId: "GOVT-V123",
    vendorCode: "V-MOCK-123",
    serviceLocations: ["Chennai", "Coimbatore"],
    rating: 4.2,
    status: "active",
    __v: 0,
    user: {
      _id: "user123_from_vendor_details",
      name: "Chennai Fruits & Veg",
      email: "chennai.fv@example.com",
      phoneNumber: "9111111111",
      role: "vendor",
      isActive: true,
      address: "1 Vendor St, Chennai",
      latitude: 13.0827,
      longitude: 80.2707,
      isVeg: true,
      createdAt: "2023-01-15T10:00:00Z",
      updatedAt: "2024-05-10T12:00:00Z",
      __v: 0,
      vendorId: "vendor123",
    },
  },
  vendor456: {
    _id: "vendor456",
    userId: "user456_from_vendor_details",
    govtId: "GOVT-V456",
    vendorCode: "V-MOCK-456",
    serviceLocations: ["Vellore"],
    rating: 3.5,
    status: "active",
    __v: 0,
    user: {
      _id: "user456_from_vendor_details",
      name: "Vellore Poultry & Eggs",
      email: "vellore.pe@example.com",
      phoneNumber: "9222222222",
      role: "vendor",
      isActive: true,
      address: "2 Vendor Ln, Vellore",
      latitude: 12.9165,
      longitude: 79.1325,
      isVeg: false,
      createdAt: "2023-03-20T09:00:00Z",
      updatedAt: "2024-05-08T11:30:00Z",
      __v: 0,
      vendorId: "vendor456",
    },
  }, // Add more mock vendors as needed
};

// --- Mocked API call for specific vendor details ---
// This now uses the mockVendorDetails data but falls back to a default structure
export const getVendorDetailsById = async (
  vendorId: string
): Promise<VendorResponse> => {
  console.log(`MOCK: Fetching details for vendor ${vendorId}`);
  return new Promise((resolve) => {
    // Use resolve only, as we always return a structure
    setTimeout(() => {
      const vendor = mockVendorDetails[vendorId];
      if (vendor) {
        console.log(`MOCK: Found specific details for ${vendorId}`);
        resolve(vendor);
      } else {
        console.log(
          `MOCK: Specific details for ${vendorId} not found. Returning default structure.`
        ); // Return a default/blank structure if the specific mock ID isn't found
        const defaultVendor: VendorResponse = {
          _id: vendorId, // Use the requested ID
          userId: `${vendorId}-user`, // Placeholder user ID
          govtId: "Details Not Available",
          vendorCode: "Unknown",
          serviceLocations: [],
          rating: 0,
          status: "unknown",
          __v: 0,
          user: {
            _id: `${vendorId}-user`,
            name: `Vendor ID: ${vendorId}`, // Use the ID as the name placeholder
            email: "N/A",
            phoneNumber: "N/A",
            role: "vendor",
            isActive: false,
            address: "Details not available",
            latitude: 0,
            longitude: 0,
            isVeg: false,
            createdAt: new Date().toISOString(), // Use current date or a placeholder
            updatedAt: new Date().toISOString(),
            __v: 0,
            vendorId: vendorId,
          },
        };
        resolve(defaultVendor);
      }
    }, 500); // Simulate delay
  });
};

export const getCustomersForVendor = async (
  vendorId: string,
  page: number,
  limit: number = DEFAULT_ITEMS_PER_PAGE // Corrected
): Promise<{
  customers: CustomerForVendorList[];
  totalPages: number;
  currentPage: number;
  totalCustomers: number;
}> => {
  console.log(`MOCK: Fetching customers for vendor ${vendorId}, page ${page}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      // This still uses the vendorId passed from the component (which is the URL param ID)
      const allCustomersForThisVendor = mockVendorCustomers[vendorId] || [];
      const totalCustomers = allCustomersForThisVendor.length;
      const totalPages = Math.ceil(totalCustomers / limit);
      const startIndex = (page - 1) * limit;
      const paginatedCustomers = allCustomersForThisVendor.slice(
        startIndex,
        startIndex + limit
      );
      resolve({
        customers: paginatedCustomers,
        totalPages,
        currentPage: page,
        totalCustomers,
      });
    }, 500); // Simulate delay
  });
};

export const getOrdersForVendor = async (
  vendorId: string,
  page: number,
  limit: number = DEFAULT_ITEMS_PER_PAGE // Corrected
): Promise<{
  orders: OrderForVendorList[];
  totalPages: number;
  currentPage: number;
  totalOrders: number;
  totalRevenue: number;
}> => {
  console.log(`MOCK: Fetching orders for vendor ${vendorId}, page ${page}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      // This still uses the vendorId passed from the component (which is the URL param ID)
      const allOrdersForThisVendor = (mockVendorOrders[vendorId] || []).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      const totalOrders = allOrdersForThisVendor.length;
      const totalPages = Math.ceil(totalOrders / limit);
      const startIndex = (page - 1) * limit;
      const paginatedOrders = allOrdersForThisVendor.slice(
        startIndex,
        startIndex + limit
      ); // Calculate total revenue from all orders for this vendor (not just paginated)

      const totalRevenue = allOrdersForThisVendor
        .filter(
          (order) => order.status === "Delivered" || order.status === "Shipped"
        ) // Define what counts as revenue
        .reduce((sum, order) => sum + order.totalAmount, 0);

      resolve({
        orders: paginatedOrders,
        totalPages,
        currentPage: page,
        totalOrders,
        totalRevenue,
      });
    }, 500); // Simulate delay
  });
};
