import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  Leaf,
  Globe,
  Heart,
  Clock,
  Award,
  BookOpen,
  Camera,
  ChefHat,
  Thermometer,
  Timer,
  Droplets,
  Gamepad2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import CoffeeGame from '../components/CoffeeGame';

const InsightsPage: React.FC = () => {
  const [showGame, setShowGame] = useState(false);
  
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const coffeeInsights = [
    {
      id: 1,
      title: 'The Art of Coffee Brewing',
      image:
        'https://res.cloudinary.com/dtcsms7zn/image/upload/v1753112116/%E0%A6%95%E0%A6%AB%E0%A6%BF_%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%B8%E0%A7%8D%E0%A6%A4%E0%A7%81%E0%A6%A4%E0%A6%BF%E0%A6%B0_%E0%A6%9A%E0%A6%BE%E0%A6%B0_%E0%A6%AA%E0%A6%A6%E0%A7%8D%E0%A6%A7%E0%A6%A4%E0%A6%BF_i7hcy6.png',
      description:
        'Discover the perfect balance of time, temperature, and technique that transforms simple coffee beans into an extraordinary experience.',
      category: 'Brewing Techniques',
    },
    {
      id: 2,
      title: 'Coffee Origins Around the World',
      image:
        'https://res.cloudinary.com/dtcsms7zn/image/upload/v1753112821/%E0%A4%95%E0%A5%89%E0%A4%AB%E0%A5%80_%E0%A4%95%E0%A5%80_%E0%A4%89%E0%A4%A4%E0%A5%8D%E0%A4%AA%E0%A4%A4%E0%A5%8D%E0%A4%A4%E0%A4%BF_%E0%A4%AE%E0%A4%BE%E0%A4%A8%E0%A4%9A%E0%A4%BF%E0%A4%A4%E0%A5%8D%E0%A4%B0_wh3t61.png',
      description:
        'From the highlands of Ethiopia to the mountains of Colombia, explore how geography and climate shape the unique flavors in every cup.',
      category: 'Origins & Culture',
    },
    {
      id: 3,
      title: 'The Science of Coffee Extraction',
      image:
        'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751552685/Frame_25_3_zjsnuy.png',
      description:
        'Understanding the chemistry behind coffee extraction helps us achieve the perfect balance of strength, flavor, and aroma in every brew.',
      category: 'Coffee Science',
    },
    {
      id: 4,
      title: 'Sustainable Coffee Farming',
      image:
        'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551122/Frame_27_1_ntpnxq.png',
      description:
        'Learn how sustainable farming practices not only protect our environment but also enhance the quality and flavor of coffee beans.',
      category: 'Sustainability',
    },
  ];

  const coffeeHealthBenefits = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Heart Health',
      description:
        'Studies show that moderate coffee consumption may reduce the risk of heart disease and stroke.',
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Antioxidants',
      description:
        'Coffee is one of the largest sources of antioxidants in the Western diet, helping fight free radicals.',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Mental Alertness',
      description:
        'Caffeine enhances cognitive function, improving focus, alertness, and mental performance.',
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: 'Metabolism Boost',
      description:
        'Coffee can increase metabolic rate and help with fat burning when consumed as part of a healthy lifestyle.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream page-container pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Coffee Insights
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Dive deep into the fascinating world of coffee. From brewing
              techniques to health benefits, discover everything you need to
              know about your favorite beverage.
            </p>
            <div className="absolute -top-4 -right-8 text-[#d4b896] opacity-40">
              <Coffee className="h-12 w-12" />
            </div>
          </div>
        </section>

        {/* Coffee Game Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-8 border border-primary/20"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Gamepad2 className="w-10 h-10 text-primary" />
              </motion.div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Interactive Coffee Game
                      </h2>
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover your perfect coffee match through our interactive Cafe at Once game!
                        Answer a few questions and get personalized coffee recommendations.
                      </p>
            </div>

            {!showGame ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGame(true)}
                  className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Coffee Game
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
                <p className="text-sm text-gray-500 mt-4">
                  Takes only 2 minutes • Get personalized recommendations
                </p>
              </motion.div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <CoffeeGame />
                  <div className="text-center mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowGame(false)}
                      className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                      Back to Insights
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </section>

        {/* Coffee Making Process Section */}
        <section className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Master Coffee Making
            </h2>
            <p className="text-lg text-gray-600">
              Learn the art of brewing different coffee styles with step-by-step
              guides
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Espresso Guide */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300"
            >
              <div className="aspect-video bg-gradient-to-br from-amber-100 to-amber-200 p-6 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751964471/ChatGPT_Image_Jul_8_2025_02_17_16_PM_ovldwl.png"
                  alt="How to make Espresso"
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <ChefHat className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">
                    Brewing Guide
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  How to Make Perfect Espresso
                </h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-primary" />
                    <span>Brew Time: 25-30 seconds</span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 mr-2 text-primary" />
                    <span>Temperature: 90-96°C</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 mr-2 text-primary" />
                    <span>Ratio: 1:2 (coffee:water)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>1.</strong> Use 18-20g of finely ground coffee
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>2.</strong> Tamp evenly with 30lbs pressure
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>3.</strong> Extract for 25-30 seconds
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>4.</strong> Aim for 36-40ml output
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Americano Guide */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751966335/ChatGPT_Image_Jul_8_2025_02_48_36_PM_gvpaxq.png"
                  alt="How to make Americano"
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <ChefHat className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">
                    Brewing Guide
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  How to Make Americano
                </h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-primary" />
                    <span>Total Time: 2-3 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 mr-2 text-primary" />
                    <span>Water Temp: 85-90°C</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 mr-2 text-primary" />
                    <span>Ratio: 1:3 (espresso:water)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>1.</strong> Brew a double shot of espresso
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>2.</strong> Heat water to 85-90°C
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>3.</strong> Add hot water to espresso
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>4.</strong> Adjust strength to taste
                  </p>
                </div>
              </div>
            </div>

            {/* Cold Brew Guide */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300">
              <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 p-6 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751967257/ChatGPT_Image_Jul_8_2025_03_03_52_PM_wgaoj4.png"
                  alt="How to make Cold Brew"
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <ChefHat className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">
                    Brewing Guide
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  How to Make Cold Brew
                </h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-primary" />
                    <span>Steep Time: 12-24 hours</span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 mr-2 text-primary" />
                    <span>Temperature: Room temp/Cold</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 mr-2 text-primary" />
                    <span>Ratio: 1:4 (coffee:water)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>1.</strong> Use coarse ground coffee
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>2.</strong> Mix with cold water
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>3.</strong> Steep for 12-24 hours
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>4.</strong> Strain and serve over ice
                  </p>
                </div>
              </div>
            </div>

            {/* French Press Guide */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 p-6 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1753947296/Screenshot_2025-07-31_at_1.02.39_PM_rri2gb.png"
                  alt="How to make French Press"
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <ChefHat className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">
                    Brewing Guide
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  How to Make French Press
                </h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-primary" />
                    <span>Brew Time: 4 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 mr-2 text-primary" />
                    <span>Temperature: 93-96°C</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 mr-2 text-primary" />
                    <span>Ratio: 1:15 (coffee:water)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>1.</strong> Use coarse ground coffee
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>2.</strong> Add hot water, stir gently
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>3.</strong> Steep for 4 minutes
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>4.</strong> Press plunger down slowly
                  </p>
                </div>
              </div>
            </div>

            {/* Pour Over Guide */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300">
              <div className="aspect-video bg-gradient-to-br from-red-100 to-red-200 p-6 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551560/Frame_21_1_1_wztli7.png"
                  alt="How to make Pour Over"
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <ChefHat className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">
                    Brewing Guide
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  How to Make Pour Over
                </h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-primary" />
                    <span>Brew Time: 3-4 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 mr-2 text-primary" />
                    <span>Temperature: 90-96°C</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 mr-2 text-primary" />
                    <span>Ratio: 1:16 (coffee:water)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>1.</strong> Use medium-fine grind
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>2.</strong> Bloom with 2x coffee weight water
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>3.</strong> Pour in circular motions
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>4.</strong> Complete pour in 3-4 minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Mocha Guide */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300">
              <div className="aspect-video bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751552822/Frame_26_3_bmmwov.png"
                  alt="How to make Mocha"
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <ChefHat className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">
                    Brewing Guide
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  How to Make Mocha
                </h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-primary" />
                    <span>Total Time: 5 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 mr-2 text-primary" />
                    <span>Milk Temp: 65-70°C</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 mr-2 text-primary" />
                    <span>Ratio: 1:1:1 (espresso:chocolate:milk)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>1.</strong> Brew a shot of espresso
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>2.</strong> Add chocolate syrup/powder
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>3.</strong> Steam milk to 65-70°C
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>4.</strong> Pour milk, add whipped cream
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Insights Grid */}
        <section className="mb-16">
          {/* Coffee Wisdom Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Coffee Wisdom
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  quote: 'Life is too short for bad coffee',
                  author: 'Coffee Lover',
                  bgColor: 'from-amber-500 to-amber-600',
                },
                {
                  quote: 'Coffee is a hug in a mug',
                  author: 'Anonymous',
                  bgColor: 'from-brown-500 to-brown-600',
                },
                {
                  quote: 'But first, coffee',
                  author: 'Morning Mantra',
                  bgColor: 'from-orange-500 to-orange-600',
                },
                {
                  quote: 'Coffee: because adulting is hard',
                  author: 'Modern Wisdom',
                  bgColor: 'from-red-500 to-red-600',
                },
                {
                  quote: 'Espresso yourself',
                  author: 'Coffee Pun',
                  bgColor: 'from-purple-500 to-purple-600',
                },
                {
                  quote: 'Coffee is my love language',
                  author: 'Caffeine Addict',
                  bgColor: 'from-pink-500 to-pink-600',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${item.bgColor} text-white p-6 rounded-lg shadow-lg transform hover:scale-105 hover:rotate-1 transition-all duration-500 cursor-pointer group relative overflow-hidden`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                  }}
                >
                  <div className="text-center relative z-10">
                    <div className="text-4xl mb-4 opacity-50 animate-pulse">
                      "
                    </div>
                    <p className="text-lg font-medium mb-4 leading-relaxed">
                      {item.quote}
                    </p>
                    <p className="text-sm opacity-80">— {item.author}</p>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coffee Quote Cards with Images */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
          >
            Coffee Insights & Quotes
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                image:
                  'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551560/Frame_21_1_1_wztli7.png',
                title:
                  'This is why the same beans can taste completely different with just a small ratio tweak.',
                subtitle:
                  "It's not just about strong or weak. It's about reshaping the experience.",
                bgColor: 'bg-gradient-to-br from-gray-800 to-gray-900',
              },
              {
                image:
                  'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751552822/Frame_26_3_bmmwov.png',
                title: "Coffee isn't basic. We've just treated it that way.",
                subtitle: '',
                bgColor: 'bg-gradient-to-br from-gray-900 to-black',
              },
              {
                image:
                  'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751552685/Frame_25_3_zjsnuy.png',
                title:
                  "A lower ratio — less water, more coffee — doesn't just make it stronger.",
                subtitle:
                  'It pushes heavier body. It can taste bolder, sometimes muddier.',
                bgColor: 'bg-gradient-to-br from-gray-700 to-gray-800',
              },
              {
                image:
                  'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551122/Frame_27_1_ntpnxq.png',
                title: 'Once you pay attention, the flavor opens up.',
                subtitle: "Don't just drink it. Taste it.",
                bgColor: 'bg-gradient-to-br from-gray-900 to-black',
              },
              {
                image:
                  'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551560/Frame_21_1_1_wztli7.png',
                title:
                  "Changing your brew ratio doesn't just make coffee stronger or weaker.",
                subtitle: 'It changes what you actually taste.',
                bgColor: 'bg-gradient-to-br from-gray-800 to-gray-900',
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`${card.bgColor} text-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer group relative`}
              >
                <div className="relative h-64">
                  <img
                    src={card.image}
                    alt="Coffee insight"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-lg font-bold mb-2 leading-tight">
                    {card.title}
                  </h3>
                  {card.subtitle && (
                    <p className="text-sm opacity-90 leading-relaxed">
                      {card.subtitle}
                    </p>
                  )}
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          Featured Stories
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coffeeInsights.map((insight, index) => (
            <motion.article
              key={insight.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300"
            >
              <div className="aspect-video bg-gradient-to-br from-cream to-cream-dark p-4">
                <img
                  src={insight.image}
                  alt={insight.title}
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="inline-block bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
                    {insight.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {insight.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
