import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Check, Gift, MessageCircle, Package, Shield, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProduct, useProductsByCategory } from '../hooks/useProducts';
import { useCart } from '../context/CartContextOptimized';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { cld, cldSrcSet, toShareImage } from '../utils/cloudinary';
import ProductReviews, { Stars, useProductReviews } from '../components/ProductReviews';
import { analytics } from '../utils/analytics';
import DeliveryCheck from '../components/DeliveryCheck';
import StickyBuyBar from '../components/StickyBuyBar';
import { DEFAULT_SHIPPING_RATES } from '../utils/shippingCalculator';

const MAX_QUANTITY = 20;
const SWIPE_ROW = 'flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible';

const ProductDetailPage: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { product, loading, error } = useProduct(id || '');
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const buyButtonsRef = useRef<HTMLDivElement>(null);
  
  const { products: relatedProducts } = useProductsByCategory(product?.category || '');
  const { data: reviewData, reload: reloadReviews } = useProductReviews(id || '');
  const reviewSummary = reviewData?.summary;
  const wantsReviews = new URLSearchParams(location.search).has('review');

  const openReviews = () => {
    setActiveTab('reviews');
    setTimeout(() => document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  // "Write a review" links from My Orders land here with ?review=1
  React.useEffect(() => {
    if (wantsReviews && product) openReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsReviews, product?.id]);

  useEffect(() => {
    if (product) analytics.viewItem({ id: product.id, name: product.name, price: product.price, category: product.category });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

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

  const canBuy = product.inStock || Boolean(product.isPreOrder);
  const buyLabel = !canBuy ? 'Out of stock' : product.isPreOrder ? 'Pre-order' : 'Add to Cart';

  const handleAddToCart = () => {
    if (!canBuy) return;
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
    analytics.addToCart({ id: product.id, name: product.name, price: product.price, quantity, category: product.category });
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const handleBuyNow = () => {
    if (!canBuy) return;
    handleAddToCart();
    analytics.beginCheckout([{ id: product.id, name: product.name, price: product.price, quantity }]);
    setTimeout(() => navigate('/checkout'), 500);
  };

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  // Generate SEO-friendly product description
  const seoDescription = `${product.name} — Real brewed Arabica coffee, nitrogen-preserved in a portable press tube. No machine. No fridge. No additives. Ready in 5 seconds. ₹${product.price}`;

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-16">
      <SEO 
        title={`${product.name} — Nitrogen-Preserved Press Tube | Cafe at Once`}
        description={seoDescription}
        url={`https://cafeatonce.com/products/${product.id}`}
        image={toShareImage(product.images?.[0] || product.image)}
        type="product"
        product={{
          name: `Cafe at Once ${product.name} — Nitrogen-Preserved Press Tube`,
          description: seoDescription,
          price: product.price,
          currency: "INR",
          images: product.images || [product.image],
          category: product.category,
          brand: "Cafe at Once",
          // Only genuine, verified-purchase reviews (Google penalises anything else)
          ...(reviewSummary?.count ? { rating: reviewSummary.average, reviewCount: reviewSummary.count } : {}),
          availability: product.isPreOrder ? "PreOrder" : product.inStock ? "InStock" : "OutOfStock",
          sku: product.id
        }}
        breadcrumbs={[
          { name: "Home", url: "https://cafeatonce.com" },
          { name: "Shop", url: "https://cafeatonce.com/products" },
          { name: product.name, url: `https://cafeatonce.com/products/${product.id}` }
        ]}
        howTo={{
          name: "How to Use Cafe at Once Press Tube",
          description: "Make premium brewed coffee anywhere in 5 seconds.",
          totalTime: "PT5S",
          steps: [
            { name: "Remove cap", text: "Peel off the protective cap from the Cafe at Once tube" },
            { name: "Position over cup", text: "Hold the tube over your cup or mug" },
            { name: "Press the tube", text: "Press firmly to dispense the coffee concentrate" },
            { name: "Add water and enjoy", text: "Add 300ml of hot, cold, or room temperature water. Stir and drink." }
          ]
        }}
        faq={[
          {
            question: `How do I use ${product.name}?`,
            answer: "Simply peel off the cap, position over your cup, press firmly to dispense, add 300ml of water (hot, cold, or room temperature), stir and enjoy. Ready in 5 seconds."
          },
          {
            question: "Does it need refrigeration?",
            answer: "No — Cafe at Once tubes are nitrogen-preserved and don't require refrigeration. Store in a cool, dry place for up to 12 months."
          },
          {
            question: "Is it TSA/flight safe?",
            answer: "Yes — Cafe at Once tubes are fully TSA compliant and carry-on safe. Each tube contains 16g of coffee concentrate, well under liquid limits."
          }
        ]}
      />
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
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden aspect-square">
              <img
                src={cld(selectedImage || product.image, 960)}
                srcSet={cldSrcSet(selectedImage || product.image, [480, 720, 960, 1200])}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      (selectedImage || product.image) === img 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={cld(img, 160)}
                      alt={`${product.name} - Image ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
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
              {product.isPreOrder ? (
                <span className="text-sm px-3 py-1 bg-amber-50 text-amber-800 rounded-full font-medium">Pre-order</span>
              ) : product.inStock ? (
                <span className="text-sm px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">In Stock</span>
              ) : (
                <span className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">Out of stock</span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
                {product.name}
              </h1>
              
              {/* Rating: only from real, verified-purchase reviews */}
              {reviewSummary?.count ? (
                <button type="button" onClick={openReviews} className="flex items-center gap-3 hover:opacity-80">
                  <Stars value={reviewSummary.average} size="h-5 w-5" />
                  <span className="text-foreground/70">
                    {reviewSummary.average.toFixed(1)} ({reviewSummary.count} {reviewSummary.count === 1 ? 'review' : 'reviews'})
                  </span>
                </button>
              ) : null}
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
            {product.originalPrice > product.price && (
              <p className="-mt-4 text-sm font-medium text-green-700">You save ₹{product.originalPrice - product.price}</p>
            )}
            {product.isPreOrder && product.preOrderNote && (
              <p className="flex items-center gap-2 text-sm font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <Gift className="h-4 w-4 shrink-0" /> {product.preOrderNote}
              </p>
            )}

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
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))}
                    aria-label="Increase quantity"
                    disabled={quantity >= MAX_QUANTITY}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div ref={buyButtonsRef} className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={!canBuy}
                  className="flex-1 h-14 disabled:bg-foreground/30 disabled:shadow-none disabled:translate-y-0 px-8 bg-primary hover:bg-primary/90 text-white font-heading font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  {canBuy ? 'Buy Now' : 'Out of stock'}
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!canBuy}
                  className="flex-1 h-14 disabled:opacity-50 px-8 bg-secondary hover:bg-secondary/80 text-foreground font-heading font-bold rounded-full border border-border transition-all"
                >
                  {buyLabel}
                </button>
              </div>

              {showAddedMessage && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                  <Check className="h-5 w-5" />
                  <span>Added to cart!</span>
                  <Link to="/cart" className="ml-auto font-medium underline">View cart</Link>
                </div>
              )}

              <DeliveryCheck orderValue={product.price * quantity} preOrder={product.isPreOrder} />
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Truck, text: `Free shipping over ₹${DEFAULT_SHIPPING_RATES.freeShippingThreshold}` },
                { icon: Shield, text: 'Secure UPI & card payment' },
                { icon: Package, text: '7-day returns' },
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
        <div id="product-tabs" className="mb-16 scroll-mt-24">
          <div className="border-b border-border mb-6">
            <div className="flex gap-8">
              {['description', 'how to use', 'reviews'].map((tab) => (
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
            {activeTab === 'how to use' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-4">How to use</h3>
                  <ol className="space-y-3">
                    {product.instructions.map((step, i) => (
                      <li key={i} className="flex gap-3 text-foreground/80">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-4">Ingredients</h3>
                  <ul className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing) => (
                      <li key={ing} className="px-3 py-1.5 bg-secondary rounded-lg text-sm text-foreground/80">{ing}</li>
                    ))}
                  </ul>
                  <a
                    href={`https://wa.me/917979837079?text=${encodeURIComponent(`Hi! I have a question about ${product.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analytics.contact('whatsapp')}
                    className="mt-6 inline-flex items-center gap-2 text-primary font-medium"
                  >
                    <MessageCircle className="h-4 w-4" /> Questions? Ask us on WhatsApp
                  </a>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <ProductReviews productId={product.id} data={reviewData} reload={reloadReviews} />
            )}
          </div>
        </div>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">
              You May Also <span className="text-primary">Like</span>
            </h2>
            <div className={SWIPE_ROW}>
              {filteredRelatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="snap-start shrink-0 w-[75%] sm:w-auto">
                  <ProductCard {...relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <StickyBuyBar
        targetRef={buyButtonsRef}
        name={product.name}
        price={product.price}
        label={buyLabel}
        disabled={!canBuy}
        onAdd={handleAddToCart}
      />
    </div>
  );
};

export default ProductDetailPage;
