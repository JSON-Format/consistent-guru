
"use client";

import { Toaster, toast, ToastOptions, ToastPosition } from "react-hot-toast";
import { useEffect, useState } from "react";

/* =========================
   Types & Interfaces
========================= */

export interface ToastCustomOptions extends ToastOptions {
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastStyle {
  background?: string;
  color?: string;
  border?: string;
  icon?: string;
}

/* =========================
   Toast Functions with Customization
========================= */

export const showToast = {
  success: (msg: string, options?: ToastCustomOptions) => 
    toast.success(msg, {
      icon: options?.icon || "✓",
      style: {
        background: "linear-gradient(135deg, #0A2B1E 0%, #0F3A2A 100%)",
        color: "#D4F1E6",
        border: "1px solid rgba(82, 202, 125, 0.3)",
        ...options?.style,
      },
      duration: options?.duration || 3000,
      ...options,
    }),

  error: (msg: string, options?: ToastCustomOptions) => 
    toast.error(msg, {
      icon: options?.icon || "✕",
      style: {
        background: "linear-gradient(135deg, #2A1A1A 0%, #3A1F1F 100%)",
        color: "#FFD4D4",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        ...options?.style,
      },
      duration: options?.duration || 4000,
      ...options,
    }),

  info: (msg: string, options?: ToastCustomOptions) => 
    toast(msg, {
      icon: options?.icon || "ℹ",
      style: {
        background: "linear-gradient(135deg, #1A2A3A 0%, #1F3548 100%)",
        color: "#B8E1FC",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        ...options?.style,
      },
      duration: options?.duration || 3000,
      ...options,
    }),

  warning: (msg: string, options?: ToastCustomOptions) => 
    toast(msg, {
      icon: options?.icon || "⚠",
      style: {
        background: "linear-gradient(135deg, #2A241A 0%, #3A2E1F 100%)",
        color: "#FFE5B8",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        ...options?.style,
      },
      duration: options?.duration || 3500,
      ...options,
    }),

  loading: (msg: string, options?: ToastCustomOptions) => 
    toast.loading(msg, {
      style: {
        background: "linear-gradient(135deg, #1E1E2E 0%, #25253A 100%)",
        color: "#C4C4F0",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        ...options?.style,
      },
      ...options,
    }),

  custom: (msg: string, options?: ToastCustomOptions) => 
    toast(msg, options),

  dismiss: (id?: string) => toast.dismiss(id),
  dismissAll: () => toast.dismiss(),
};

/* =========================
   Styled Toaster Component
========================= */

interface ToasterProps {
  position?: ToastPosition;
  theme?: "light" | "dark" | "system";
  showProgress?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export const AppToaster = ({ 
  position = "bottom-center",
  showProgress = true,
  showCloseButton = true,
  className = "",
}: ToasterProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Toaster
      position={position}
      toastOptions={{
        duration: 3000,
        className: `toast-custom ${className}`,
        style: {
          background: "rgba(18, 28, 32, 0.95)",
          backdropFilter: "blur(12px)",
          color: "#E8F0F2",
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "'Inter', sans-serif",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(82, 202, 125, 0.1)",
          border: "1px solid rgba(82, 202, 125, 0.2)",
        },

        success: {
          duration: 3000,
          iconTheme: {
            primary: "#52CA7D",
            secondary: "#0F3A2A",
          },
        },

        error: {
          duration: 4000,
          iconTheme: {
            primary: "#EF4444",
            secondary: "#3A1F1F",
          },
        },

        loading: {
          duration: Infinity,
          iconTheme: {
            primary: "#8B5CF6",
            secondary: "#25253A",
          },
        },
      }}
    />
  );
};

/* =========================
   Enhanced Toast with Actions
========================= */

export const showActionToast = {
  success: (msg: string, action: { label: string; onClick: () => void }) => 
    toast.success(msg, {
      duration: 5000,
      style: {
        background: "linear-gradient(135deg, #0A2B1E 0%, #0F3A2A 100%)",
        color: "#D4F1E6",
        border: "1px solid rgba(82, 202, 125, 0.3)",
      },
      action: {
        label: action.label,
        onClick: action.onClick,
      },
    }),

  error: (msg: string, action: { label: string; onClick: () => void }) => 
    toast.error(msg, {
      duration: 6000,
      style: {
        background: "linear-gradient(135deg, #2A1A1A 0%, #3A1F1F 100%)",
        color: "#FFD4D4",
        border: "1px solid rgba(239, 68, 68, 0.3)",
      },
      action: {
        label: action.label,
        onClick: action.onClick,
      },
    }),
};

/* =========================
   Notification Center
========================= */

interface ToasterProps {
  position?: ToastPosition;
  showProgress?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export const useNotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    type: Notification["type"],
    message: string
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      id,
      type,
      message,
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast as well
    showToast[type](message);
    
    return id;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
};

/* =========================
   Usage Example Component
========================= */

export const ToastDemo = () => {
  const { addNotification, unreadCount, notifications } = useNotificationCenter();

  return (
    <div className="space-y-4 p-6 bg-[#0A0F0D] rounded-lg border border-primary/20">
      <h3 className="text-lg font-semibold text-foreground">Toast Demo</h3>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => showToast.success("Operation completed successfully!")}
          className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all"
        >
          Success Toast
        </button>
        
        <button
          onClick={() => showToast.error("Something went wrong!")}
          className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
        >
          Error Toast
        </button>
        
        <button
          onClick={() => showToast.info("Here's some information for you")}
          className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all"
        >
          Info Toast
        </button>
        
        <button
          onClick={() => {
            const id = showToast.loading("Processing your request...");
            setTimeout(() => {
              showToast.dismiss(id);
              showToast.success("Request completed!");
            }, 2000);
          }}
          className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-all"
        >
          Loading Toast
        </button>
        
        <button
          onClick={() => addNotification("success", "New notification received!")}
          className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all relative"
        >
          Add Notification
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
      
      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <div className="mt-6 space-y-2 max-h-64 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Notifications ({notifications.length})
            </h4>
            <button
              onClick={() => {
                // Clear all notifications logic
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Clear all
            </button>
          </div>
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-3 rounded-lg border ${
                notif.read ? "opacity-60" : "border-primary/30 bg-primary/5"
              } transition-all`}
            >
              <p className="text-sm">{notif.message}</p>
              <span className="text-xs text-muted-foreground">
                {notif.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};