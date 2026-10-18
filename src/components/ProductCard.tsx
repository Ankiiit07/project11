import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Check } from './icons';
import { useCart } from '../context/CartContextOptimized';
import { motion, AnimatePresence } from 'framer-motion';
import CartNotification from './CartNotification';
import { useReviewSummaries } from '../hooks/useReviewSummaries';
import { cld, cldSrcSet } from '../utils/cloudinary';
import { analytics } from '../utils/analytics';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  badges?: string[];
  description: string;
  category?: 'concentrate' | 'flavored' | 'tea' | 'cold-brew' | 'preorder';
  viewMode?: 'grid' | 'list';
  inStock?: boolean;
  weight?: number;
  isPreOrder?: boolean;
  preOrderNote?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  badges = [],
  description,
  category,
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
  const reviewSummary = useReviewSummaries()[id];
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
    analytics.addToCart({ id, name, price });
    
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
        className="relative bg-card border border-foreground/15 overflow-hidden cursor-pointer"
        onClick={handleCardClick}
        data-testid={`product-card-${id}`}
      >
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-0 left-0 z-10 bg-foreground text-background px-2 py-1 sm:px-3 sm:py-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.1em]">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Pre-Order Badge */}
        {isPreOrder && (
          <div className="absolute top-0 right-0 z-10 bg-primary text-white px-2 py-1 sm:px-3 sm:py-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.1em]">
            PRE-ORDER
          </div>
        )}

        {/* Out of Stock Badge */}
        {!inStock && !isPreOrder && (
          <div className="absolute top-0 right-0 z-10 bg-foreground/90 text-white px-2 py-1 sm:px-3 sm:py-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.1em]">
            Out of Stock
          </div>
        )}

        {/* Product Image Container */}
        <div className="relative aspect-square bg-secondary overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" aria-hidden="true" />
          )}
          <img
            src={cld(image, 640)}
            srcSet={cldSrcSet(image, [320, 480, 640])}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
            alt={name}
            decoding="async"
            className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-6 space-y-2 sm:space-y-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            {category && (
              <span className="font-mono text-[10px] sm:text-xs text-foreground/60 uppercase tracking-[0.12em]">
                {category.replace('-', ' ')}
              </span>
            )}
            {/* Only real customer reviews are shown */}
            {reviewSummary?.count ? (
              <div className="flex items-center gap-1" aria-label={`Rated ${reviewSummary.average} out of 5 from ${reviewSummary.count} reviews`}>
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium text-foreground">{reviewSummary.average.toFixed(1)}</span>
                <span className="text-xs text-foreground/60">({reviewSummary.count})</span>
              </div>
            ) : null}
          </div>

          {/* Product Name */}
          <h3 className="font-heading text-sm sm:text-lg font-bold text-foreground line-clamp-2">
            {name}
          </h3>

          {/* Description */}
          {/* Phones show two cards per row, so the description and tags start at sm */}
          <p className="hidden sm:[display:-webkit-box] text-sm text-foreground/70 line-clamp-2">
            {description}
          </p>

          {/* Badges */}
          {badges && badges.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-2">
              {badges.slice(0, 3).map((badge, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 border border-foreground/20 text-foreground/80"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Price & Action */}
          <div className="pt-3 sm:pt-4 border-t border-border flex flex-wrap items-end justify-between gap-2 sm:gap-3">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-lg sm:text-2xl font-bold text-foreground">
                  ₹{price}
                </span>
                {originalPrice > price && (
                  <span className="text-xs sm:text-sm text-foreground/50 line-through">
                    ₹{originalPrice}
                  </span>
                )}
              </div>
              {savingsAmount !== '0' && (
                <p className="font-mono text-xs text-green-700">
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
              className={`shrink-0 whitespace-nowrap flex items-center justify-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded font-medium ${
 inStock
 ? isJustAdded
 ? 'bg-green-700 text-white'
 : isPreOrder
 ? 'bg-primary hover:bg-foreground text-white'
 : 'bg-foreground hover:bg-primary text-background'
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
        {showNotification && (
          <CartNotification
            isVisible={showNotification}
            productName={name}
            productImage={image}
            quantity={1}
            onClose={() => setShowNotification(false)}
            onViewCart={() => navigate('/cart')}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;
