import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Package, LogOut, AlertCircle, CheckCircle, ShoppingBag } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

type Mode = 'login' | 'signup' | 'reset';

const inputClass =
  'w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground';

const Notice: React.FC<{ kind: 'error' | 'success'; children: React.ReactNode }> = ({ kind, children }) => (
  <div
    role={kind === 'error' ? 'alert' : 'status'}
    className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
      kind === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
    }`}
  >
    {kind === 'error' ? <AlertCircle className="h-5 w-5 flex-shrink-0" /> : <CheckCircle className="h-5 w-5 flex-shrink-0" />}
    <span>{children}</span>
  </div>
);

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const ProfileForm: React.FC = () => {
  const { user, updateProfile } = useUser();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, country: 'IN' },
      });
      setMessage({ kind: 'success', text: 'Your details are saved. We will use them to fill in checkout.' });
    } catch (err) {
      setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Could not save your details.' });
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof form, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`profile-${key}`} className="block text-sm font-medium text-foreground/70 mb-2">{label}</label>
      <input id={`profile-${key}`} value={form[key]} onChange={set(key)} className={inputClass} {...props} />
    </div>
  );

  return (
    <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h3 className="font-heading text-xl font-bold text-foreground">Profile Information</h3>
      <div>
        <label className="block text-sm font-medium text-foreground/70 mb-2">Email</label>
        <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
          <Mail className="h-5 w-5 text-foreground/40" />
          <span className="text-foreground">{user?.email}</span>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {field('Name', 'name', { autoComplete: 'name' })}
        {field('Phone', 'phone', { type: 'tel', autoComplete: 'tel', placeholder: '10-digit mobile number' })}
      </div>
      <h4 className="flex items-center gap-2 font-heading font-bold text-foreground pt-2">
        <MapPin className="h-5 w-5 text-primary" /> Delivery address
      </h4>
      {field('Address', 'street', { autoComplete: 'street-address' })}
      <div className="grid sm:grid-cols-3 gap-4">
        {field('City', 'city', { autoComplete: 'address-level2' })}
        {field('State', 'state', { autoComplete: 'address-level1' })}
        {field('Pincode', 'zipCode', { autoComplete: 'postal-code', inputMode: 'numeric', maxLength: 6 })}
      </div>
      {message && <Notice kind={message.kind}>{message.text}</Notice>}
      <button
        type="submit"
        disabled={saving}
        className="h-12 px-8 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-heading font-bold rounded-full transition-all"
      >
        {saving ? 'Saving…' : 'Save details'}
      </button>
    </form>
  );
};

const AccountPageTechForward: React.FC = () => {
  const {
    user, ready, loading, authAvailable, emailVerified,
    login, loginWithGoogle, register, resetPassword, resendVerification, logout,
  } = useUser();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<Mode>(params.get('signup') ? 'signup' : 'login');
  const [formData, setFormData] = useState({
    email: params.get('email') || '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    setError('');
    setInfo('');
  }, [mode]);

  const attempt = async (fn: () => Promise<void>, success?: string) => {
    setError('');
    setInfo('');
    try {
      await fn();
      if (success) setInfo(success);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') attempt(() => login(formData.email, formData.password));
    else if (mode === 'signup') attempt(() => register(formData.name, formData.email, formData.password));
    else attempt(() => resetPassword(formData.email), `If an account exists for ${formData.email}, we've sent a link to reset your password.`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" aria-label="Loading" />
      </div>
    );
  }

  // Signed in: account dashboard
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

          {!emailVerified && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-amber-800 text-sm">
                Please verify your email: we sent a link to <strong>{user.email}</strong>. Verifying also
                connects any orders you placed as a guest with this email.
              </p>
              <button
                onClick={() => attempt(resendVerification, 'Verification email sent. Please check your inbox.')}
                className="text-sm font-medium text-amber-900 underline whitespace-nowrap"
              >
                Resend email
              </button>
            </div>
          )}
          {(error || info) && <div className="mb-6">{error ? <Notice kind="error">{error}</Notice> : <Notice kind="success">{info}</Notice>}</div>}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-heading font-bold text-foreground truncate">{user.name || 'Welcome'}</h2>
                    <p className="text-sm text-foreground/60 truncate">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors">
                    <Package className="h-5 w-5 text-foreground/60" />
                    <span className="text-foreground/80">My Orders</span>
                  </Link>
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
              <ProfileForm />
              <div className="grid sm:grid-cols-2 gap-4">
                <Link to="/orders" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group">
                  <Package className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">View Orders</h3>
                  <p className="text-sm text-foreground/70">Track your orders</p>
                </Link>
                <Link to="/products" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group">
                  <ShoppingBag className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Shop Now</h3>
                  <p className="text-sm text-foreground/70">Explore our coffee collection</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const titles: Record<Mode, [string, string]> = {
    login: ['Welcome Back', 'Sign in to your account'],
    signup: ['Create Account', 'Save your details and track your orders'],
    reset: ['Reset Password', "Enter your email and we'll send you a reset link"],
  };

  // Signed out: sign in / sign up / reset password
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
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">{titles[mode][0]}</h1>
            <p className="text-foreground/70">{titles[mode][1]}</p>
          </div>

          {!authAvailable ? (
            <Notice kind="error">Sign-in isn't available right now. You can still check out as a guest.</Notice>
          ) : (
            <>
              {mode !== 'reset' && (
                <>
                  <button
                    type="button"
                    onClick={() => attempt(loginWithGoogle)}
                    disabled={loading}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-background border border-border hover:bg-secondary disabled:opacity-60 text-foreground font-medium rounded-full transition-all"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>
                  <div className="flex items-center gap-3 my-6 text-xs text-foreground/50">
                    <span className="flex-1 h-px bg-border" /> or <span className="flex-1 h-px bg-border" />
                  </div>
                </>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="account-name" className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <input
                      id="account-name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClass}
                      placeholder="Your name"
                      required
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="account-email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    id="account-email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                {mode !== 'reset' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="account-password" className="block text-sm font-medium text-foreground">Password</label>
                      {mode === 'login' && (
                        <button type="button" onClick={() => setMode('reset')} className="text-xs text-primary hover:text-primary/80 font-medium">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <input
                      id="account-password"
                      type="password"
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      minLength={mode === 'signup' ? 6 : undefined}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={inputClass}
                      placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                      required
                    />
                  </div>
                )}

                {error && <Notice kind="error">{error}</Notice>}
                {info && <Notice kind="success">{info}</Notice>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-heading font-bold rounded-full transition-all"
                >
                  {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            {mode === 'reset' ? (
              <button onClick={() => setMode('login')} className="text-primary hover:text-primary/80 text-sm font-medium">
                Back to sign in
              </button>
            ) : (
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountPageTechForward;
