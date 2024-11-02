import React from 'react';
import { Toast as ToastType } from '../types';

export const Toast: React.FC<{ toast: ToastType; onClose: (id: string) => void }> = ({
  toast,
  onClose,
}) => {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[toast.type];

  return (
    <div className={`${bgColor} text-white px-4 py-2 rounded shadow-lg flex justify-between items-center`}>
      <span>{toast.message}</span>
      <button onClick={() => onClose(toast.id)} className="ml-4">
        ✕
      </button>
    </div>
  );
}; 