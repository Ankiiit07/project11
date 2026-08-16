import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Coffee, ShoppingCart, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useRazorpay } from '../hooks/useRazorpay';

// Enhanced loading spinner component
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  text?: string;
}> = ({ size = 'md', color = 'currentColor', className = '', text }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} ${text ? 'mb-2' : ''}`}
      >
        <Loader2 className="w-full h-full" color={color} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 mt-2 text-center"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Coffee-themed loading spinner
export const CoffeeSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}> = ({ size = 'md', className = '', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
        }}
        className={`${sizeClasses[size]} ${text ? 'mb-3' : ''}`}
      >
        <Coffee className="w-full h-full text-amber-600" />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 text-center"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Progress bar component
export const ProgressBar: React.FC<{
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
}> = ({ progress, className = '', showPercentage = true, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">Progress</span>
        {showPercentage && (
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Skeleton component with shimmer effect
export const Skeleton: React.FC<{
  className?: string;
  width?: string;
  height?: string;
  shimmer?: boolean;
}> = ({ className = '', width = 'w-full', height = 'h-4', shimmer = true }) => (
  <div className={`${width} ${height} ${className} relative overflow-hidden bg-gray-200 rounded`}>
    {shimmer && (
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white to-transparent"
        animate={{ translateX: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    )}
  </div>
);

// Product skeleton
export const ProductSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
    <Skeleton className="w-full h-48 rounded-lg" />
    <Skeleton className="w-3/4 h-6" />
    <Skeleton className="w-1/2 h-4" />
    <Skeleton className="w-1/3 h-4" />
    <div className="flex space-x-2">
      <Skeleton className="w-20 h-8 rounded" />
      <Skeleton className="w-20 h-8 rounded" />
    </div>
  </div>
);

// Form skeleton
export const FormSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="w-full h-12 rounded-lg" />
    <Skeleton className="w-full h-12 rounded-lg" />
    <Skeleton className="w-full h-12 rounded-lg" />
    <Skeleton className="w-1/2 h-10 rounded" />
  </div>
);

// Page loading component with progress
export const PageLoading: React.FC<{ 
  message?: string;
  progress?: number;
  showProgress?: boolean;
}> = ({ 
  message = 'Loading your coffee experience...',
  progress,
  showProgress = false
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center max-w-md mx-auto px-4">
      <CoffeeSpinner size="xl" className="mx-auto mb-6" />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-4"
      >
        {message}
      </motion.p>
      
      {showProgress && progress !== undefined && (
        <div className="mb-6">
          <ProgressBar progress={progress} className="max-w-xs mx-auto" />
        </div>
      )}
      
      <div className="flex justify-center space-x-2">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 bg-amber-500 rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 bg-amber-500 rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 bg-amber-500 rounded-full"
        />
      </div>
    </div>
  </div>
);

// Enhanced button loading state
export const LoadingButton: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  loadingText?: string;
  icon?: React.ReactNode;
}> = ({ 
  loading, 
  children, 
  className = '', 
  disabled, 
  onClick, 
  loadingText,
  icon
}) => (
  <button
    onClick={onClick}
    disabled={loading || disabled}
    className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${className}`}
  >
    {loading ? (
      <>
        <LoadingSpinner size="sm" className="mr-2" />
        {loadingText || children}
      </>
    ) : (
      <>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </>
    )}
  </button>
);

// Payment processing component
export const PaymentProcessing: React.FC<{
  step: 'creating-order' | 'processing-payment' | 'verifying' | 'complete';
  progress?: number;
}> = ({ step, progress }) => {
  const steps = {
    'creating-order': { text: 'Creating your order...', icon: ShoppingCart },
    'processing-payment': { text: 'Processing payment...', icon: CreditCard },
    'verifying': { text: 'Verifying payment...', icon: CheckCircle },
    'complete': { text: 'Payment successful!', icon: CheckCircle },
  };

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-primary"
      >
        <Icon className="w-12 h-12" />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg font-medium text-gray-700"
      >
        {currentStep.text}
      </motion.p>
      
      {progress !== undefined && (
        <div className="w-full max-w-xs">
          <ProgressBar progress={progress} />
        </div>
      )}
      
      <div className="flex space-x-1">
        {Object.keys(steps).map((key, index) => (
          <motion.div
            key={key}
            className={`w-2 h-2 rounded-full ${
              Object.keys(steps).indexOf(step) >= index ? 'bg-primary' : 'bg-gray-300'
            }`}
            animate={{
              scale: step === key ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>
    </div>
  );
};

// Infinite scroll loading
export const InfiniteScrollLoading: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <LoadingSpinner size="md" className="mx-auto mb-3" />
      <span className="text-gray-600 text-sm">
        Loading more products...
      </span>
    </div>
  </div>
);

// Search loading
export const SearchLoading: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <CoffeeSpinner size="md" className="mx-auto mb-3" />
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Searching for your perfect coffee...
      </p>
    </div>
  </div>
);

// Cart loading
export const CartLoading: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
      <Skeleton className="w-16 h-16 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <Skeleton className="w-20 h-8 rounded" />
    </div>
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
      <Skeleton className="w-16 h-16 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <Skeleton className="w-20 h-8 rounded" />
    </div>
  </div>
);

// Order loading
export const OrderLoading: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <Skeleton className="w-1/3 h-6 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-2/3 h-4" />
              <Skeleton className="w-1/2 h-3" />
            </div>
            <Skeleton className="w-16 h-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Loading overlay with blur effect
export const LoadingOverlay: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  message?: string;
  blur?: boolean;
}> = ({ loading, children, message = 'Loading...', blur = true }) => (
  <div className="relative">
    {children}
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 flex items-center justify-center z-50 ${
            blur ? 'backdrop-blur-sm' : ''
          } bg-white/80 dark:bg-gray-900/80`}
        >
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Step-by-step progress indicator
export const StepProgress: React.FC<{
  steps: string[];
  currentStep: number;
  className?: string;
}> = ({ steps, currentStep, className = '' }) => (
  <div className={`flex items-center justify-between ${className}`}>
    {steps.map((step, index) => (
      <div key={index} className="flex items-center">
        <div className="flex flex-col items-center">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index <= currentStep
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
            animate={{
              scale: index === currentStep ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {index < currentStep ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </motion.div>
          <span className="text-xs text-gray-600 mt-1 text-center max-w-20">
            {step}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div
            className={`w-16 h-0.5 mx-2 ${
              index < currentStep ? 'bg-primary' : 'bg-gray-200'
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

// Default export for backward compatibility
export default {
  LoadingSpinner,
  CoffeeSpinner,
  ProgressBar,
  Skeleton,
  ProductSkeleton,
  FormSkeleton,
  PageLoading,
  LoadingButton,
  PaymentProcessing,
  InfiniteScrollLoading,
  SearchLoading,
  CartLoading,
  OrderLoading,
  LoadingOverlay,
  StepProgress,
}; 