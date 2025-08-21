import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: "admin" | "customer" | "guest";
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

// App State Interface
export interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Cart state
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;

  // Products state
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  productFilters: {
    category: string;
    search: string;
    minPrice: number;
    maxPrice: number;
    sortBy: string;
  };

  // Orders state
  orders: Order[];
  currentOrder: Order | null;

  // UI state
  ui: {
    sidebarOpen: boolean;
    modalOpen: boolean;
    modalType: string | null;
    theme: 'light' | 'dark';
    notifications: Array<{
      id: string;
      type: 'success' | 'error' | 'info' | 'warning';
      message: string;
      title?: string;
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    }>;
  };

  // Actions
  // User actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;

  // Cart actions
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, quantity: number) => void;
  clearCart: () => void;
  updateCartTotal: () => void;

  // Product actions
  setProducts: (products: Product[]) => void;
  setFeaturedProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  updateProductFilters: (filters: Partial<AppState['productFilters']>) => void;
  clearProductFilters: () => void;

  // Order actions
  setOrders: (orders: Order[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // UI actions
  toggleSidebar: () => void;
  setModalOpen: (open: boolean, type?: string) => void;
  toggleTheme: () => void;
  addNotification: (notification: Omit<AppState['ui']['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  cart: [],
  cartTotal: 0,
  cartCount: 0,
  products: [],
  featuredProducts: [],
  currentProduct: null,
  productFilters: {
    category: '',
    search: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'newest',
  },
  orders: [],
  currentOrder: null,
  ui: {
    sidebarOpen: false,
    modalOpen: false,
    modalType: null,
    theme: 'light' as const,
    notifications: [],
  },
};

// Create store with middleware
export const useAppStore = create<AppState>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => ({
          ...initialState,

          // User actions
          setUser: (user) =>
            set((state) => {
              state.user = user;
              state.isAuthenticated = !!user;
            }),

          setAuthenticated: (isAuthenticated) =>
            set((state) => {
              state.isAuthenticated = isAuthenticated;
            }),

          setLoading: (isLoading) =>
            set((state) => {
              state.isLoading = isLoading;
            }),

          setError: (error) =>
            set((state) => {
              state.error = error;
            }),

          logout: () =>
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
              state.cart = [];
              state.cartTotal = 0;
              state.cartCount = 0;
              state.orders = [];
              state.currentOrder = null;
            }),

          // Cart actions
          addToCart: (item) =>
            set((state) => {
              const existingItem = state.cart.find(
                (cartItem) => cartItem.productId === item.productId
              );

              if (existingItem) {
                existingItem.quantity += item.quantity;
                if (existingItem.quantity > item.stock) {
                  existingItem.quantity = item.stock;
                }
              } else {
                state.cart.push({
                  ...item,
                  id: `${item.productId}-${Date.now()}`,
                });
              }

              get().updateCartTotal();
            }),

          removeFromCart: (id) =>
            set((state) => {
              state.cart = state.cart.filter((item) => item.id !== id);
              get().updateCartTotal();
            }),

          updateCartItem: (id, quantity) =>
            set((state) => {
              const item = state.cart.find((cartItem) => cartItem.id === id);
              if (item) {
                item.quantity = Math.max(0, Math.min(quantity, item.stock));
                if (item.quantity === 0) {
                  state.cart = state.cart.filter((cartItem) => cartItem.id !== id);
                }
              }
              get().updateCartTotal();
            }),

          clearCart: () =>
            set((state) => {
              state.cart = [];
              state.cartTotal = 0;
              state.cartCount = 0;
            }),

          updateCartTotal: () =>
            set((state) => {
              state.cartTotal = state.cart.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              );
              state.cartCount = state.cart.reduce(
                (count, item) => count + item.quantity,
                0
              );
            }),

          // Product actions
          setProducts: (products) =>
            set((state) => {
              state.products = products;
            }),

          setFeaturedProducts: (products) =>
            set((state) => {
              state.featuredProducts = products;
            }),

          setCurrentProduct: (product) =>
            set((state) => {
              state.currentProduct = product;
            }),

          updateProductFilters: (filters) =>
            set((state) => {
              state.productFilters = { ...state.productFilters, ...filters };
            }),

          clearProductFilters: () =>
            set((state) => {
              state.productFilters = initialState.productFilters;
            }),

          // Order actions
          setOrders: (orders) =>
            set((state) => {
              state.orders = orders;
            }),

          setCurrentOrder: (order) =>
            set((state) => {
              state.currentOrder = order;
            }),

          addOrder: (order) =>
            set((state) => {
              state.orders.unshift(order);
            }),

          updateOrderStatus: (orderId, status) =>
            set((state) => {
              const order = state.orders.find((o) => o.id === orderId);
              if (order) {
                order.status = status;
              }
              if (state.currentOrder?.id === orderId) {
                state.currentOrder.status = status;
              }
            }),

          // UI actions
          toggleSidebar: () =>
            set((state) => {
              state.ui.sidebarOpen = !state.ui.sidebarOpen;
            }),

          setModalOpen: (open, type) =>
            set((state) => {
              state.ui.modalOpen = open;
              state.ui.modalType = type || null;
            }),

          toggleTheme: () =>
            set((state) => {
              state.ui.theme = state.ui.theme === 'light' ? 'dark' : 'light';
            }),

          addNotification: (notification) =>
            set((state) => {
              const id = `notification-${Date.now()}-${Math.random()}`;
              // Ensure notifications array exists
              if (!state.ui.notifications) {
                state.ui.notifications = [];
              }
              state.ui.notifications.push({ ...notification, id });
            }),

          removeNotification: (id) =>
            set((state) => {
              state.ui.notifications = state.ui.notifications.filter(
                (notification) => notification.id !== id
              );
            }),

          clearNotifications: () =>
            set((state) => {
              state.ui.notifications = [];
            }),
        })),
        {
          name: 'cafe-at-once-store',
          partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            cart: state.cart,
            ui: {
              theme: state.ui.theme,
            },
          }),
        }
      )
    ),
    {
      name: 'cafe-at-once-store',
    }
  )
);

