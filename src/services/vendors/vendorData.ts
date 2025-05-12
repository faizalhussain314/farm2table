// src/services/vendors/vendorData.ts

// Interface for items in the customer list for a vendor
export interface CustomerForVendorList {
  id: string; // Typically customer's user ID or a unique identifier
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  totalSpentWithVendor: number; // Example: total amount spent by this customer with this vendor
}

// Interface for items in the order list for a vendor
export interface OrderForVendorList {
  id: string; // Order ID
  customerName: string;
  customerId: string;
  date: string; // ISO Date string
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  itemCount: number;
  totalAmount: number; // INR
}

// --- Mock Data Arrays ---

export const mockVendorCustomers: Record<string, CustomerForVendorList[]> = {
  // Assuming vendorId is the _id from VendorResponse (e.g., "vendor123")
  vendor123: [
    {
      id: "cust001",
      name: "Arun Selvam",
      email: "arun.s@example.com",
      phoneNumber: "9876500001",
      city: "Chennai",
      totalSpentWithVendor: 7500, // Adjusted value
    },
    {
      id: "cust002",
      name: "Priya Mohan",
      email: "priya.m@example.com",
      phoneNumber: "9876500002",
      city: "Coimbatore",
      totalSpentWithVendor: 9800, // Adjusted value
    },
    {
      id: "cust003",
      name: "Suresh Kumar",
      email: "suresh.k@example.com",
      phoneNumber: "9876500003",
      city: "Madurai",
      totalSpentWithVendor: 4500, // Adjusted value
    },
    {
      id: "cust004",
      name: "Lakshmi Iyer",
      email: "lakshmi.i@example.com",
      phoneNumber: "9876500004",
      city: "Tiruchirappalli",
      totalSpentWithVendor: 10000, // Adjusted value
    },
    {
      id: "cust005",
      name: "Karthik Raja",
      email: "karthik.r@example.com",
      phoneNumber: "9876500005",
      city: "Salem",
      totalSpentWithVendor: 3000, // Adjusted value
    },
    {
      id: "cust006",
      name: "Anitha Gopi",
      email: "anitha.g@example.com",
      phoneNumber: "9876500006",
      city: "Erode",
      totalSpentWithVendor: 9200, // Adjusted value
    },
  ],
  vendor456: [
    // Another vendor example
    {
      id: "cust007",
      name: "Vijay Anand",
      email: "vijay.a@example.com",
      phoneNumber: "9876500007",
      city: "Vellore",
      totalSpentWithVendor: 6000, // Adjusted value
    },
  ],
};

export const mockVendorOrders: Record<string, OrderForVendorList[]> = {
  vendor123: [
    {
      id: "order001",
      customerId: "cust001",
      customerName: "Arun Selvam",
      date: "2024-05-10T10:00:00Z",
      status: "Delivered",
      itemCount: 2,
      totalAmount: 3000, // Adjusted value
    },
    {
      id: "order002",
      customerId: "cust002",
      customerName: "Priya Mohan",
      date: "2024-05-09T14:30:00Z",
      status: "Shipped",
      itemCount: 1,
      totalAmount: 5000, // Adjusted value
    },
    {
      id: "order003",
      customerId: "cust001",
      customerName: "Arun Selvam",
      date: "2024-05-08T09:15:00Z",
      status: "Processing",
      itemCount: 3,
      totalAmount: 4500, // Adjusted value
    },
    {
      id: "order004",
      customerId: "cust003",
      customerName: "Suresh Kumar",
      date: "2024-05-07T11:00:00Z",
      status: "Pending",
      itemCount: 1,
      totalAmount: 1500, // Adjusted value
    },
    {
      id: "order005",
      customerId: "cust004",
      customerName: "Lakshmi Iyer",
      date: "2024-05-06T16:45:00Z",
      status: "Delivered",
      itemCount: 5,
      totalAmount: 9900, // Adjusted value (close to 10k)
    },
    {
      id: "order006",
      customerId: "cust002",
      customerName: "Priya Mohan",
      date: "2024-05-05T12:00:00Z",
      status: "Cancelled", // Cancelled orders don't contribute to revenue
      itemCount: 2,
      totalAmount: 7000, // Adjusted value (though not included in revenue sum)
    },
    {
      id: "order007",
      customerId: "cust005",
      customerName: "Karthik Raja",
      date: "2024-05-04T10:20:00Z",
      status: "Delivered",
      itemCount: 1,
      totalAmount: 3000, // Adjusted value
    },
    {
      id: "order008",
      customerId: "cust006",
      customerName: "Anitha Gopi",
      date: "2024-05-03T18:00:00Z",
      status: "Shipped",
      itemCount: 4,
      totalAmount: 9200, // Adjusted value
    },
    {
      id: "order009",
      customerId: "cust004",
      customerName: "Lakshmi Iyer",
      date: "2024-05-02T09:00:00Z",
      status: "Processing", // Processing orders don't contribute to revenue in the mock calculation
      itemCount: 1,
      totalAmount: 5000, // Adjusted value
    },
  ],
  vendor456: [
    {
      id: "order010",
      customerId: "cust007",
      customerName: "Vijay Anand",
      date: "2024-05-10T11:00:00Z",
      status: "Delivered",
      itemCount: 3,
      totalAmount: 6000, // Adjusted value
    },
  ],
};

// You would typically have these values based on your backend's pagination settings.
export const DEFAULT_ITEMS_PER_PAGE = 5;
