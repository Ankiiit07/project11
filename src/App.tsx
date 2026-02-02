import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider } from './context/CartContextOptimized';
import { UserProvider } from './context/UserContext';
// Removed ThemeProvider to disable dark mode completely
// import { ThemeProvider } from './context/ThemeContext';
// Removed SupabaseProvider - using frontend-only approach
import ChatBot from './components/ChatBot';
// Removed SupabaseStatus - using frontend-only approach
import NotificationSystem from './components/NotificationSystem';
import PerformanceMonitor from './components/PerformanceMonitor';
import { queryClient } from './services/apiService';
import { PageLoader } from './components/OptimizedLoader';
import SkipLink from './components/SkipLink';
import LiveRegion from './components/LiveRegion';
import { useDevice } from './hooks/useDevice';
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));

// Add service worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Check if service worker needs update
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
      
      // Only update if there's a new version
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show a subtle notification instead of auto-reload
              console.log('New service worker available');
            }
          });
        }
      });
    } catch (error) {
      console.log('SW registration failed: ', error);
    }
  });
}

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));
const CustomerServicePage = lazy(() => import('./pages/CustomerServicePage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage'));
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const RazorpayTestPage = lazy(() => import('./pages/RazorpayTestPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
// const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage')); //
// const OrderSystemDemo = lazy(() => import('./components/OrderSystemDemo')); //
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const EmailNotificationDemo = lazy(() => import('./components/EmailNotificationDemo'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));



// Scroll to top component
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  const { isMobile } = useDevice();

  return (
    <Router>
      <ErrorBoundary>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {/* ThemeProvider removed */}
            <UserProvider>
              <CartProvider>
              <ScrollToTop />
              <SkipLink />
              {/* <LiveRegion message="" /> */}
              <div className="min-h-screen bg-cream flex flex-col transition-colors duration-300">
                <Header />
                <main id="main-content" className="flex-1 pt-20 pb-8" role="main">
                  <ErrorBoundary>
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/insights" element={<InsightsPage />} />
                        <Route path="/testimonials" element={<TestimonialsPage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/thank-you" element={<ThankYouPage />} />
                        <Route path="/customer-service" element={<CustomerServicePage />} />
                        <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                        <Route path="/return-policy" element={<ReturnPolicyPage />} />
                        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="/razorpay-test" element={<RazorpayTestPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/track" element={<OrderTrackingPage />} />
                        <Route path="/track/:awb" element={<OrderTrackingPage />} />
                        {/*<Route path="/order-demo" element={<OrderSystemDemo />} /> */}
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/sitemap.xml" element={<SitemapPage />} />
                        <Route path="/orders/:id" element={<OrderDetailsPage />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </main>
                <Footer />
                
                {/* Chat Bot */}
                <ChatBot />
                
                {/* WhatsApp removed */}
                
                {/* Notification System */}
                <NotificationSystem />
                
                {/* Performance Monitor */}
                <PerformanceMonitor />
                
                {/* Email Notification Demo - Removed for cleaner UI */}
                {/* <EmailNotificationDemo /> */}
              </div>
            </CartProvider>
          </UserProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
