import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Plus, Check, Eye } from 'lucide-react';
import { useCart } from '../context/CartContextOptimized';
import SteamEffect from './SteamEffect';
import { motion, AnimatePresence } from 'framer-motion';
import CartNotification from './CartNotification';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  badges?: string[];
  description: string;
  category?: 'concentrate' | 'flavored' | 'tea' | 'cold-brew';
  viewMode?: 'grid' | 'list';
  inStock?: boolean;
  weight?: number; // Weight in grams for shipping calculation
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  badges = [],
  description,
  category,
  viewMode = 'grid',
  inStock = true,
  weight = 100, // Default 100g
}) => {
  // Input validation
  if (!id || !name || price < 0 || originalPrice < 0) {
    console.warn('ProductCard: Invalid props provided', { id, name, price, originalPrice });
    return null;
  }
  const { addItem, clearLastAdded, state } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();

  // Memoized calculations for better performance
  const discountPercentage = useMemo(() => 
    Math.round(((originalPrice - price) / originalPrice) * 100), 
    [originalPrice, price]
  );
  
  const savingsAmount = useMemo(() => 
    (originalPrice - price).toFixed(0), 
    [originalPrice, price]
  );
  
  // Check if this item was just added to cart
  const isJustAdded = state.lastAddedItem?.id === id;

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!inStock || isAddingToCart) return; // Prevent double-clicking
    
    setIsAddingToCart(true);
    
    // Add item to cart
    addItem({
      id,
      name,
      price,
      image,
      type: 'single',
    });
    
    // Show notification
    setShowNotification(true);
    
    // Use a single timeout for better performance
    const timeoutId = setTimeout(() => {
      setShowNotification(false);
      clearLastAdded();
      setIsAddingToCart(false);
    }, 3000);
    
    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, [addItem, clearLastAdded, id, name, price, image, inStock, isAddingToCart]);



  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Only navigate if the click is not on a button
    if (!(e.target as HTMLElement).closest('button')) {
      navigate(`/products/${id}`);
    }
  }, [navigate, id]);

  const handleViewCart = useCallback(() => {
    navigate('/cart');
    setShowNotification(false);
    clearLastAdded();
  }, [navigate, clearLastAdded]);

  const handleCloseNotification = useCallback(() => {
    setShowNotification(false);
    clearLastAdded();
  }, [clearLastAdded]);



  if (viewMode === 'list') {
    return (
      <div className="group cursor-pointer" onClick={handleCardClick}>
        <div className="product-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex h-full border border-gray-100">
          {/* Image */}
          <div className="w-48 flex-shrink-0">
            <div className="relative h-32 bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 overflow-hidden">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback to a placeholder image if the main image fails to load
                  e.currentTarget.src = '/placeholder-coffee.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              

            </div>
          </div>
          
          {/* Content */}
          <div className="card-content p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 flex-1 mr-2">{name}</h3>
              <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full flex-shrink-0">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs font-semibold text-gray-700">{rating}</span>
              </div>
            </div>
            
            <p className="description text-gray-600 text-sm mb-3 line-clamp-2 flex-1 leading-relaxed">
              {description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {badges.slice(0, 3).map((badge, badgeIndex) => (
                <span
                  key={`${id}-badge-${badgeIndex}`}
                  className="px-2 py-0.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs font-medium rounded-full border border-green-200"
                >
                  {badge}
                </span>
              ))}
              {badges.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                  +{badges.length - 3}
                </span>
              )}
            </div>
            
            <div className="card-actions flex justify-between items-end mt-auto flex-shrink-0">
              <div className="flex flex-col space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-primary">₹{price}</span>
                  <span className="text-base text-gray-400 line-through">₹{originalPrice}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                    {discountPercentage}% OFF
                  </span>
                  <span className="text-xs text-gray-500">
                    Save ₹{savingsAmount}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {inStock ? (
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center space-x-1 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2.5 rounded-lg hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="font-medium text-sm">Add to Cart</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex items-center space-x-1 bg-gray-300 text-gray-500 px-4 py-2.5 rounded-lg cursor-not-allowed"
                  >
                    <span className="font-medium text-sm">Out of Stock</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Cart Notification */}
      <CartNotification
        isVisible={showNotification}
        productName={name}
        productImage={image}
        quantity={1}
        onClose={handleCloseNotification}
        onViewCart={handleViewCart}
      />
      
      {/* Product Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="group cursor-pointer h-full flex"
        onClick={handleCardClick}
      >
        <div className="product-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full w-full flex flex-col overflow-hidden border border-gray-100">
        {/* Image with coffee grounds background */}
        <div className="relative h-44 bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 flex-shrink-0 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback to a placeholder image if the main image fails to load
              e.currentTarget.src = '/placeholder-coffee.jpg';
            }}
          />
          
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Steam effect for coffee products */}
          {category === 'concentrate' && (
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
              <SteamEffect 
                intensity="light" 
                size="small"
                color="rgba(255, 255, 255, 0.6)"
              />
            </div>
          )}
          

        </div>
        
        {/* Content */}
        <div className="card-content p-4 flex-1 flex flex-col">
          {/* Product Name and Rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 flex-1 mr-2">{name}</h3>
            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full flex-shrink-0">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs font-semibold text-gray-700">{rating}</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="description text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
            {description}
          </p>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-1 mb-3 flex-shrink-0">
            {badges.slice(0, 3).map((badge, badgeIndex) => (
              <span
                key={`${id}-badge-${badgeIndex}`}
                className="px-2 py-0.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs font-medium rounded-full border border-green-200"
              >
                {badge}
              </span>
            ))}
            {badges.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                +{badges.length - 3}
              </span>
            )}
          </div>
          
          <div className="card-actions flex justify-between items-end mt-auto flex-shrink-0">
            {/* Pricing Section */}
            <div className="flex flex-col space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary">₹{price}</span>
                <span className="text-base text-gray-400 line-through">₹{originalPrice}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  {discountPercentage}% OFF
                </span>
                <span className="text-xs text-gray-500">
                  Save ₹{savingsAmount}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              {inStock ? (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex items-center space-x-1 bg-gradient-to-r from-primary to-primary-dark text-white px-3 py-2 rounded-lg hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
                >
                  <AnimatePresence mode="wait">
                    {isAddingToCart ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="cart"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span>{isAddingToCart ? 'Added!' : 'Add to Cart'}</span>
                </motion.button>
              ) : (
                <button
                  disabled
                  className="flex items-center space-x-1 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                >
                  <span>Out of Stock</span>
                </button>
              )}
              
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </>
  );
};

export default ProductCard;