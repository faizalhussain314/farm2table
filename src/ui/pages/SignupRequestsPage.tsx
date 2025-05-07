// src/pages/SignupRequests/SignupRequestsPage.tsx
import { useEffect, useState } from "react";
import { Send, CheckCircle2, XCircle, Eye } from "lucide-react";
import {
  getSignupRequests,
  SignupRequest,
  updateSignupRequestStatus,
  sendSignupDetailsToVendorService,
} from "../../services/signupRequests/signupRequestService"; // Adjust path
import toast from "react-hot-toast";
import ConfirmationModal from "../components/modals/ConfirmationModal"; // Adjust path
import ViewDetailsModal from "../components/modals/ViewDetailsModal"; // Assuming ViewDetailsModal is in the same folder or adjust path
import { Link } from "react-router-dom";

// Define ActionType and ActionToConfirm interface
type ActionType = 'approve' | 'reject' | 'sendToVendor';
interface ActionToConfirm {
  type: ActionType;
  requestId: string;
  requestName: string;
}

const SignupRequestsPage = () => {
  const [signupRequests, setSignupRequests] = useState<SignupRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedRequestForView, setSelectedRequestForView] = useState<SignupRequest | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // State for Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<ActionToConfirm | null>(null);


  const fetchAllSignupRequests = async () => {
    setLoading(true);
    try {
      const data = await getSignupRequests();
      setSignupRequests(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load signup requests.");
      setSignupRequests([]);
      toast.error("Failed to load signup requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSignupRequests();
  }, []);

  useEffect(() => setPage(1), [signupRequests.length, limit]);

  const handleUpdateRequest = (updatedRequest: SignupRequest) => {
     setSignupRequests((prev) =>
        prev.map((req) => (req._id === updatedRequest._id ? updatedRequest : req))
      );
  };

  // --- Action Triggers (to open confirmation modal) ---
  const triggerApproveRequest = (id: string, name: string) => {
    setActionToConfirm({ type: 'approve', requestId: id, requestName: name });
    setIsConfirmModalOpen(true);
  };

  const triggerRejectRequest = (id: string, name: string) => {
    setActionToConfirm({ type: 'reject', requestId: id, requestName: name });
    setIsConfirmModalOpen(true);
  };

  const triggerSendToVendor = (id: string, name: string) => {
    setActionToConfirm({ type: 'sendToVendor', requestId: id, requestName: name });
    setIsConfirmModalOpen(true);
  };

  // --- Perform Confirmed Action ---
  const performConfirmedAction = async () => {
    if (!actionToConfirm) return;

    const { type, requestId, requestName } = actionToConfirm;
    setIsConfirmModalOpen(false); // Close modal

    let toastId = toast.loading(`Processing ${type} for ${requestName}...`);

    try {
      let updatedRequest;
      if (type === 'approve') {
        updatedRequest = await updateSignupRequestStatus(requestId, 'Approved');
        handleUpdateRequest(updatedRequest);
        toast.success(`Signup request for ${requestName} approved.`, { id: toastId });
      } else if (type === 'reject') {
        updatedRequest = await updateSignupRequestStatus(requestId, 'Rejected');
        handleUpdateRequest(updatedRequest);
        toast.success(`Signup request for ${requestName} rejected.`, { id: toastId });
      } else if (type === 'sendToVendor') {
        updatedRequest = await sendSignupDetailsToVendorService(requestId);
        handleUpdateRequest(updatedRequest);
        toast.success(`Details for ${requestName} sent to vendor.`, { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${type} request for ${requestName}. Please try again.`, { id: toastId });
    } finally {
      setActionToConfirm(null); // Reset action
    }
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalOpen(false);
    setActionToConfirm(null);
  };


  const currentSignupRequests = signupRequests.slice((page - 1) * limit, (page - 1) * limit + limit);
  const totalPages = Math.ceil(signupRequests.length / limit);

  const getStatusColor = (status: SignupRequest['status']) => {
    switch (status) {
      case 'Pending Approval': return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
      case 'Approved': return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100';
      case 'Sent To Vendor': return 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100';
      case 'Rejected': return 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100';
      default: return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
    }
  };

  // Determine modal properties based on actionToConfirm
  let modalTitle = "";
  let modalMessage: React.ReactNode = "";
  let modalConfirmText = "Confirm";
  let modalButtonVariant: 'primary' | 'danger' | 'success' = 'primary';

  if (actionToConfirm) {
    const { type, requestName } = actionToConfirm;
    modalMessage = (
      <span>
        Are you sure you want to {type === 'sendToVendor' ? 'send details to vendor' : type} for signup request: <br />
        <strong className="font-semibold">{requestName}</strong>?
        {type === 'sendToVendor' && <p className="text-xs sm:text-sm mt-2 text-gray-500 dark:text-gray-400">This action is typically performed for already approved requests.</p>}
      </span>
    );

    if (type === 'approve') {
      modalTitle = "Confirm Approval";
      modalConfirmText = "Approve";
      modalButtonVariant = 'success';
    } else if (type === 'reject') {
      modalTitle = "Confirm Rejection";
      modalConfirmText = "Reject";
      modalButtonVariant = 'danger';
    } else if (type === 'sendToVendor') {
      modalTitle = "Confirm Send to Vendor";
      modalConfirmText = "Send to Vendor";
      modalButtonVariant = 'primary'; // Or 'warning' if you prefer
    }
  }


  return (
    <div className="space-y-6 p-4 md:p-6 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold dark:text-white">New Signup Requests (Vegetable Vendors)</h1>
      </div>

      {selectedRequestForView && (
        <ViewDetailsModal // Assuming ViewDetailsModal is created and imported
          request={selectedRequestForView}
          onClose={() => setSelectedRequestForView(null)}
        />
      )}

      {isConfirmModalOpen && actionToConfirm && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          title={modalTitle}
          message={modalMessage}
          onConfirm={performConfirmedAction}
          onCancel={handleCancelConfirm}
          confirmText={modalConfirmText}
          confirmButtonVariant={modalButtonVariant}
        />
      )}

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="text-left p-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300 tracking-wider">Full Name</th>
              <th className="text-left p-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300 tracking-wider">Email</th>
              <th className="text-left p-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300 tracking-wider hidden sm:table-cell">Phone</th>
              <th className="text-left p-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300 tracking-wider hidden md:table-cell">Address</th>
              <th className="text-left p-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300 tracking-wider">Password</th>
              <th className="text-left p-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300 tracking-wider">Status</th>
              <th className="text-left p-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading &&
              [...Array(limit)].map((_, i) => (
                <tr key={`loader-${i}`} className="animate-pulse">
                  {/* Skeleton cells */}
                  <td className="p-3 px-4"><div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded" /></td>
                  <td className="p-3 px-4"><div className="h-4 w-36 bg-gray-300 dark:bg-gray-600 rounded" /></td>
                  <td className="p-3 px-4 hidden sm:table-cell"><div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" /></td>
                  <td className="p-3 px-4 hidden md:table-cell"><div className="h-4 w-40 bg-gray-300 dark:bg-gray-600 rounded" /></td>
                  <td className="p-3 px-4"><div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded" /></td>
                  <td className="p-3 px-4"><div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" /></td>
                  <td className="p-3 px-4">
                    <div className="flex space-x-1">
                      <div className="h-7 w-7 bg-gray-300 dark:bg-gray-600 rounded-md" />
                      <div className="h-7 w-7 bg-gray-300 dark:bg-gray-600 rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && signupRequests.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No signup requests found.
                </td>
              </tr>
            )}

            {!loading &&
              currentSignupRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 px-4 align-top whitespace-nowrap font-medium text-gray-900 dark:text-white"><Link to={"/customers/dummy-customer-1"}><p className="underline">{request.fullName}</p></Link></td>
                  <td className="p-3 px-4 align-top whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{request.email}</td>
                  <td className="p-3 px-4 align-top whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden sm:table-cell">{request.phoneNumber || "N/A"}</td>
                  <td className="p-3 px-4 align-top text-sm text-gray-500 dark:text-gray-300 max-w-xs hidden md:table-cell" title={request.address}>
                     {request.address.length > 40 ? `${request.address.substring(0, 40)}...` : request.address}
                  </td>
                  <td className="p-3 px-4 align-top whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{"********"}</td>
                  <td className="p-3 px-4 align-top whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="p-3 px-4 align-top whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                       <button
                        onClick={() => setSelectedRequestForView(request)}
                        title="View Full Details"
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      > <Eye className="h-4 w-4" /> </button>

                      {request.status === 'Pending Approval' && (
                        <>
                          <button
                            onClick={() => triggerApproveRequest(request._id, request.fullName)}
                            title="Approve Request"
                            className="p-1.5 hover:bg-green-100 dark:hover:bg-green-700/50 rounded-md text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                          > <CheckCircle2 className="h-4 w-4" /> </button>
                          <button
                            onClick={() => triggerRejectRequest(request._id, request.fullName)}
                            title="Reject Request"
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-700/50 rounded-md text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                          > <XCircle className="h-4 w-4" /> </button>
                        </>
                      )}
                      {request.status === 'Approved' && (
                        <button
                          onClick={() => triggerSendToVendor(request._id, request.fullName)}
                          title="Send Details to Vendor"
                          className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-700/50 rounded-md text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        > <Send className="h-4 w-4" /> </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
         <nav className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700 flex-col sm:flex-row gap-4 text-sm text-gray-700 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); }}
              className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {[5, 10, 20, 30, 50].map((n) => ( <option key={n} value={n}>{n}</option> ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 leading-tight bg-white border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:text-gray-500"
            > Previous </button>
            <span className="whitespace-nowrap">
              Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 leading-tight bg-white border border-gray-300 rounded-r-md hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:text-gray-500"
            > Next </button>
          </div>
           <div className="whitespace-nowrap">
            Total Requests: <span className="font-semibold">{signupRequests.length}</span>
          </div>
        </nav>
      )}
      {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
    </div>
  );
};

// Make sure ViewDetailsModal is also created and imported correctly.
// For simplicity, I'm assuming it's in the same directory or you adjust the path.
// If ViewDetailsModal was the one provided in the previous turn, it should be mostly fine.
// Just ensure its import path is correct.
// For example, if ViewDetailsModal.tsx is in the same directory as SignupRequestsPage.tsx:
// import ViewDetailsModal from "./ViewDetailsModal";
// If it was meant to be the one from the original prompt (for the other request type),
// you'd need to adapt it or create one specifically for SignupRequest details as shown in prior steps.
// The provided ViewDetailsModal from the previous step is suitable for SignupRequest.
// Create `ViewDetailsModal.tsx` in the same directory or adjust the import path:
// src/pages/SignupRequests/ViewDetailsModal.tsx

// const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({ request, onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
//       <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg dark:bg-gray-800">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold dark:text-white">Signup Request Details</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl">&times;</button>
//         </div>
//         <div className="space-y-3 text-sm dark:text-gray-300 max-h-[70vh] overflow-y-auto pr-2">
//           <p><strong>ID:</strong> {request._id}</p>
//           <p><strong>Full Name:</strong> {request.fullName}</p>
//           <p><strong>Email:</strong> {request.email}</p>
//           {request.phoneNumber && <p><strong>Phone:</strong> {request.phoneNumber}</p>}
//           <p><strong>Address:</strong> {request.address}</p>
//           {request.password && <p><strong>Password:</strong> {"********"}</p>} {/* Always show masked */}
//           {request.companyName && <p><strong>Company:</strong> {request.companyName}</p>}
//           <p><strong>Requested Date:</strong> {new Date(request.requestedDate).toLocaleString()}</p>
//           <p><strong>Status:</strong> {request.status}</p>
//           {request.reasonForSignup && (
//             <div>
//               <strong>Reason/Message for Signup:</strong>
//               <p className="mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 whitespace-pre-wrap">{request.reasonForSignup}</p>
//             </div>
//           )}
//         </div>
//         <div className="mt-6 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

export default SignupRequestsPage;