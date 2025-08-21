/*
  # Initial Schema for Cafe at Once

  1. New Tables
    - `products` - Coffee products with all details
    - `users` - User profiles and preferences  
    - `orders` - Customer orders and order items
    - `subscriptions` - Recurring coffee subscriptions
    - `cart` - Shopping cart for users and sessions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for public product access
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  original_price decimal(10,2) CHECK (original_price >= 0),
  category text NOT NULL CHECK (category IN ('concentrate', 'tube', 'flavored', 'tea')),
  images text[] NOT NULL DEFAULT '{}',
  main_image text NOT NULL,
  ingredients text[] NOT NULL DEFAULT '{}',
  nutrition jsonb NOT NULL DEFAULT '{}',
  instructions text[] NOT NULL DEFAULT '{}',
  badges text[] DEFAULT '{}',
  rating decimal(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count integer DEFAULT 0 CHECK (review_count >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  weight decimal(8,2) CHECK (weight >= 0),
  dimensions jsonb,
  tags text[] DEFAULT '{}',
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  is_email_verified boolean DEFAULT false,
  addresses jsonb DEFAULT '[]',
  preferences jsonb DEFAULT '{"newsletter": true, "sms_notifications": true, "email_notifications": true}',
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  customer_info jsonb NOT NULL,
  items jsonb NOT NULL,
  subtotal decimal(10,2) NOT NULL CHECK (subtotal >= 0),
  tax decimal(10,2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  shipping decimal(10,2) NOT NULL DEFAULT 0 CHECK (shipping >= 0),
  discount decimal(10,2) DEFAULT 0 CHECK (discount >= 0),
  total decimal(10,2) NOT NULL CHECK (total >= 0),
  payment_method text NOT NULL CHECK (payment_method IN ('online', 'cod')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_details jsonb,
  order_status text DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb NOT NULL,
  tracking_number text,
  estimated_delivery timestamptz,
  actual_delivery timestamptz,
  notes text,
  cancellation_reason text,
  refund_amount decimal(10,2) CHECK (refund_amount >= 0),
  refund_status text DEFAULT 'none' CHECK (refund_status IN ('none', 'requested', 'processing', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  products jsonb NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  next_delivery timestamptz NOT NULL,
  last_delivery timestamptz,
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  discount decimal(5,2) DEFAULT 15 CHECK (discount >= 0 AND discount <= 100),
  shipping_address jsonb NOT NULL,
  payment_method text NOT NULL,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  paused_until timestamptz,
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_id text,
  items jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT cart_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_delivery ON subscriptions(next_delivery);

CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session_id ON cart(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_updated_at ON cart(updated_at);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- Products policies (public read access)
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Products can be managed by admins"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Users policies
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own subscriptions"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Cart policies
CREATE POLICY "Users can manage own cart"
  ON cart
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous users can manage session cart"
  ON cart
  FOR ALL
  USING (session_id IS NOT NULL AND user_id IS NULL);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();