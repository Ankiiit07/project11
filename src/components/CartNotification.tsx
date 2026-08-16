import React, { useEffect, useState } from 'react';
import { CheckCircle, X, ShoppingBag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartNotificationProps {
  isVisible: boolean;
  productName: string;
  productImage: string;
  quantity: number;
  onClose: () => void;
  onViewCart: () => void;
}

const CartNotification: React.FC<CartNotificationProps> = ({
  isVisible,
  productName,
  productImage,
  quantity,
  onClose,
  onViewCart,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0, 
            y: -100, 
            x: '100%',
            scale: 0.8,
            rotateY: -90
          }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            x: 0,
            scale: 1,
            rotateY: 0
          }}
          exit={{ 
            opacity: 0, 
            y: -100, 
            x: '100%',
            scale: 0.8,
            rotateY: 90
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.6
          }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <motion.div
            initial={{ boxShadow: "0 0 0 rgba(139, 115, 85, 0)" }}
            animate={{ 
              boxShadow: isAnimating 
                ? "0 0 20px rgba(139, 115, 85, 0.6)" 
                : "0 0 0 rgba(139, 115, 85, 0)"
            }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Success Header */}
            <motion.div
              initial={{ backgroundColor: "#10B981" }}
              animate={{ backgroundColor: "#059669" }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-green-500 to-green-600 p-4 relative overflow-hidden"
            >
              <motion.div
                animate={{ 
                  scale: isAnimating ? [1, 1.2, 1] : 1,
                  rotate: isAnimating ? [0, 10, -10, 0] : 0
                }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ 
                      scale: isAnimating ? [1, 1.3, 1] : 1,
                      rotate: isAnimating ? [0, 360] : 0
                    }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    <CheckCircle className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Added to Cart!</h3>
                    <p className="text-green-100 text-sm">Item successfully added</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-white hover:text-green-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </motion.div>
              
              {/* Animated background elements */}
              <motion.div
                animate={{ 
                  x: isAnimating ? [0, 100, 0] : 0,
                  opacity: isAnimating ? [0, 1, 0] : 0
                }}
                transition={{ duration: 1, repeat: 2 }}
                className="absolute top-0 right-0 w-20 h-20 opacity-20"
              >
                <Sparkles className="w-full h-full text-white" />
              </motion.div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-4"
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ 
                    scale: isAnimating ? [1, 1.1, 1] : 1,
                    rotate: isAnimating ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative"
                >
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-gray-100"
                  />
                  <motion.div
                    animate={{ 
                      scale: isAnimating ? [0, 1.5, 1] : 1,
                      opacity: isAnimating ? [1, 0] : 0
                    }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="cart-badge"
                  >
                    {quantity}
                  </motion.div>
                </motion.div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                    {productName}
                  </h4>
                  <p className="text-gray-600 text-xs mt-1">
                    Quantity: {quantity}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex space-x-2 mt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onViewCart}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>View Cart</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Continue
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-1 bg-gradient-to-r from-green-500 to-green-600 origin-left"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartNotification; 