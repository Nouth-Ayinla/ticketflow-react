import React, { useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

const Toast = ({
  message,
  type = "success",
  onClose,
  duration = 4000,
}: {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration?: number;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <AlertCircle size={20} />,
  };

  const styles = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${styles[type]} text-white min-w-[300px] max-w-md`}
        role="alert"
      >
        {icons[type]}
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-80 transition-opacity"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
