import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Clock, Leaf, Award, ImageIcon, MessageSquare, Send } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContextOptimized';
import ProductCard from '../components/ProductCard';
import { useProductsByCategory } from '../hooks/useProducts';
import ProductImageGallery from '../components/ProductImageGallery';
import SEO from '../components/SEO';
import PageWrapper from '../components/PageWrapper';

const ProductDetailPage: React.FC = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id || '');
  
  // Debug logs removed for production
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('nutrition');
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '', name: '', email: '' });
  
  const { products: relatedProducts } = useProductsByCategory(product?.category || '');

  if (loading) {
    return (
      <PageWrapper padding="medium">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" aria-label="Loading product details"></div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !product) {
    return (
      <PageWrapper padding="medium">
        <SEO 
          title="Product Not Found - @once Business"
          description="The product you're looking for doesn't exist."
        />
        <div className="text-center min-h-[60vh] flex items-center justify-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Product Not Found'}
            </h1>
            <Link to="/products" className="text-primary hover:underline">
              ← Back to Products
            </Link>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const filteredRelatedProducts = relatedProducts
    .filter(p => p.id !== product.id && p.category === product.category)
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
          weight: product.weight || 100, // Include weight for shipping
        },
      });
    }
    
    // Show added message
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout after a brief delay
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 500);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Here you would typically save to wishlist API
  };

  const handleShare = () => {
    const url = `${window.location.origin}/products/${product.id}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Product link copied to clipboard!');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit the review to your API
    // Review submitted successfully
    setShowReviewForm(false);
    setReview({ rating: 5, comment: '', name: '', email: '' });
    alert('Thank you for your review!');
  };

  return (
    <PageWrapper padding="medium">
      <SEO 
        title={`${product.name} - @once Business`}
        description={product.description}
        keywords={`${product.name}, coffee concentrate, premium coffee, ${product.category}`}
        product={{
          name: product.name,
          description: product.description,
          price: product.price,
          currency: "INR",
          images: product.images,
          category: product.category,
          brand: "@once Business",
          rating: product.rating,
          reviewCount: product.reviews,
          availability: "InStock",
          sku: product.id
        }}
        breadcrumbs={[
          { name: "Home", url: "https://tranquil-bonbon-7645e7.netlify.app/" },
          { name: "Products", url: "https://tranquil-bonbon-7645e7.netlify.app/products" },
          { name: product.name, url: `https://tranquil-bonbon-7645e7.netlify.app/product/${product.id}` }
        ]}
      />
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Go to home page"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/products"
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Go to products page"
              >
                Products
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-primary font-medium" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-6">
            {/* Image Gallery with Video */}
            <ProductImageGallery 
              images={product.images || [product.image]} 
              productName={product.name}
              videoUrl={product.video}
            />
            
            {/* Product Badges */}
            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    You save ₹{(product.originalPrice - product.price).toFixed(2)}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  Buy Now
                </button>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleWishlist}
                  className={`flex-1 px-6 py-3 border-2 rounded-lg transition-colors flex items-center justify-center ${
                    isWishlisted 
                      ? 'border-red-500 bg-red-50 text-red-600' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
              </div>
              
              {/* WhatsApp Buy Button */}
              
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900">5 Seconds</span>
                <div className="text-xs text-gray-600">Prep Time</div>
              </div>
              <div className="text-center">
                <Leaf className="h-8 w-8 text-primary mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900">Natural</span>
                <div className="text-xs text-gray-600">No Additives</div>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900">Premium</span>
                <div className="text-xs text-gray-600">Quality</div>
              </div>
            </div>
          </div>
          
          {/* Added to Cart Message */}
          {showAddedMessage && (
            <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-medium">Added to Cart!</span>
              </div>
            </div>
          )}
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-16">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'nutrition', label: 'Nutrition' },
                { id: 'description', label: 'Description' },
                { id: 'ingredients', label: 'Ingredients' },
                { id: 'instructions', label: 'Instructions' },
                { id: 'reviews', label: 'Reviews' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'nutrition' && (
              <div>
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 text-xl mb-2">Nutrition Facts (per 100ml)</h3>
                  <p className="text-gray-600 text-sm">Complete nutritional information for your coffee concentrate</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <div className="text-xl font-bold text-primary">{product.nutrition.energy}</div>
                    <div className="text-sm text-gray-600">Energy (kcal)</div>
                  </div>
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <div className="text-xl font-bold text-primary">{product.nutrition.protein}</div>
                    <div className="text-sm text-gray-600">Protein (g)</div>
                  </div>
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <div className="text-xl font-bold text-primary">{product.nutrition.fat}</div>
                    <div className="text-sm text-gray-600">Fat (g)</div>
                  </div>
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <div className="text-xl font-bold text-primary">{product.nutrition.carbohydrate}</div>
                    <div className="text-sm text-gray-600">Carbohydrate (g)</div>
                  </div>
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <div className="text-xl font-bold text-primary">{product.nutrition.sodium}</div>
                    <div className="text-sm text-gray-600">Sodium (g)</div>
                  </div>
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <div className="text-xl font-bold text-primary">{product.nutrition.cholesterol}</div>
                    <div className="text-sm text-gray-600">Cholesterol (g)</div>
                  </div>
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <div className="text-xl font-bold text-primary">{product.nutrition.caffeine}</div>
                    <div className="text-sm text-gray-600">Caffeine (mg)</div>
                  </div>
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <div className="text-xl font-bold text-primary">{product.nutrition.sugar}</div>
                    <div className="text-sm text-gray-600">Sugar (g)</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {product.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">How to Prepare</h3>
                <ol className="space-y-3">
                  {product.instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-primary text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Customer Reviews</h3>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Write Review
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={review.name}
                            onChange={(e) => setReview({...review, name: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            value={review.email}
                            onChange={(e) => setReview({...review, email: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReview({...review, rating: star})}
                              className={`text-2xl ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                        <textarea
                          value={review.comment}
                          onChange={(e) => setReview({...review, comment: e.target.value})}
                          required
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Share your experience with this product..."
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Submit Review
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Sample Reviews */}
                <div className="space-y-4">
                  {[
                    {
                      name: 'Rajesh Kumar',
                      rating: 5,
                      comment: 'Excellent product! The taste is amazing and it\'s so convenient to use.',
                      date: '2 days ago'
                    },
                    {
                      name: 'Priya Sharma',
                      rating: 4,
                      comment: 'Good quality coffee. Love that it\'s sugar-free and healthy.',
                      date: '1 week ago'
                    }
                  ].map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium text-gray-900">{review.name}</h5>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} {...relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ProductDetailPage;
