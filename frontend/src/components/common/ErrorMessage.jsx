// src/components/common/ErrorMessage.jsx
import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const ErrorMessage = ({
  message = "Ocurrió un error",
  className = "",
  onRetry,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 ${className}`}
    >
      <div className="flex items-center text-red-500 mb-2">
        <ExclamationCircleIcon className="h-5 w-5 mr-2" />
        <span className="font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
