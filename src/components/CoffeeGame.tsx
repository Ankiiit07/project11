import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Thermometer, Droplets, Milk, Sparkles, CheckCircle, ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContextOptimized';
import { useNavigate } from 'react-router-dom';

interface GameState {
  step: number;
  userType: 'first-time' | 'existing' | null;
  temperature: 'hot' | 'cold' | null;
  ingredient: 'water' | 'milk' | 'flavors' | null;
  sugar: 'no-sugar' | 'sugar' | null;
  isComplete: boolean;
}

interface CoffeeRecommendation {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  benefits: string[];
}

const CoffeeGame: React.FC = () => {
  const { dispatch: cartDispatch } = useCart();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    step: 0,
    userType: null,
    temperature: null,
    ingredient: null,
    sugar: null,
    isComplete: false,
  });

  const [recommendation, setRecommendation] = useState<CoffeeRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    {
      id: 'userType',
      title: 'Are you a coffee enthusiast?',
      subtitle: 'Let\'s find your perfect coffee match!',
      options: [
        { value: 'first-time', label: 'First Time Coffee User', icon: Coffee, color: 'from-amber-500 to-amber-700' },
        { value: 'existing', label: 'Existing Coffee User', icon: Coffee, color: 'from-orange-500 to-red-600' }
      ]
    },
    {
      id: 'temperature',
      title: 'What temperature do you prefer?',
      subtitle: 'Hot or cold, we\'ve got you covered!',
      options: [
        { value: 'hot', label: 'Hot Coffee', icon: Thermometer, color: 'from-red-500 to-orange-600' },
        { value: 'cold', label: 'Cold Coffee', icon: Droplets, color: 'from-amber-500 to-amber-700' }
      ]
    },
    {
      id: 'ingredient',
      title: 'How do you like your coffee?',
      subtitle: 'Choose your preferred base ingredient',
      options: [
        { value: 'water', label: 'With Water', icon: Droplets, color: 'from-amber-500 to-amber-700' },
        { value: 'milk', label: 'With Milk', icon: Milk, color: 'from-yellow-500 to-orange-600' },
        { value: 'flavors', label: 'Added Flavors', icon: Sparkles, color: 'from-purple-500 to-pink-600' }
      ]
    },
    {
      id: 'sugar',
      title: 'Sugar preference?',
      subtitle: 'Sweet or sugar-free?',
      options: [
        { value: 'no-sugar', label: 'No Sugar', icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
        { value: 'sugar', label: 'With Sugar', icon: Sparkles, color: 'from-pink-500 to-rose-600' }
      ]
    }
  ];

  const recommendations: Record<string, CoffeeRecommendation> = {
    'first-time-hot-water-no-sugar': {
      id: 'americano-no-sugar',
      name: 'Cafe at Once Americano',
      description: 'Perfect for first-time coffee drinkers! A smooth, balanced Americano with no sugar.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
      price: 199,
      benefits: ['Low acidity', 'Smooth taste', 'No sugar', 'Perfect introduction to coffee']
    },
    'first-time-hot-water-sugar': {
      id: 'americano-sugar',
      name: 'Cafe at Once Americano',
      description: 'A gentle introduction to coffee with a touch of sweetness.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
      price: 199,
      benefits: ['Smooth taste', 'Light sweetness', 'Easy to drink', 'Great for beginners']
    },
    'first-time-hot-milk-no-sugar': {
      id: 'latte-no-sugar',
      name: 'Cafe at Once Latte',
      description: 'Creamy and smooth latte perfect for coffee newcomers.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg',
      price: 199,
      benefits: ['Creamy texture', 'Mild coffee taste', 'No sugar', 'Smooth introduction']
    },
    'first-time-hot-milk-sugar': {
      id: 'latte-sugar',
      name: 'Cafe at Once Latte',
      description: 'A sweet and creamy introduction to the world of coffee.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg',
      price: 199,
      benefits: ['Creamy and sweet', 'Mild coffee flavor', 'Easy to enjoy', 'Perfect starter']
    },
    'first-time-hot-flavors-no-sugar': {
      id: 'espresso-no-sugar',
      name: 'Cafe at Once Espresso',
      description: 'Flavorful espresso with natural extracts, no sugar needed.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751608473/Frame_33_oyik7i.png',
      price: 379,
      benefits: ['Rich flavors', 'Natural extracts', 'No sugar', 'Bold taste']
    },
    'first-time-hot-flavors-sugar': {
      id: 'espresso-sugar',
      name: 'Cafe at Once Espresso',
      description: 'Sweet and flavorful espresso with natural extracts.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751608473/Frame_33_oyik7i.png',
      price: 379,
      benefits: ['Rich flavors', 'Natural sweetness', 'Bold taste', 'Flavorful experience']
    },
    'first-time-cold-water-no-sugar': {
      id: 'tea-coffee-no-sugar',
      name: 'Cafe at Once Tea & Coffee',
      description: 'Refreshing cold brew perfect for first-time coffee drinkers.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      price: 199,
      benefits: ['Low acidity', 'Smooth cold brew', 'No sugar', 'Refreshing taste']
    },
    'first-time-cold-water-sugar': {
      id: 'tea-coffee-sugar',
      name: 'Cafe at Once Tea & Coffee',
      description: 'Sweet and refreshing cold brew for beginners.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      price: 199,
      benefits: ['Refreshing', 'Natural sweetness', 'Smooth taste', 'Perfect cold drink']
    },
    'first-time-cold-milk-no-sugar': {
      id: 'cold-brew-no-sugar',
      name: 'Cafe at Once Cold Brew II',
      description: 'Creamy cold brew with milk, perfect for newcomers.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      price: 199,
      benefits: ['Creamy texture', 'Smooth cold brew', 'No sugar', 'Rich taste']
    },
    'first-time-cold-milk-sugar': {
      id: 'cold-brew-sugar',
      name: 'Cafe at Once Cold Brew II',
      description: 'Sweet and creamy cold brew with milk for beginners.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      price: 199,
      benefits: ['Creamy and sweet', 'Smooth cold brew', 'Rich flavor', 'Perfect cold drink']
    },
    'first-time-cold-flavors-no-sugar': {
      id: 'mocha-no-sugar',
      name: 'Cafe at Once Mocha',
      description: 'Flavorful cold coffee with natural cocoa, no sugar.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
      price: 199,
      benefits: ['Rich cocoa flavor', 'Natural extracts', 'No sugar', 'Bold cold taste']
    },
    'first-time-cold-flavors-sugar': {
      id: 'mocha-sugar',
      name: 'Cafe at Once Mocha',
      description: 'Sweet and flavorful cold coffee with natural cocoa.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
      price: 199,
      benefits: ['Rich cocoa flavor', 'Natural sweetness', 'Bold taste', 'Perfect cold treat']
    },
    'existing-hot-water-no-sugar': {
      id: 'americano-no-sugar',
      name: 'Cafe at Once Americano',
      description: 'Classic Americano for experienced coffee lovers.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
      price: 199,
      benefits: ['Classic taste', 'Strong flavor', 'No sugar', 'Pure coffee experience']
    },
    'existing-hot-water-sugar': {
      id: 'americano-sugar',
      name: 'Cafe at Once Americano',
      description: 'Classic Americano with a touch of sweetness.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
      price: 199,
      benefits: ['Classic taste', 'Light sweetness', 'Strong flavor', 'Balanced experience']
    },
    'existing-hot-milk-no-sugar': {
      id: 'latte-no-sugar',
      name: 'Cafe at Once Latte',
      description: 'Creamy latte for experienced coffee drinkers.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg',
      price: 199,
      benefits: ['Creamy texture', 'Rich coffee taste', 'No sugar', 'Smooth experience']
    },
    'existing-hot-milk-sugar': {
      id: 'latte-sugar',
      name: 'Cafe at Once Latte',
      description: 'Sweet and creamy latte for coffee enthusiasts.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg',
      price: 199,
      benefits: ['Creamy and sweet', 'Rich coffee flavor', 'Smooth experience', 'Perfect balance']
    },
    'existing-hot-flavors-no-sugar': {
      id: 'espresso-no-sugar',
      name: 'Cafe at Once Espresso',
      description: 'Bold espresso with natural extracts for coffee connoisseurs.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751608473/Frame_33_oyik7i.png',
      price: 379,
      benefits: ['Bold flavors', 'Natural extracts', 'No sugar', 'Intense experience']
    },
    'existing-hot-flavors-sugar': {
      id: 'espresso-sugar',
      name: 'Cafe at Once Espresso',
      description: 'Sweet and bold espresso with natural extracts.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751608473/Frame_33_oyik7i.png',
      price: 379,
      benefits: ['Bold flavors', 'Natural sweetness', 'Intense taste', 'Rich experience']
    },
    'existing-cold-water-no-sugar': {
      id: 'tea-coffee-no-sugar',
      name: 'Cafe at Once Tea & Coffee',
      description: 'Refreshing cold brew for experienced coffee lovers.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      price: 199,
      benefits: ['Low acidity', 'Smooth cold brew', 'No sugar', 'Refreshing taste']
    },
    'existing-cold-water-sugar': {
      id: 'tea-coffee-sugar',
      name: 'Cafe at Once Tea & Coffee',
      description: 'Sweet and refreshing cold brew with natural flavors.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      price: 199,
      benefits: ['Refreshing', 'Natural sweetness', 'Smooth taste', 'Perfect cold drink']
    },
    'existing-cold-milk-no-sugar': {
      id: 'cold-brew-no-sugar',
      name: 'Cafe at Once Cold Brew II',
      description: 'Creamy cold brew with milk, no sugar needed.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      price: 199,
      benefits: ['Creamy texture', 'Smooth cold brew', 'No sugar', 'Rich taste']
    },
    'existing-cold-milk-sugar': {
      id: 'cold-brew-sugar',
      name: 'Cafe at Once Cold Brew II',
      description: 'Sweet and creamy cold brew with milk.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      price: 199,
      benefits: ['Creamy and sweet', 'Smooth cold brew', 'Rich flavor', 'Perfect cold drink']
    },
    'existing-cold-flavors-no-sugar': {
      id: 'mocha-no-sugar',
      name: 'Cafe at Once Mocha',
      description: 'Flavorful cold coffee with natural cocoa, no sugar.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
      price: 199,
      benefits: ['Rich cocoa flavor', 'Natural extracts', 'No sugar', 'Bold cold taste']
    },
    'existing-cold-flavors-sugar': {
      id: 'mocha-sugar',
      name: 'Cafe at Once Mocha',
      description: 'Sweet and flavorful cold coffee with natural cocoa.',
      image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
      price: 199,
      benefits: ['Rich cocoa flavor', 'Natural sweetness', 'Bold taste', 'Perfect cold treat']
    }
  };

  const handleOptionSelect = (value: string) => {
    const currentStep = steps[gameState.step];
    
    if (!currentStep) {
      setError('Invalid step. Please restart the game.');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    setGameState(prev => {
      const newState = { ...prev };
      
      switch (currentStep.id) {
        case 'userType':
          newState.userType = value as 'first-time' | 'existing';
          break;
        case 'temperature':
          newState.temperature = value as 'hot' | 'cold';
          break;
        case 'ingredient':
          newState.ingredient = value as 'water' | 'milk' | 'flavors';
          break;
        case 'sugar':
          newState.sugar = value as 'no-sugar' | 'sugar';
          newState.isComplete = true;
          break;
        default:
          setError('Unknown step. Please restart the game.');
          setIsLoading(false);
          return prev;
      }
      
      // Only increment step if not the final step
      if (currentStep.id !== 'sugar') {
        newState.step = Math.min(newState.step + 1, steps.length - 1);
        setIsLoading(false);
      }
      
      // If this is the final step, generate recommendation immediately
      if (currentStep.id === 'sugar') {
        const key = `${newState.userType}-${newState.temperature}-${newState.ingredient}-${value}`;
        const rec = recommendations[key];
        if (rec) {
          setRecommendation(rec);
        } else {
          // Fallback recommendation if no exact match
          console.warn('No recommendation found for key:', key);
          const fallbackKey = 'first-time-hot-water-no-sugar';
          setRecommendation(recommendations[fallbackKey]);
        }
        setIsLoading(false);
      }
      
      return newState;
    });
  };

  const resetGame = () => {
    setGameState({
      step: 0,
      userType: null,
      temperature: null,
      ingredient: null,
      sugar: null,
      isComplete: false,
    });
    setRecommendation(null);
    setError(null);
    setIsLoading(false);
  };

  const goBack = () => {
    if (gameState.step > 0) {
      setGameState(prev => {
        const newState = {
          ...prev,
          step: prev.step - 1,
          isComplete: false,
        };
        
        // Clear the value for the step we're going back to
        switch (steps[prev.step - 1].id) {
          case 'userType':
            newState.userType = null;
            break;
          case 'temperature':
            newState.temperature = null;
            break;
          case 'ingredient':
            newState.ingredient = null;
            break;
          case 'sugar':
            newState.sugar = null;
            break;
        }
        
        return newState;
      });
      setRecommendation(null);
    }
  };

  const handleAddToCart = () => {
    if (recommendation) {
      cartDispatch({
        type: 'ADD_ITEM',
        payload: {
          id: recommendation.id,
          name: recommendation.name,
          price: recommendation.price,
          image: recommendation.image,
          type: 'single'
        }
      });
    }
  };

  const handleCheckoutNow = () => {
    if (recommendation) {
      // First add to cart
      cartDispatch({
        type: 'ADD_ITEM',
        payload: {
          id: recommendation.id,
          name: recommendation.name,
          price: recommendation.price,
          image: recommendation.image,
          type: 'single'
        }
      });
      
      // Then navigate to checkout
      setTimeout(() => {
        navigate('/checkout');
      }, 100);
    }
  };

  const currentStep = steps[gameState.step];

  // Validate current step
  if (!currentStep) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Game Error</h3>
          <p className="text-gray-600 mb-6">Something went wrong with the game. Please try again.</p>
          <button
            onClick={resetGame}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-300"
          >
            Restart Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          <Coffee className="inline-block w-8 h-8 mr-2 text-primary" />
          Cafe at Once Coffee Game
        </h2>
        <p className="text-lg text-gray-600">
          Discover your perfect coffee match through our interactive game!
        </p>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-700 text-center">{error}</p>
            <button
              onClick={resetGame}
              className="mt-2 mx-auto block bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Restart Game
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-amber-50 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              <span className="text-amber-700">Processing your choice...</span>
            </div>
          </motion.div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">
              {gameState.isComplete ? `Step ${steps.length} of ${steps.length}` : `Step ${gameState.step + 1} of ${steps.length}`}
            </span>
            <span className="text-sm font-medium text-primary">
              {gameState.isComplete ? '100% Complete' : `${Math.round(((gameState.step + 1) / steps.length) * 100)}% Complete`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: gameState.isComplete 
                  ? '100%' 
                  : `${Math.min(((gameState.step + 1) / steps.length) * 100, 100)}%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!gameState.isComplete ? (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStep.title}
              </h3>
              <p className="text-gray-600 mb-8">
                {currentStep.subtitle}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentStep.options.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOptionSelect(option.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOptionSelect(option.value);
                        }
                      }}
                      className={`p-6 rounded-xl border-2 border-gray-200 hover:border-primary transition-all duration-300 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                      aria-label={`Select ${option.label}`}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      <div className="relative z-10">
                        <Icon className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">
                          {option.label}
                        </h4>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {gameState.step > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={goBack}
                  className="mt-8 inline-flex items-center px-4 py-2 text-gray-600 hover:text-primary transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {recommendation && (
                <div className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Your Perfect Coffee Match!
                    </h3>
                    <p className="text-gray-600">
                      Based on your preferences, here's what we recommend:
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <motion.img
                        initial={{ opacity: 0, rotate: -10 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.4 }}
                        src={recommendation.image}
                        alt={recommendation.name}
                        className="w-32 h-32 object-cover rounded-xl shadow-lg"
                      />
                      <div className="flex-1 text-left">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {recommendation.name}
                        </h4>
                        <p className="text-gray-600 mb-4">
                          {recommendation.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-primary">
                            ₹{recommendation.price}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-300 flex items-center"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </motion.button>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCheckoutNow}
                          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Checkout Now
                        </motion.button>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6"
                    >
                      <h5 className="font-semibold text-gray-900 mb-3">Why this coffee is perfect for you:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {recommendation.benefits.map((benefit, index) => (
                          <motion.div
                            key={benefit}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {benefit}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    onClick={resetGame}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300"
                  >
                    Play Again
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoffeeGame; 