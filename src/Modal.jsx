import React from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="p-6 rounded-xl shadow-lg max-w-md w-full relative">
        {children}
        <button
          onClick={onClose}
          className="absolute top-7 right-8 text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
