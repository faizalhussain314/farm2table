// src/pages/Requests/Requests.tsx (or your component's path)
import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Eye } from "lucide-react"; // Added Eye for a "View Details" or similar action
import {
  getRequests,
  Request,
  deleteRequest,
  // Import add/update services if you implement full modals
  // addRequestService,
  // updateRequestService,
} from "../../services/requests/requestService"; // Adjusted path
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// --- Mock Modals (as placeholders, implement them fully as needed) ---
interface AddRequestModalProps {
  onClose: () => void;
  onAdded: (newRequest: Request) => void; // Callback after adding
}

const AddRequestModal: React.FC<AddRequestModalProps> = ({ onClose, onAdded }) => {
  // Basic structure, expand with form fields for a real modal
  const [userName, setUserName] = useState("");
  const [requestType, setRequestType] = useState<Request['requestType']>("Other");
  const [details, setDetails] = useState("");

  const handleSubmit = async () => {
    if (!userName || !details) {
        toast.error("User name and details are required.");
        return;
    }
    // const newReqData = { userName, requestType, details };
    // For now, we'll just simulate adding without calling the service,
    // as the full addRequestService isn't integrated into this example's refresh logic yet.
    // In a full implementation, you'd call addRequestService and then onAdded.
    toast.success("Simulated Add: Request would be created.");
    // Example of how you might call it:
    // try {
    //   const addedRequest = await addRequestService({ userName, requestType, details });
    //   onAdded(addedRequest); // Pass the new request back to the parent
    //   toast.success("Request added successfully");
    // } catch (error) {
    //   toast.error("Failed to add request");
    //   console.error(error);
    // }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Request</h2>
        <div className="space-y-3">
          <input type="text" placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-2 border rounded" />
          <select value={requestType} onChange={(e) => setRequestType(e.target.value as Request['requestType'])} className="w-full p-2 border rounded">
            <option value="Address Change">Address Change</option>
            <option value="Phone Number Change">Phone Number Change</option>
            <option value="New Registration">New Registration</option>
            <option value="Other">Other</option>
          </select>
          <textarea placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} className="w-full p-2 border rounded" rows={3}></textarea>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">Add Request</button>
        </div>
      </div>
    </div>
  );
};

interface EditRequestModalProps {
  request: Request;
  onClose: () => void;
  onUpdated: (updatedRequest: Request) => void; // Callback after updating
}

const EditRequestModal: React.FC<EditRequestModalProps> = ({ request, onClose, onUpdated }) => {
  // Basic structure, expand with form fields and logic
  const [status, setStatus] = useState<Request['status']>(request.status);
  const [details, setDetails] = useState<string>(request.details);

  const handleSubmit = async () => {
    toast.success(`Simulated Edit: Request ${request._id} status would be ${status}.`);
    // Example of how you might call it:
    // try {
    //   const updatedRequest = await updateRequestService(request._id, { status, details });
    //   onUpdated(updatedRequest); // Pass the updated request back
    //   toast.success("Request updated successfully");
    // } catch (error) {
    //   toast.error("Failed to update request");
    //   console.error(error);
    // }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Request (ID: {request._id})</h2>
         <p className="mb-2"><strong className="font-medium">User:</strong> {request.userName}</p>
        <p className="mb-4"><strong className="font-medium">Type:</strong> {request.requestType}</p>
        <div className="space-y-3">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details:</label>
             <textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} className="w-full bg-white p-2 border rounded" rows={3}></textarea>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status:</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value as Request['status'])} className="w-full bg-white p-2 border rounded">
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">Update Status</button>
        </div>
      </div>
    </div>
  );
};
// --- End Mock Modals ---


const RequestsPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);

  /* paging */
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // rows per page selector

  /* slice the requests list for the current page */
  const start = (page - 1) * limit;
  const end = start + limit;
  const currentRequests = requests.slice(start, end);

  const totalPages = Math.ceil(requests.length / limit);

  // Reset to page 1 when requests list changes (e.g., after add/delete) or limit changes
  useEffect(() => setPage(1), [requests.length, limit]);


  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const data = await getRequests();
      setRequests(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load requests.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await deleteRequest(id);
      toast.success("Request deleted successfully");
      setRequests((prev) => prev.filter((r) => r._id !== id));
      // If the current page becomes empty after deletion, try to go to the previous page
      if (currentRequests.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete request.");
    }
  };

  const handleRequestAdded = (newRequest: Request) => {
    // This function would be called by AddRequestModal after a successful add
    // To see the change, we'd ideally re-fetch or add to state
    setRequests(prevRequests => [newRequest, ...prevRequests]); // Add to front for immediate visibility
    fetchAllRequests(); // Or simply re-fetch all for consistency with backend
    setShowAddModal(false);
  };

 const handleRequestUpdated = (updatedRequest: Request) => {
    // This function would be called by EditRequestModal after a successful update
    setRequests(prevRequests =>
      prevRequests.map(req => (req._id === updatedRequest._id ? updatedRequest : req))
    );
    // Or re-fetch: fetchAllRequests();
    setEditingRequest(null);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">User Requests</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-dark text-background px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Log New Request</span>
        </button>
      </div>

      {showAddModal && <AddRequestModal onClose={() => setShowAddModal(false)} onAdded={handleRequestAdded} />}
      {editingRequest && (
        <EditRequestModal
          request={editingRequest}
          onClose={() => setEditingRequest(null)}
          onUpdated={handleRequestUpdated}
        />
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden ">
        <table className="w-full border-gray-800 border-b">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-200">
              <th className="text-left p-4">User Name</th>
              <th className="text-left p-4">Request Type</th>
              <th className="text-left p-4">Details (Summary)</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Requested Date</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              [...Array(limit)].map((_, i) => ( // Show skeleton loaders based on limit
                <tr key={`loader-${i}`} className="border-b border-gray-300 animate-pulse">
                  <td className="p-4"><div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded" /></td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded" />
                      <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded" />
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && requests.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500"> {/* Adjusted colSpan */}
                  No requests found.
                </td>
              </tr>
            )}

            {!loading &&
              currentRequests.map((request) => (
                <tr key={request._id} className="border-b border-gray-700 hover:bg-gray-50">
                  <td className="p-4 align-top"><Link to={"/customers/dummy-customer-1"}><p className="underline">{request.userName}</p></Link></td>
                  <td className="p-4 align-top">{request.requestType}</td>
                  <td className="p-4 align-top text-sm text-gray-600 max-w-xs truncate" title={request.details}>
                    {request.details.length > 60 ? `${request.details.substring(0, 60)}...` : request.details}
                  </td>
                  <td className="p-4 align-top">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        request.status === "Pending" ? "bg-yellow-200 text-yellow-800" :
                        request.status === "Approved" ? "bg-green-200 text-green-800" :
                        request.status === "Rejected" ? "bg-red-200 text-red-800" :
                        request.status === "In Progress" ? "bg-blue-200 text-blue-800" :
                        "bg-gray-200 text-gray-800"
                    }`}>
                        {request.status}
                    </span>
                  </td>
                  <td className="p-4 align-top">{new Date(request.requestedDate).toLocaleDateString()}</td>
                  <td className="p-4 align-top">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingRequest(request)}
                        title="Edit/Process Request"
                        className="p-2 hover:bg-gray-200 rounded-lg text-blue-600">
                        <Edit className="h-5 w-5" />
                      </button>
                      {/* <button
                        onClick={() => handleDelete(request._id)}
                        title="Delete Request"
                        className="p-2 hover:bg-gray-200 rounded-lg text-red-500">
                        <Trash2 className="h-5 w-5" />
                      </button> */}
                       {/* Optional: View Details Button */}
                       {/* <button
                        title="View Full Details"
                        onClick={() => alert(`Details for ${request.userName}:\nType: ${request.requestType}\nStatus: ${request.status}\nDate: ${new Date(request.requestedDate).toLocaleString()}\n\n${request.details}`)}
                        className="p-2 hover:bg-gray-200 rounded-lg text-gray-600">
                        <Eye className="h-5 w-5" />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

       {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-between mt-4 flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>Rows:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                // setPage(1); // useEffect already handles this
              }}
              className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600"
            >
              {[10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <ul className="inline-flex items-center -space-x-px">
            <li>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
              >
                Previous
              </button>
            </li>
            {/* Page numbers (simplified for brevity, can be expanded with ellipsis) */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => totalPages <= 5 || n === 1 || n === totalPages || Math.abs(n - page) <= 1 || (page <=3 && n <=3) || (page >= totalPages - 2 && n >= totalPages -2) ) // Show limited page numbers
                .map((n, index, arr) => {
                     const isEllipsis = index > 0 && n !== arr[index-1] + 1 && (n !== page -1 && n !== page + 1 && n !== 1 && n !== totalPages );
                     if (isEllipsis && totalPages > 5 && ( (page > 3 && n === arr[index-1]+1) || (page < totalPages - 2 && n === arr[index-1]+1) ) ) {
                        // Crude ellipsis logic, can be improved
                        if (n === 2 && page > 3) return <li key={`ellipsis-start-${n}`}><span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">...</span></li>;
                        if (n === totalPages -1 && page < totalPages - 2) return <li key={`ellipsis-end-${n}`}><span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">...</span></li>;
                     }
                     return (
                        <li key={n}>
                        <button
                            onClick={() => setPage(n)}
                            className={`px-3 py-2 leading-tight border ${
                            n === page
                                ? "text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            }`}
                        >
                            {n}
                        </button>
                        </li>
                     )
                })}
            <li>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
              >
                Next
              </button>
            </li>
          </ul>
           <div className="text-sm text-gray-700 dark:text-gray-400">
            Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span> ({requests.length} total requests)
          </div>
        </nav>
      )}
      {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
    </div>
  );
};

export default RequestsPage;