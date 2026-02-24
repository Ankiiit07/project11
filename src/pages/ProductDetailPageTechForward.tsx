import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Plus, Minus, Check, Package, Shield, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProduct, useProductsByCategory } from '../hooks/useProducts';
import { useCart } from '../context/CartContextOptimized';
import ProductCardTechForward from '../components/ProductCardTechForward';

const ProductDetailPageTechForward: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id || '');
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  
  const { products: relatedProducts } = useProductsByCategory(product?.category || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <Link to="/products" className="text-primary hover:text-primary/80 font-medium">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const filteredRelatedProducts = relatedProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          type: 'single',
          weight: product.weight || 100,
        },
      });
    }
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate('/checkout'), 500);
  };

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card border border-border rounded-2xl overflow-hidden aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Category & Stock */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                {product.category?.replace('-', ' ')}
              </span>
              <span className="text-sm px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                In Stock
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-foreground/20'}`}
                    />
                  ))}
                </div>
                <span className="text-foreground/70">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="font-heading text-4xl font-bold text-foreground">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-foreground/50 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-foreground/70 leading-relaxed">
              {product.description}
            </p>

            {/* Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-secondary text-foreground/80 rounded-lg text-sm font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="text-foreground/70 font-medium">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 h-14 px-8 bg-primary hover:bg-primary/90 text-white font-heading font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-14 px-8 bg-secondary hover:bg-secondary/80 text-foreground font-heading font-bold rounded-full border border-border transition-all"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="w-14 h-14 flex items-center justify-center rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {showAddedMessage && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                  <Check className="h-5 w-5" />
                  <span>Added to cart successfully!</span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Truck, text: 'Free Shipping' },
                { icon: Shield, text: 'Secure Payment' },
                { icon: Package, text: 'Easy Returns' },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs text-foreground/70">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div className="border-b border-border mb-6">
            <div className="flex gap-8">
              {['description', 'nutrition', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 font-medium capitalize transition-all relative ${
                    activeTab === tab
                      ? 'text-primary'
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="font-heading text-xl font-bold text-foreground mb-4">Product Description</h3>
                <p className="text-foreground/70 leading-relaxed">{product.description}</p>
              </div>
            )}
            {activeTab === 'nutrition' && (
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-4">Nutrition Facts</h3>
                <p className="text-foreground/70">100% Natural Coffee Concentrate • Sugar Free • Gluten Free</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-4">Customer Reviews</h3>
                <p className="text-foreground/70">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">
              You May Also <span className="text-primary">Like</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelatedProducts.map((relatedProduct) => (
                <ProductCardTechForward key={relatedProduct.id} {...relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPageTechForward;
