import { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider } from './context/CartContextOptimized';
import { UserProvider } from './context/UserContext';
import HelpButton from './components/HelpButton';
import NotificationSystem from './components/NotificationSystem';
import { PageLoader } from './components/OptimizedLoader';
import SkipLink from './components/SkipLink';
import { lazyPage } from './utils/lazyPage';

// Offline cache for returning visitors (public/sw.js)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Lazy load pages for better performance
const HomePage = lazyPage(() => import('./pages/HomePage'));
const ProductsPage = lazyPage(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazyPage(() => import('./pages/ProductDetailPage'));
const CartPage = lazyPage(() => import('./pages/CartPage'));
const CheckoutPage = lazyPage(() => import('./pages/CheckoutPage'));
const InsightsPage = lazyPage(() => import('./pages/InsightsPage'));
const TestimonialsPage = lazyPage(() => import('./pages/TestimonialsPage'));
const AccountPage = lazyPage(() => import('./pages/AccountPage'));
const AboutPage = lazyPage(() => import('./pages/AboutPage'));
const ContactPage = lazyPage(() => import('./pages/ContactPage'));
const ThankYouPage = lazyPage(() => import('./pages/ThankYouPage'));
const CustomerServicePage = lazyPage(() => import('./pages/CustomerServicePage'));
const ShippingPolicyPage = lazyPage(() => import('./pages/ShippingPolicyPage'));
const ReturnPolicyPage = lazyPage(() => import('./pages/ReturnPolicyPage'));
const TermsConditionsPage = lazyPage(() => import('./pages/TermsConditionsPage'));
const PrivacyPolicyPage = lazyPage(() => import('./pages/PrivacyPolicyPage'));
const RazorpayTestPage = lazyPage(() => import('./pages/RazorpayTestPage'));
const OrdersPage = lazyPage(() => import('./pages/OrdersPage'));
const OrderDetailsPage = lazyPage(() => import('./pages/OrderDetailsPage'));
const OrderTrackingPage = lazyPage(() => import('./pages/OrderTrackingPage'));
const AdminOrdersPage = lazyPage(() => import('./pages/AdminOrdersPage'));
const FAQPage = lazyPage(() => import('./pages/FAQPage'));

// Blog Posts
const NitrogenPreservedCoffee = lazyPage(() => import('./pages/blog/NitrogenPreservedCoffee'));
const BestPortableCoffeeTravellers = lazyPage(() => import('./pages/blog/BestPortableCoffeeTravellers'));
const InstantVsBrewedCoffee = lazyPage(() => import('./pages/blog/InstantVsBrewedCoffee'));
const HowToMakeCoffeeWithoutMachine = lazyPage(() => import('./pages/blog/HowToMakeCoffeeWithoutMachine'));
const WhyArabicaCoffeeMatters = lazyPage(() => import('./pages/blog/WhyArabicaCoffeeMatters'));

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <HelmetProvider>
          {/* Animations follow the visitor's "reduce motion" setting */}
          <MotionConfig reducedMotion="user">
          <UserProvider>
            <CartProvider>
              <ScrollToTop />
              <SkipLink />
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main id="main-content" className="flex-1 pb-8">
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
                  <Route path="/admin" element={<AdminOrdersPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/blog/what-is-nitrogen-preserved-coffee" element={<NitrogenPreservedCoffee />} />
                  <Route path="/blog/best-portable-coffee-travellers-india" element={<BestPortableCoffeeTravellers />} />
                  <Route path="/blog/instant-vs-brewed-coffee-difference" element={<InstantVsBrewedCoffee />} />
                  <Route path="/blog/how-to-make-coffee-without-machine" element={<HowToMakeCoffeeWithoutMachine />} />
                  <Route path="/blog/why-arabica-coffee-matters" element={<WhyArabicaCoffeeMatters />} />
                  <Route path="/orders/:id" element={<OrderDetailsPage />} />
                </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </main>
                <Footer />
                <HelpButton />
                <NotificationSystem />
              </div>
            </CartProvider>
          </UserProvider>
          </MotionConfig>
        </HelmetProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
