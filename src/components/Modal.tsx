// import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function Modal({ isOpen, onClose, message }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 transform transition-all animate-modal">
        <div className="text-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {message}
          </h3>
          <button
            onClick={onClose}
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
} 