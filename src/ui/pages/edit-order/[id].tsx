import React, { useEffect, useRef, useState } from "react"; // Import React for FormEvent type
import { useNavigate, useParams } from "react-router-dom";
import {
  DetailedOrder,
  getOrderById,
  updateOrderStatusApi,
} from "../../../services/orders/orderService"; // Adjust path as needed
import OrderStatusSelector from "../../components/OrderStatusSelector";
import toast from "react-hot-toast";

// Define the Status type and an array of valid statuses for easy checking
type Status = "Placed" | "Packing" | "Ready" | "Dispatch" | "Delivered";
const validStatuses: Status[] = ["Placed", "Packing", "Ready", "Dispatch", "Delivered"];

const EditOrders = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
const [menuOpen, setMenuOpen] = useState(false);

  // State Hooks
  const [orderDetails, setOrderDetails] = useState<DetailedOrder | null>(null); // Initialize with null
  const [status, setStatus] = useState<Status | undefined>(undefined); // Initialize as undefined until loaded
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Mapping from potential backend values (lowercase) to UI Status values
  const backendToUiMap: Record<string, Status> = {
    placed:     "Placed",
    packing: "Packing",
    ready: "Ready",
    dispatch: "Dispatch",
    dispatched: "Dispatch", // Handle potential variations like 'dispatched'
    delivered: "Delivered",
  };

  useEffect(() => {
    console.log('useEffect Running - ID:', id); // Log when effect runs

    if (!id) {
      console.error("useEffect Error: No ID provided.");
      setError("Order ID is missing.");
      setIsLoading(false);
      return;
    }

    const getOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`useEffect: Fetching order for ID: ${id}`); // Log before fetch
        const data = await getOrderById(id);
        console.log('useEffect: Fetched Data:', data); // Log the raw fetched data

        // Log the status BEFORE mapping
        console.log('useEffect: Raw status from API:', data?.status);

        const fetchedStatusKey = data.status?.toLowerCase();
        const mappedStatus = fetchedStatusKey ? backendToUiMap[fetchedStatusKey] : undefined;

        console.log('useEffect: Lowercase key:', fetchedStatusKey, 'Mapped status:', mappedStatus); // Log mapping result

        if (mappedStatus && validStatuses.includes(mappedStatus)) {
           console.log('useEffect: Setting status to (Mapped):', mappedStatus); // Log before setting
           setStatus(mappedStatus);
        } else {
           console.warn(`useEffect: Unknown status '${data.status}'. Defaulting to 'Packing'.`); // Log fallback
           setStatus("Packing");
        }

        setOrderDetails(data);
        console.log('useEffect: Set orderDetails and status state.'); // Confirm state setters called

      } catch (err) {
        console.error("useEffect: Failed to fetch order details:", err); // Log fetch error
        setError("Failed to load order details. Please try again.");
      } finally {
        console.log('useEffect: Setting isLoading to false.'); // Log before setting loading false
        setIsLoading(false);
      }
    };

    getOrderDetails();
  }, [id]); 

  // --- Event Handlers ---

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default browser form submission
    console.log("Form submitted with status:", status);
    if (!id || !status) {
        console.error("Cannot update: Missing ID or status");
        // Optionally show an error to the user
        return;
    }
    // --- Add your actual API call here to update the order status ---
    const toastId = toast.loading("updating the detail...")
    try {
     
      setIsLoading(true); // Indicate activity
      
      await updateOrderStatusApi(id, status.toLocaleLowerCase()); 
      toast.success('Order Updated Successfully', { id: toastId } );
      navigate("/orders"); 
    } catch (updateError) {
      console.error("Failed to update order status:", updateError);
      setError("Failed to update status. Please try again.");
      setIsLoading(false);
    }
    // --- End of API call logic ---
  };

  useEffect(() => {
    // close the menu when clicking outside
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Type assertion is okay here since options are controlled
    const newStatus = e.target.value as Status;
    setStatus(newStatus);
    // updateStatus(newStatus); // You might not need this separate function
                                // if handleSubmit does the final update.
  };


  // --- Render Logic ---

  if (isLoading) {
    // Show loading state while fetching or submitting
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading order details...</p> {/* Or use a spinner component */}
      </div>
    );
  }

  if (error) {
    // Show error message if fetching failed
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!orderDetails || status === undefined) {
    // Handle case where data isn't loaded (e.g., initial undefined status or null orderDetails)
    // This check might be redundant if error handling is robust, but adds safety.
    return <div className="text-center p-4">Order details could not be loaded.</div>;
  }

  // --- Main Component Render (Data is loaded) ---
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Update Order Status</h1>
      <div className="bg-white shadow-sm rounded-lg p-6">
        {/* Pass handleSubmit to the form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-center">
              <h1 className="text-2xl font-semibold">Order Details - {id}</h1>
            </div>
            <div className="space-y-4">
              {/* Customer Info and Order Status Row */}
              <div className="flex flex-wrap md:flex-nowrap w-full gap-6"> {/* Added gap */}
                {/* Customer Info Column */}
                <div className="w-full md:w-1/2 space-y-1"> {/* Added space-y */}
                  <h3 className="font-medium text-lg mb-2">Customer Information</h3> {/* Improved styling */}
                  <p><span className="font-medium">Name:</span> {orderDetails.customer.name}</p>
                  <p><span className="font-medium">Email:</span> {orderDetails.customer.email}</p>
                  <p><span className="font-medium">Phone:</span> {orderDetails.customer.phoneNumber}</p>
                  <p><span className="font-medium">Role:</span> {orderDetails.customer.role}</p>
                  <p>
                    <span className="font-medium">Vegetarian:</span>{" "}
                    {orderDetails.customer.isVeg ? "Yes" : "No"}
                  </p>
                </div>

                {/* Status Update Column */}
                <div className="w-full md:w-1/2">
                <OrderStatusSelector
  options={["Placed", "Packing", "Ready", "Dispatch", "Delivered"]}
  selected={status}                   // your state
  onChange={(v) => setStatus(v)}      // your setter
  disabled={isLoading}
  open={menuOpen}
  setOpen={setMenuOpen}
  dropdownRef={dropdownRef}
