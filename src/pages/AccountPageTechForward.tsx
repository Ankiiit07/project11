import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Package, LogOut, Settings } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';

const AccountPageTechForward: React.FC = () => {
  const { user, login, logout } = useUser();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(formData.email, formData.password);
    } else {
      login(formData.email, formData.password);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // If user is logged in, show account dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
              My <span className="text-primary">Account</span>
            </h1>
            <p className="text-foreground/70">Manage your profile and orders</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-foreground">{user.name || 'Guest User'}</h2>
                    <p className="text-sm text-foreground/60">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { icon: Package, label: 'Orders', href: '/orders' },
                    { icon: Settings, label: 'Settings', href: '#' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <Icon className="h-5 w-5 text-foreground/60" />
                        <span className="text-foreground/80">{item.label}</span>
                      </Link>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-destructive transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Info */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">Profile Information</h3>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/70 mb-2">Email</label>
                      <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                        <Mail className="h-5 w-5 text-foreground/40" />
                        <span className="text-foreground">{user.email}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/70 mb-2">Phone</label>
                      <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                        <Phone className="h-5 w-5 text-foreground/40" />
                        <span className="text-foreground">{user.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  to="/orders"
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group"
                >
                  <Package className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    View Orders
                  </h3>
                  <p className="text-sm text-foreground/70">Track and manage your orders</p>
                </Link>
                <Link
                  to="/products"
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group"
                >
                  <Package className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    Shop Now
                  </h3>
                  <p className="text-sm text-foreground/70">Explore our coffee collection</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login/Signup Form
  return (
    <div className="min-h-screen bg-background pt-20 pb-16 flex items-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 w-full">
        <motion.div
          className="bg-card border border-border rounded-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-foreground/70">
              {isLogin ? 'Sign in to your account' : 'Sign up for a new account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Your name"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-heading font-bold rounded-full transition-all"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountPageTechForward;
