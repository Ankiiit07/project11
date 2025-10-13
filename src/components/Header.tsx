import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContextOptimized';
import { useUser } from '../context/UserContext';
import Logo from './Logo';
// import DarkModeToggle from './DarkModeToggle';

const Header: React.FC = () => {
  const { state: cartState } = useCart();
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('#mobile-menu') && !target.closest('[aria-controls="mobile-menu"]')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  const handleUserClick = () => {
    if (user) {
      navigate('/account');
    } else {
      navigate('/account');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-white backdrop-blur-xl border-b border-black/10 shadow-sm'
          : 'bg-white border-b border-black/10'
      }`}
      style={{
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="group" onClick={handleMobileNavClick}>
            <Logo size="medium" compact className="transition-all duration-300 group-hover:scale-105" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/insights', label: 'Insights' },
              { to: '/testimonials', label: 'Reviews' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-out group overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{ color: '#8B7355' }}
                aria-label={`Navigate to ${item.label} page`}
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-[#F5F1EB]">
                  {item.label}
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-all duration-300 ease-out backdrop-blur-sm rounded-lg"
                  style={{
                    backgroundColor: '#8B7355',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                />
              </Link>
            ))}
          </nav>

          {/* Right side - Cart and User */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg transition-all duration-300 ease-out group overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{ color: '#8B7355' }}
              aria-label={`Shopping cart with ${cartState.itemCount} items`}
              onClick={handleMobileNavClick}
            >
              <span className="relative z-10">
                <ShoppingCart className="h-5 w-5 transition-all duration-300 group-hover:scale-105 group-hover:text-[#F5F1EB]" />
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-all duration-300 ease-out rounded-lg"
                style={{
                  backgroundColor: '#8B7355',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />
              
              {/* Cart Item Count */}
              {cartState.itemCount > 0 && (
                <span 
                  className="cart-badge"
                  aria-label={`${cartState.itemCount} items in cart`}
                >
                  {cartState.itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            <button
              onClick={handleUserClick}
              className="relative p-2 rounded-lg transition-all duration-300 ease-out group overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{ color: '#8B7355' }}
              aria-label={user ? 'Go to account page' : 'Sign in or create account'}
            >
              <span className="relative z-10">
                <User className="h-5 w-5 transition-all duration-300 group-hover:scale-105 group-hover:text-[#F5F1EB]" />
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-all duration-300 ease-out rounded-lg"
                style={{
                  backgroundColor: '#8B7355',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={handleMobileMenuToggle}
              className="md:hidden relative p-2 rounded-lg transition-all duration-300 ease-out group overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{ color: '#8B7355' }}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="relative z-10">
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 transition-all duration-300 group-hover:text-[#F5F1EB]" />
                ) : (
                  <Menu className="h-5 w-5 transition-all duration-300 group-hover:text-[#F5F1EB]" />
                )}
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-all duration-300 ease-out rounded-lg"
                style={{
                  backgroundColor: '#8B7355',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />
            </button>

            {/* Dark Mode Toggle removed */}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden border-t border-black/10 py-3 bg-white/90 backdrop-blur-xl rounded-b-xl mx-4 mb-2 shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto"
            role="navigation"
            aria-label="Mobile navigation menu"
            aria-hidden="false"
          >
            <div className="space-y-1 px-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/insights', label: 'Insights' },
                { to: '/testimonials', label: 'Reviews' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative block py-3 px-3 text-sm font-medium rounded-lg transition-all duration-300 group overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  style={{ color: '#8B7355' }}
                  onClick={handleMobileNavClick}
                  aria-label={`Navigate to ${item.label} page`}
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-[#F5F1EB]">
                    {item.label}
                  </span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-all duration-300 ease-out rounded-lg"
                    style={{
                      backgroundColor: '#8B7355',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  />
                </Link>
              ))}

              {user && (
                <button
                  onClick={handleLogout}
                  className="relative block w-full text-left py-3 px-3 text-sm font-medium text-red-600 hover:text-red-700 rounded-lg transition-all duration-300 group overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Logout from account"
                >
                  <span className="relative z-10">Logout</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-all duration-300 ease-out rounded-lg"
                    style={{
                      backgroundColor: '#ffebee',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
