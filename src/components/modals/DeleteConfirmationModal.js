import React from 'react';
import { Loader } from 'lucide-react';

const DeleteConfirmationModal = ({ itemType, itemName, isLoading, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this {itemType}: <span className="font-semibold">{itemName}</span>? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>Delete</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;