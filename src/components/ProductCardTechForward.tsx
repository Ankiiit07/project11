import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Plus, Check, Eye, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContextOptimized';
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
  category?: 'concentrate' | 'flavored' | 'tea' | 'cold-brew' | 'preorder';
  viewMode?: 'grid' | 'list';
  inStock?: boolean;
  weight?: number;
  isPreOrder?: boolean;
  preOrderNote?: string;
}

const ProductCardTechForward: React.FC<ProductCardProps> = ({
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
  weight = 100,
  isPreOrder = false,
  preOrderNote = '',
}) => {
  if (!id || !name || price < 0 || originalPrice < 0) {
    console.warn('ProductCard: Invalid props provided', { id, name, price, originalPrice });
    return null;
  }

  const { addItem, clearLastAdded, state } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const discountPercentage = useMemo(() => 
    Math.round(((originalPrice - price) / originalPrice) * 100), 
    [originalPrice, price]
  );
  
  const savingsAmount = useMemo(() => 
    (originalPrice - price).toFixed(0), 
    [originalPrice, price]
  );
  
  const isJustAdded = state.lastAddedItem?.id === id;

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!inStock || isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    addItem({
      id,
      name,
      price,
      image,
      type: 'single',
      weight,
    });
    
    setShowNotification(true);
    
    const timeoutId = setTimeout(() => {
      setShowNotification(false);
      clearLastAdded();
      setIsAddingToCart(false);
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, [addItem, clearLastAdded, id, name, price, image, weight, inStock, isAddingToCart]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
      navigate(`/products/${id}`);
    }
  }, [navigate, id]);

  return (
    <>
      <motion.div
        className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-hover"
        onClick={handleCardClick}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        data-testid={`product-card-${id}`}
      >
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-destructive text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {discountPercentage}% OFF
          </div>
        )}

        {/* Pre-Order Badge */}
        {isPreOrder && (
          <div className="absolute top-4 right-4 z-10 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
            PRE-ORDER
          </div>
        )}

        {/* Out of Stock Badge */}
        {!inStock && !isPreOrder && (
          <div className="absolute top-4 right-4 z-10 bg-foreground/90 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            Out of Stock
          </div>
        )}

        {/* Product Image Container */}
        <div className="relative aspect-square bg-secondary overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-secondary animate-pulse" />
          )}
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/products/${id}`);
                }}
                className="bg-white text-foreground px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                data-testid={`quick-view-${id}`}
              >
                <Eye className="h-4 w-4" />
                Quick View
              </button>
            </motion.div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            {category && (
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {category.replace('-', ' ')}
              </span>
            )}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
              <span className="text-xs text-foreground/60">({reviews})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-heading text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>

          {/* Description */}
          <p className="text-sm text-foreground/70 line-clamp-2">
            {description}
          </p>

          {/* Badges */}
          {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.slice(0, 3).map((badge, index) => (
                <span
                  key={index}
                  className="text-xs px-2.5 py-1 bg-secondary/50 text-foreground/80 rounded-full font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Price & Action */}
          <div className="pt-4 border-t border-border flex items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-2xl font-bold text-foreground">
                  ₹{price}
                </span>
                {originalPrice > price && (
                  <span className="text-sm text-foreground/50 line-through">
                    ₹{originalPrice}
                  </span>
                )}
              </div>
              {savingsAmount !== '0' && (
                <p className="text-xs text-green-600 font-medium">
                  Save ₹{savingsAmount}
                </p>
              )}
              {isPreOrder && preOrderNote && (
                <p className="text-xs text-primary font-medium">
                  {preOrderNote}
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAddingToCart}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                inStock
                  ? isJustAdded
                    ? 'bg-green-600 text-white'
                    : isPreOrder
                      ? 'bg-primary hover:bg-primary/90 text-white hover:shadow-lg hover:-translate-y-0.5 ring-2 ring-primary/30'
                      : 'bg-primary hover:bg-primary/90 text-white hover:shadow-lg hover:-translate-y-0.5'
                  : 'bg-foreground/10 text-foreground/40 cursor-not-allowed'
              }`}
              data-testid={`add-to-cart-${id}`}
            >
              {isJustAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Added</span>
                </>
              ) : isPreOrder ? (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Pre-Order</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Cart Notification */}
      <AnimatePresence>
        {showNotification && <CartNotification productName={name} />}
      </AnimatePresence>
    </>
  );
};

export default ProductCardTechForward;
