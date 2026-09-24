import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useCart } from '../context/CartContextOptimized';
import { useUser } from '../context/UserContext';
import Logo from './Logo';

const HeaderTechForward: React.FC = () => {
  const { state: cartState } = useCart();
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  
  // Handle scroll effect - enhanced for tech-forward feel
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    navigate('/account');
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

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/insights', label: 'Insights' },
    { to: '/testimonials', label: 'Reviews' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-soft'
            : 'bg-white border-b border-border'
        }`}
        style={{
          backdropFilter: isScrolled ? 'saturate(180%) blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'saturate(180%) blur(20px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="group flex items-center" 
              onClick={handleMobileNavClick}
              data-testid="header-logo"
            >
              <Logo size="medium" compact className="transition-all duration-300 group-hover:scale-105" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-all duration-300 ease-out group rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`Navigate to ${item.label} page`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Icon (Desktop) */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Search products"
                data-testid="search-button"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`Shopping cart with ${cartState.itemCount} items`}
                onClick={handleMobileNavClick}
                data-testid="cart-button"
              >
                <ShoppingCart className="h-5 w-5" />
                
                {/* Cart Badge - Tech-forward style */}
                {cartState.itemCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-primary rounded-full shadow-lg animate-scale-in"
                    aria-label={`${cartState.itemCount} items in cart`}
                    data-testid="cart-count"
                  >
                    {cartState.itemCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <button
                onClick={handleUserClick}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={user ? 'Go to account page' : 'Sign in or create account'}
                data-testid="user-button"
              >
                <User className="h-5 w-5" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={handleMobileMenuToggle}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                data-testid="mobile-menu-button"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay - Full Screen */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="fixed inset-0 z-40 lg:hidden bg-white"
          role="navigation"
          aria-label="Mobile navigation menu"
          aria-hidden="false"
          style={{ top: '80px' }}
        >
          <div className="h-full overflow-y-auto px-6 py-8">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block py-4 text-2xl font-heading font-bold text-foreground hover:text-primary transition-colors duration-300 border-b border-border/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  onClick={handleMobileNavClick}
                  aria-label={`Navigate to ${item.label} page`}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}

              {user && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-4 text-2xl font-heading font-bold text-destructive hover:text-destructive/80 transition-colors duration-300 border-b border-border/50 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 rounded"
                  aria-label="Logout from account"
                  data-testid="mobile-logout-button"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderTechForward;