// Selectors for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);

export const useCart = () => useAppStore((state) => state.cart);
export const useCartTotal = () => useAppStore((state) => state.cartTotal);
export const useCartCount = () => useAppStore((state) => state.cartCount);

export const useProducts = () => useAppStore((state) => state.products);
export const useFeaturedProducts = () => useAppStore((state) => state.featuredProducts);
export const useCurrentProduct = () => useAppStore((state) => state.currentProduct);
export const useProductFilters = () => useAppStore((state) => state.productFilters);

export const useOrders = () => useAppStore((state) => state.orders);
export const useCurrentOrder = () => useAppStore((state) => state.currentOrder);

export const useUI = () => useAppStore((state) => state.ui);
export const useTheme = () => useAppStore((state) => state.ui.theme);
export const useNotifications = () => useAppStore((state) => state.ui.notifications);

// Actions
export const useAppActions = () => useAppStore((state) => ({
  setUser: state.setUser,
  setAuthenticated: state.setAuthenticated,
  setLoading: state.setLoading,
  setError: state.setError,
  logout: state.logout,
  addToCart: state.addToCart,
  removeFromCart: state.removeFromCart,
  updateCartItem: state.updateCartItem,
  clearCart: state.clearCart,
  setProducts: state.setProducts,
  setFeaturedProducts: state.setFeaturedProducts,
  setCurrentProduct: state.setCurrentProduct,
  updateProductFilters: state.updateProductFilters,
  clearProductFilters: state.clearProductFilters,
  setOrders: state.setOrders,
  setCurrentOrder: state.setCurrentOrder,
  addOrder: state.addOrder,
  updateOrderStatus: state.updateOrderStatus,
  toggleSidebar: state.toggleSidebar,
  setModalOpen: state.setModalOpen,
  toggleTheme: state.toggleTheme,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
})); 