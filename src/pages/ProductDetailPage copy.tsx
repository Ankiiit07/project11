import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Clock, Leaf, Award } from 'lucide-react';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : null;
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
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
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-cream to-cream-dark rounded-lg p-8">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Product Badges */}
            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white"
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
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <div className="text-sm text-gray-500">
                  <span className="line-through">${(product.price * 1.18).toFixed(2)}</span>
                  <span className="text-primary ml-2">Save 15% with subscription</span>
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
                
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
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
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-16">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'description', label: 'Description' },
                { id: 'ingredients', label: 'Ingredients' },
                { id: 'nutrition', label: 'Nutrition' },
                { id: 'instructions', label: 'Instructions' },
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
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Nutrition Facts (per serving)</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <div className="text-2xl font-bold text-primary">{product.nutrition.calories}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <div className="text-2xl font-bold text-primary">{product.nutrition.caffeine}mg</div>
                    <div className="text-sm text-gray-600">Caffeine</div>
                  </div>
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <div className="text-2xl font-bold text-primary">{product.nutrition.sugar}g</div>
                    <div className="text-sm text-gray-600">Sugar</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">How to Prepare</h3>
                <ol className="space-y-3">
                  {product.instructions.map((instruction, index) => (
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
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} {...relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;