/>
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <h3 className="font-medium text-lg mb-2">Order Items</h3> {/* Improved styling */}
                <div className="overflow-x-auto"> {/* Make table scrollable on small screens */}
                    <table className="w-full border-collapse min-w-[600px]"> {/* Added min-width */}
                    <thead>
                        <tr className="border-b border-gray-300 bg-gray-50"> {/* Added bg color */}
                        <th className="text-left py-2 px-3 font-semibold">Product</th> {/* Added padding & font weight */}
                        <th className="text-left py-2 px-3 font-semibold">Category</th>
                        <th className="text-left py-2 px-3 font-semibold">Price</th>
                        <th className="text-left py-2 px-3 font-semibold">Quantity</th>
                        <th className="text-left py-2 px-3 font-semibold">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(
                        orderDetails.items.filter((item) => item.productId) || [] // Keep filter if necessary
                        ).map((item) => {
                        // Ensure productId exists before accessing its properties
                        if (!item.productId) return null; // Skip rendering if productId is missing

                        const product = item.productId;
                        // Calculate total safely
                        const total = (product.price || 0) * (item.quantity || 0) / 1000;
                        const itemQuantity = (item.quantity || 0) / 1000;

                        return (
                            <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50"> {/* Added hover effect */}
                            <td className="py-2 px-3">{product.name}</td>
                            <td className="py-2 px-3">{product.category}</td>
                            <td className="py-2 px-3">₹{(product.price || 0).toFixed(2)}</td>
                            {/* Display quantity more clearly */}
                            <td className="py-2 px-3">{itemQuantity.toFixed(3)} kg</td> {/* Use 3 decimals for kg */}
                            <td className="py-2 px-3">₹{total.toFixed(2)}</td>
                            </tr>
                        );
                        })}
                         <tr  className="border-b border-gray-200 hover:bg-gray-50"> {/* Added hover effect */}
                            <td className="py-2 px-3"></td>
                            <td className="py-2 px-3"></td>
                            <td className="py-2 px-3"></td>
                            {/* Display quantity more clearly */}
                            <td className="py-2 px-3"><p className="text-xl font-semibold">Total Price: </p></td> {/* Use 3 decimals for kg */}
                            <td className="py-2 px-3"> <p className="text-xl font-semibold"> {/* Larger total price */}
                     ₹{(orderDetails.totalPrice || 0).toFixed(2)}
                </p></td>
                            </tr>
                    </tbody>
                    </table>
                </div>
              </div>

              {/* Order Summary */}
              {/* <div className="pt-4"> 
                <h3 className="font-medium text-lg mb-2">Order Summary</h3>
                <p className="text-xl font-semibold">
                    Total Price: ₹{(orderDetails.totalPrice || 0).toFixed(2)}
                </p> */}
                {/* You can add CreatedAt/UpdatedAt back here if needed, using orderDetails */}
                {/* <p>Created: {new Date(orderDetails.createdAt).toLocaleString()}</p> */}
                {/* <p>Updated: {new Date(orderDetails.updatedAt).toLocaleString()}</p> */}
              {/* </div> */}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4"> {/* Added padding top */}
              <button
                type="button" // Important: type="button" prevents form submission
                onClick={() => navigate("/orders")} // Navigate back
                className="px-6 py-2 rounded-lg border border-gray-700 hover:bg-gray-100" // Adjusted hover
                disabled={isLoading} // Disable if submitting
              >
                Cancel
              </button>
              <button
                type="submit" // Submits the form
                className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white" // Example primary color
                disabled={isLoading} // Disable if submitting
              >
                 {/* Change text potentially during submission */}
                {isLoading ? "Updating..." : "Update Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrders;