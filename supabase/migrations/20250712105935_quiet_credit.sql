/*
  # Complete Row Level Security Policies
  
  1. Security Updates
    - Add comprehensive RLS policies for all tables
    - Ensure proper access control for CRUD operations
    - Add admin-specific policies
    - Add public access policies where needed
*/

-- Ensure RLS is enabled on all tables
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cart ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Products can be managed by admins" ON products;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can manage own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart;
DROP POLICY IF EXISTS "Anonymous users can manage session cart" ON cart;

-- Products policies
-- Public can view active products
CREATE POLICY "Products are viewable by everyone" 
  ON products 
  FOR SELECT 
  USING (is_active = true);

-- Admins can perform all operations on products
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
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON users 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON users 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON users 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- Admins can view all users
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

-- Admins can update any user
CREATE POLICY "Admins can update any user" 
  ON users 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Admins can delete users
CREATE POLICY "Admins can delete users" 
  ON users 
  FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Orders policies
-- Users can view their own orders
CREATE POLICY "Users can view own orders" 
  ON orders 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders" 
  ON orders 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own orders (limited operations like cancellation)
CREATE POLICY "Users can update own orders" 
  ON orders 
  FOR UPDATE 
  TO authenticated 
  USING (
    auth.uid() = user_id AND 
    order_status IN ('pending', 'confirmed')
  );

-- Admins can view all orders
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

-- Admins can update any order
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

-- Admins can delete orders
CREATE POLICY "Admins can delete orders" 
  ON orders 
  FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Subscriptions policies
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" 
  ON subscriptions 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Users can create their own subscriptions
CREATE POLICY "Users can create own subscriptions" 
  ON subscriptions 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions" 
  ON subscriptions 
  FOR UPDATE 
  TO authenticated 
  USING (
    auth.uid() = user_id AND 
    status != 'cancelled'
  );

-- Users can delete (cancel) their own subscriptions
CREATE POLICY "Users can delete own subscriptions" 
  ON subscriptions 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Admins can view all subscriptions
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

-- Admins can update any subscription
CREATE POLICY "Admins can update any subscription" 
  ON subscriptions 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Admins can delete any subscription
CREATE POLICY "Admins can delete any subscription" 
  ON subscriptions 
  FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Cart policies
-- Users can view their own cart
CREATE POLICY "Users can view own cart" 
  ON cart 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Users can update their own cart
CREATE POLICY "Users can update own cart" 
  ON cart 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Users can insert into their own cart
CREATE POLICY "Users can insert own cart" 
  ON cart 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own cart
CREATE POLICY "Users can delete own cart" 
  ON cart 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Anonymous users can manage session cart
CREATE POLICY "Anonymous users can view session cart" 
  ON cart 
  FOR SELECT 
  TO public
  USING (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Anonymous users can update session cart" 
  ON cart 
  FOR UPDATE 
  TO public
  USING (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Anonymous users can insert session cart" 
  ON cart 
  FOR INSERT 
  TO public
  WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Anonymous users can delete session cart" 
  ON cart 
  FOR DELETE 
  TO public
  USING (session_id IS NOT NULL AND user_id IS NULL);