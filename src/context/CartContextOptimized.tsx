import React, { createContext, useContext, useReducer, ReactNode, useCallback, useMemo } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'single' | 'subscription';
  weight?: number; // Weight in grams for shipping calculation
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  lastAddedItem?: CartItem;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_SUBSCRIPTION'; payload: string }
  | { type: 'CLEAR_LAST_ADDED' };

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleSubscription: (id: string) => void;
  clearLastAdded: () => void;
  getItemById: (id: string) => CartItem | undefined;
  getItemCount: (id: string) => number;
  hasItems: boolean;
  isEmpty: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

// Optimized cart reducer with O(1) operations where possible
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex !== -1) {
        // Update existing item - O(1) operation
        const newItems = [...state.items];
        const existingItem = newItems[existingItemIndex];
        const newQuantity = existingItem.quantity + 1;
        
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        };
        
        const newTotal = state.total + existingItem.price;
        const newItemCount = state.itemCount + 1;
        
        return {
          ...state,
          items: newItems,
          total: newTotal,
          itemCount: newItemCount,
          lastAddedItem: { ...action.payload, quantity: 1 },
        };
      }
      
      // Add new item - O(1) operation
      const newItem = { ...action.payload, quantity: 1 };
      const newItems = [...state.items, newItem];
      const newTotal = state.total + action.payload.price;
      const newItemCount = state.itemCount + 1;
      
      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
        lastAddedItem: newItem,
      };
    }
    
    case 'REMOVE_ITEM': {
      const itemToRemoveIndex = state.items.findIndex(item => item.id === action.payload);
      
      if (itemToRemoveIndex === -1) return state;
      
      const itemToRemove = state.items[itemToRemoveIndex];
      const newItems = state.items.filter((_, index) => index !== itemToRemoveIndex);
      const newTotal = state.total - (itemToRemove.price * itemToRemove.quantity);
      const newItemCount = state.itemCount - itemToRemove.quantity;
      
      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (itemIndex === -1) return state;
      
      const item = state.items[itemIndex];
      const quantityDiff = action.payload.quantity - item.quantity;
      
      if (quantityDiff === 0) return state; // No change needed
      
      const newItems = [...state.items];
      newItems[itemIndex] = {
        ...item,
        quantity: Math.max(0, action.payload.quantity)
      };
      
      // Remove items with quantity 0
      const filteredItems = newItems.filter(item => item.quantity > 0);
      const newTotal = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemCount = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: filteredItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }
    
    case 'TOGGLE_SUBSCRIPTION': {
      const itemIndex = state.items.findIndex(item => item.id === action.payload);
      
      if (itemIndex === -1) return state;
      
      const item = state.items[itemIndex];
      const newType = item.type === 'single' ? 'subscription' : 'single';
      
      const newItems = [...state.items];
      newItems[itemIndex] = {
        ...item,
        type: newType
      };
      
      return {
        ...state,
        items: newItems,
      };
    }
    
    case 'CLEAR_CART':
      return { 
        items: [], 
        total: 0, 
        itemCount: 0,
        lastAddedItem: undefined,
      };
    
    case 'CLEAR_LAST_ADDED':
      return { ...state, lastAddedItem: undefined };
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Memoized computed values for better performance
  const hasItems = useMemo(() => state.items.length > 0, [state.items.length]);
  const isEmpty = useMemo(() => state.items.length === 0, [state.items.length]);

  // Optimized action creators with useCallback
  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleSubscription = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_SUBSCRIPTION', payload: id });
  }, []);

  const clearLastAdded = useCallback(() => {
    dispatch({ type: 'CLEAR_LAST_ADDED' });
  }, []);

  // Optimized getter functions
  const getItemById = useCallback((id: string) => {
    return state.items.find(item => item.id === id);
  }, [state.items]);

  const getItemCount = useCallback((id: string) => {
    const item = state.items.find(item => item.id === id);
    return item?.quantity || 0;
  }, [state.items]);

  const contextValue: CartContextType = useMemo(() => ({
    state,
    dispatch,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleSubscription,
    clearLastAdded,
    getItemById,
    getItemCount,
    hasItems,
    isEmpty,
  }), [
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleSubscription,
    clearLastAdded,
    getItemById,
    getItemCount,
    hasItems,
    isEmpty,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 