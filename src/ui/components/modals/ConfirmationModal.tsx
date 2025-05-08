// src/components/Modals/ConfirmationModal.tsx
import React, { useState } from 'react';
import VendorSearchSelect, { Vendor } from '../VendorSearchSelect';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: 'primary' | 'danger' | 'success' | 'warning';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonVariant = 'primary',
}) => {
  if (!isOpen) return null;

  let confirmButtonClasses = "px-4 py-2 rounded text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ";
  switch (confirmButtonVariant) {
    case 'danger':
      confirmButtonClasses += "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      break;
    case 'success':
      confirmButtonClasses += "bg-primary hover:bg-primary-700 focus:ring-primary-500";
      break;
    case 'warning':
      confirmButtonClasses += "bg-yellow-500 hover:bg-yellow-600 text-black focus:ring-yellow-400";
      break;
    case 'primary':
    default:
      // Assuming you have 'primary' color defined in your tailwind config.
      // If not, replace with a specific color like 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
      confirmButtonClasses += "bg-primary hover:bg-primary-dark focus:ring-primary";
      // Fallback if primary is not set (example: blue)
      // confirmButtonClasses += "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
      break;
  }

    const [vendor, setVendor] = useState<Vendor | null>(null); 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-[100] transition-opacity duration-150 ease-linear" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-150 ease-out scale-100">
        <h3 id="modal-title" className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">{title}</h3>
        <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
          {message}

          <p>{title === "Confirm Send to Vendor" && 
            
            <VendorSearchSelect onSelect={setVendor} className='mt-4' />
            
            }</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-500 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 font-medium"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full sm:w-auto ${confirmButtonClasses}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;