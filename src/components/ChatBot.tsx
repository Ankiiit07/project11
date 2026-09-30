import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: string[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string, options?: string[]) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      options,
    };
    setMessages(prev => [...prev, message]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        addBotMessage(
          "Hi! 👋 I'm your Cafe at Once assistant. How can I help you today?",
          [
            "Product Information",
            "Coffee Origins",
            "Health Benefits",
            "Recipe Ideas",
            "How to Use",
            "Pricing & Offers",
            "Shipping & Delivery",
            "Contact Support"
          ]
        );
      }, 500);
    }
  }, [isOpen, messages.length]);

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  };

  const handleBotResponse = (userInput: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const input = userInput.toLowerCase();
      
      if (input.includes('product') || input.includes('coffee') || input.includes('concentrate')) {
        addBotMessage(
          "We offer premium coffee concentrates! ☕\n\n• Cafe at Once Latte - ₹199\n• Cafe at Once Americano - ₹199\n• Cafe at Once Tea & Coffee - ₹199\n• Cafe at Once Mocha - ₹199\n• Cafe at Once Espresso - ₹379\n• Cafe at Once Cold Brew II - ₹199\n\nAll our products are sugar-free, gluten-free, and made from 100% Arabica beans!",
          ["View Products", "Health Benefits", "How to Order", "Coffee Origins"]
        );
      } else if (input.includes('price') || input.includes('cost') || input.includes('offer')) {
        addBotMessage(
          "Our pricing is very affordable! 💰\n\n• Most products: ₹199 each\n• Premium Espresso: ₹379\n• Free shipping on orders above ₹1000\n• Subscribe & Save 15% on every order\n• Special bulk discounts available\n\nWould you like to know about our subscription offers?",
          ["Subscription Details", "Bulk Orders", "Current Offers"]
        );
      } else if (input.includes('shipping') || input.includes('delivery')) {
        addBotMessage(
          "We offer fast and reliable delivery! 🚚\n\n• Standard Delivery: 3-5 business days\n• Express Delivery: 1-2 business days (₹50 extra)\n• Free shipping on orders above ₹1000\n• Cash on Delivery available (₹25 charges)\n• Pan-India delivery\n\nWe serve 50+ cities across India!",
          ["Track Order", "Delivery Areas", "COD Information"]
        );
      } else if (input.includes('health') || input.includes('benefit') || input.includes('sugar') || input.includes('gluten')) {
        addBotMessage(
          "Cafe at Once is India's healthiest coffee! 🌿\n\n✅ 100% Sugar-Free\n✅ Gluten-Free\n✅ No artificial additives\n✅ 100% Natural Arabica beans\n✅ Rich in antioxidants\n✅ Boosts metabolism\n✅ Enhances mental alertness\n✅ Low acidity\n✅ Diabetic-friendly\n✅ Keto-friendly\n\nPerfect for diabetics and health-conscious individuals!",
          ["Nutritional Info", "Diabetic Friendly", "Ingredients", "Coffee Benefits"]
        );
      } else if (input.includes('how') || input.includes('use') || input.includes('prepare')) {
        addBotMessage(
          "Super easy to use! Just 3 steps: 🎯\n\n1️⃣ PEEL - Open the concentrate tube\n2️⃣ PRESS - Squeeze into hot/cold water\n3️⃣ GO - Enjoy perfect coffee in 5 seconds!\n\n• Use 4-6 oz water for strong coffee\n• Use 6-8 oz water for mild coffee\n• Works with hot or cold water\n• No stirring required!\n• Perfect for travel and office\n• No equipment needed!",
          ["Video Tutorial", "Recipe Ideas", "Storage Tips", "Travel Tips"]
        );
      } else if (input.includes('origin') || input.includes('bean') || input.includes('arabica')) {
        addBotMessage(
          "Our coffee comes from the finest Arabica beans! 🌍\n\n• Origin: Premium Arabica beans from Karnataka\n• Altitude: 3,000-5,000 feet above sea level\n• Processing: Natural sun-dried method\n• Roasting: Medium-dark roast for perfect balance\n• Grinding: Fine grind for optimal extraction\n• Packaging: Nitrogen-flushed for freshness\n\nWe source directly from certified organic farms!",
          ["Coffee Regions", "Organic Certification", "Sustainability", "Quality Process"]
        );
      } else if (input.includes('recipe') || input.includes('idea') || input.includes('drink')) {
        addBotMessage(
          "Get creative with our coffee concentrates! 🎨\n\n☕ Classic Americano: 1 tube + hot water\n🥛 Creamy Latte: 1 tube + hot milk + foam\n🍫 Mocha Delight: 1 tube + hot milk + chocolate\n🧊 Iced Coffee: 1 tube + cold water + ice\n🥤 Cold Brew: 1 tube + cold water + overnight\n🍯 Honey Coffee: 1 tube + hot water + honey\n🥥 Coconut Coffee: 1 tube + coconut milk\n\nPerfect for experimenting with flavors!",
          ["More Recipes", "Seasonal Drinks", "Custom Blends", "Video Tutorials"]
        );
      } else if (input.includes('subscription') || input.includes('subscribe') || input.includes('regular')) {
        addBotMessage(
          "Perfect for bulk orders and gifting! 🎁\n\n• Corporate Orders: Special pricing for offices\n• Bulk Discounts: 20% off on orders above ₹5000\n• Gift Boxes: Custom packaging available\n• Event Catering: Perfect for meetings and events\n• Subscription Plans: Regular delivery for offices\n• Custom Branding: Company logo on packaging\n• Gift Cards: Available in various denominations\n\nContact us for corporate inquiries!",
          ["Corporate Plans", "Gift Options", "Bulk Pricing", "Custom Orders"]
        );
      } else {
        addBotMessage(
          "I'd be happy to help! Here are some common topics I can assist with:",
          [
            "Product Information",
            "Coffee Origins",
            "Health Benefits",
            "Recipe Ideas",
            "How to Use",
            "Pricing & Offers",
            "Shipping & Delivery",
            "Contact Support"
          ]
        );
      }
    }, 1000);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addUserMessage(inputValue);
      handleBotResponse(inputValue);
      setInputValue('');
      // Focus back to input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleOptionClick = (option: string) => {
    addUserMessage(option);
    handleBotResponse(option);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus input when opening chat
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  return (
    <div className="chat-bot">
      {/* Chat Toggle Button - positioned above WhatsApp button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-24 right-6 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-40"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        data-testid="chatbot-button"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-40 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Cafe Assistant</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-1"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-64">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  {message.options && (
                    <div className="mt-2 space-y-1">
                      {message.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-1 transition-colors focus:outline-none focus:ring-1 focus:ring-white/50"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                aria-label="Type your message"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;