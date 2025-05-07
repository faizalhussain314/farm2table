// src/components/Modals/ViewDetailsModal.tsx (or your preferred path)
import React from 'react';
// Make sure to import the SignupRequest interface from your service file
// For example:
// import { SignupRequest } from '../../services/signupRequests/signupRequestService';

// Define the SignupRequest interface here if it's not imported,
// or ensure it's correctly imported from your services.
// This is a placeholder if not imported:
export interface SignupRequest {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  address: string;
  password?: string;
  companyName?: string;
  reasonForSignup?: string;
  requestedDate: string;
  status: 'Pending Approval' | 'Approved' | 'Sent To Vendor' | 'Rejected';
}


interface ViewDetailsModalProps {
  request: SignupRequest;
  onClose: () => void;
}

const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({ request, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 flex justify-center items-center p-4 z-50 transition-opacity duration-150 ease-linear">
      {/* Modal container */}
      <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-150 ease-out scale-100">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-4">
          <h2 id="view-details-modal-title" className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Signup Request Details
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal body with scrollable content */}
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Using a definition list for better semantics and styling */}
          <dl className="space-y-2">
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">ID:</dt>
              <dd className="mt-0.5 text-gray-900 dark:text-gray-100">{request._id}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">Full Name:</dt>
              <dd className="mt-0.5 text-gray-900 dark:text-gray-100">{request.fullName}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">Email:</dt>
              <dd className="mt-0.5 text-gray-900 dark:text-gray-100">{request.email}</dd>
            </div>
            {request.phoneNumber && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">Phone:</dt>
                <dd className="mt-0.5 text-gray-900 dark:text-gray-100">{request.phoneNumber}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">Address:</dt>
              <dd className="mt-0.5 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{request.address}</dd>
            </div>
            {request.password && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">Password:</dt>
                <dd className="mt-0.5 text-gray-900 dark:text-gray-100">{"********"}</dd> {/* Always show masked */}
              </div>
            )}
            {request.companyName && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">Company:</dt>
                <dd className="mt-0.5 text-gray-900 dark:text-gray-100">{request.companyName}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">Requested Date:</dt>
              <dd className="mt-0.5 text-gray-900 dark:text-gray-100">{new Date(request.requestedDate).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">Status:</dt>
              <dd className="mt-0.5 text-gray-900 dark:text-gray-100">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  request.status === "Pending Approval" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100" :
                  request.status === "Approved" ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100" :
                  request.status === "Rejected" ? "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100" :
                  request.status === "Sent To Vendor" ? "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100" :
                  "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                }`}>
                  {request.status}
                </span>
              </dd>
            </div>
            {request.reasonForSignup && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">Reason/Message for Signup:</dt>
                <dd className="mt-1 p-2 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700/50 whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {request.reasonForSignup}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Modal footer */}
        <div className="mt-5 sm:mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;


