// src/contexts/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { localStorageHelper } from '../utils/localStorage';

const CartContext = createContext();

// Cart reducer for state management
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    
    case 'LOAD_WISHLIST':
      return { ...state, wishlist: action.payload };
    
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => 
        item.productId === action.payload.productId
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    case 'ADD_TO_WISHLIST':
      // Check if already in wishlist
      const alreadyInWishlist = state.wishlist.some(item => item.id === action.payload.id);
      if (alreadyInWishlist) {
        return state;
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload)
      };
    
    case 'MOVE_TO_CART':
      // Remove from wishlist and add to cart
      const productToMove = state.wishlist.find(item => item.id === action.payload);
      if (!productToMove) return state;
      
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
        items: [...state.items, {
          productId: productToMove.id,
          name: productToMove.title,
          price: productToMove.price,
          image: productToMove.image,
          stock: productToMove.stock,
          quantity: 1
        }]
      };
    
    default:
      return state;
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    wishlist: [] 
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorageHelper.get('cart') || [];
    const savedWishlist = localStorageHelper.get('userWishlist') || [];
    
    dispatch({ type: 'LOAD_CART', payload: savedCart });
    dispatch({ type: 'LOAD_WISHLIST', payload: savedWishlist });
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorageHelper.set('cart', state.items);
  }, [state.items]);

  useEffect(() => {
    localStorageHelper.set('userWishlist', state.wishlist);
  }, [state.wishlist]);

  const addToCart = (product, quantity = 1) => {
    if (product.stock === 0) {
      throw new Error('Product is out of stock');
    }

    const cartItem = {
      productId: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addToWishlist = (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const isInWishlist = (productId) => {
    return state.wishlist.some(item => item.id === productId);
  };

  const moveToCart = (productId) => {
    dispatch({ type: 'MOVE_TO_CART', payload: productId });
  };

  // Helper functions
  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getWishlistCount = () => {
    return state.wishlist.length;
  };

  const value = {
    // Cart
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    
    // Wishlist
    wishlist: state.wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToCart,
    getWishlistCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};