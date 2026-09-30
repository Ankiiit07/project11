import React from 'react';
import toast, { Toaster, type Toast } from 'react-hot-toast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const ICONS = {
  success: <CheckCircle size={20} className="flex-shrink-0 text-green-500" />,
  error: <AlertCircle size={20} className="flex-shrink-0 text-red-500" />,
  warning: <AlertTriangle size={20} className="flex-shrink-0 text-yellow-500" />,
  info: <Info size={20} className="flex-shrink-0 text-amber-500" />,
};

const CustomToast: React.FC<{ t: Toast; message: string; type: NotificationType } & NotificationOptions> = ({
  t,
  message,
  type,
  title,
  action,
}) => (
  <div
    role={type === 'error' ? 'alert' : 'status'}
    className={`${t.visible ? 'opacity-100' : 'opacity-0'} transition-opacity max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
  >
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        {ICONS[type]}
        <div className="ml-3 flex-1">
          {title && <p className="text-sm font-medium text-gray-900">{title}</p>}
          <p className="text-sm text-gray-600">{message}</p>
          {action && (
            <button
              onClick={() => {
                action.onClick();
                toast.dismiss(t.id);
              }}
              className="mt-2 text-sm font-medium text-amber-700 hover:text-amber-600"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
    <div className="flex border-l border-gray-200">
      <button
        onClick={() => toast.dismiss(t.id)}
        aria-label="Dismiss"
        className="w-full rounded-r-lg p-4 flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <X size={16} />
      </button>
    </div>
  </div>
);

const show = (type: NotificationType) => (message: string, options: NotificationOptions = {}) =>
  toast.custom((t) => <CustomToast t={t} message={message} type={type} {...options} />, {
    duration: options.duration ?? 4000,
  });

/** Pop-up messages, e.g. `const notify = useNotification(); notify.success('Saved')`. */
export const useNotification = () => ({
  success: show('success'),
  error: show('error'),
  warning: show('warning'),
  info: show('info'),
});

const NotificationSystem: React.FC = () => <Toaster position="top-right" />;

export default NotificationSystem;
