import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNotifications, useAppActions } from '../store';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Notification types
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast configuration
const toastConfig = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    background: '#363636',
    color: '#fff',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '14px',
    maxWidth: '400px',
  },
};

// Icon components for different notification types
const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  const iconProps = { size: 20, className: 'flex-shrink-0' };

  switch (type) {
    case 'success':
      return <CheckCircle {...iconProps} className="text-green-400" />;
    case 'error':
      return <AlertCircle {...iconProps} className="text-red-400" />;
    case 'warning':
      return <AlertTriangle {...iconProps} className="text-yellow-400" />;
    case 'info':
      return <Info {...iconProps} className="text-amber-400" />;
    default:
      return <Info {...iconProps} className="text-amber-400" />;
  }
};

// Custom toast component
const CustomToast: React.FC<{ t: any; message: string; type: NotificationType; title?: string; action?: Notification['action'] }> = ({
  t,
  message,
  type,
  title,
  action,
}) => (
  <div
    className={`${
      t.visible ? 'animate-enter' : 'animate-leave'
    } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
  >
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <NotificationIcon type={type} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {title}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-300">{message}</p>
          {action && (
            <button
              onClick={() => {
                action.onClick();
                toast.dismiss(t.id);
              }}
              className="mt-2 text-sm font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
    <div className="flex border-l border-gray-200 dark:border-gray-700">
      <button
        onClick={() => toast.dismiss(t.id)}
        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <X size={16} />
      </button>
    </div>
  </div>
);

// Notification system component
export const NotificationSystem: React.FC = () => {
  const notifications = useNotifications();
  const { removeNotification } = useAppActions();

  // Show toast notifications
  const showToast = (notification: Notification) => {
    const toastOptions = {
      ...toastConfig,
      duration: notification.duration || toastConfig.duration,
    };

    const toastContent = (t: any) => (
      <CustomToast
        t={t}
        message={notification.message}
        type={notification.type}
        title={notification.title}
        action={notification.action}
      />
    );

    switch (notification.type) {
      case 'success':
        toast.success(toastContent, toastOptions);
        break;
      case 'error':
        toast.error(toastContent, toastOptions);
        break;
      case 'warning':
        toast(toastContent, { ...toastOptions, icon: '⚠️' });
        break;
      case 'info':
        toast(toastContent, toastOptions);
        break;
      default:
        toast(toastContent, toastOptions);
    }

    // Auto-remove notification from store after toast duration
    setTimeout(() => {
      removeNotification(notification.id);
    }, notification.duration || toastConfig.duration);
  };

  // Process new notifications
  useEffect(() => {
    if (notifications && Array.isArray(notifications)) {
      notifications.forEach((notification) => {
        showToast(notification);
      });
    }
  }, [notifications, showToast]);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          padding: 0,
          margin: 0,
          boxShadow: 'none',
        },
      }}
    />
  );
};

// Hook for easy notification usage
export const useNotification = () => {
  const { addNotification } = useAppActions();

  return {
    success: (message: string, options?: Partial<Notification>) =>
      addNotification({ type: 'success', message, ...options }),
    error: (message: string, options?: Partial<Notification>) =>
      addNotification({ type: 'error', message, ...options }),
    warning: (message: string, options?: Partial<Notification>) =>
      addNotification({ type: 'warning', message, ...options }),
    info: (message: string, options?: Partial<Notification>) =>
      addNotification({ type: 'info', message, ...options }),
  };
};

// In-app notification component
export const InAppNotifications: React.FC = () => {
  const notifications = useNotifications();
  const { removeNotification } = useAppActions();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg border-l-4 ${
            notification.type === 'success'
              ? 'border-green-500'
              : notification.type === 'error'
              ? 'border-red-500'
              : notification.type === 'warning'
              ? 'border-yellow-500'
              : 'border-blue-500'
          } p-4 animate-in slide-in-from-right-2 duration-300`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <NotificationIcon type={notification.type} />
            </div>
            <div className="ml-3 flex-1">
              {notification.title && (
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.title}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {notification.message}
              </p>
              {notification.action && (
                <button
                  onClick={() => {
                    notification.action!.onClick();
                    removeNotification(notification.id);
                  }}
                  className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {notification.action.label}
                </button>
              )}
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => removeNotification(notification.id)}
                className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem; 