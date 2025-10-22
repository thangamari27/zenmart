// src/contexts/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(filters);
      return data;
    } catch (err) {
      console.error('Error in fetchProducts:', err);
      setError(err.message);
      return { products: [], totalCount: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts({ limit: 100 });
      setProducts(data.products || []);
      return data.products || [];
    } catch (err) {
      console.error('Error fetching all products:', err);
      setError(err.message);
      setProducts([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      setCategories([]);
    }
  }, []);

  const getProductById = useCallback(async (id) => {
    try {
      return await productService.getProductById(id);
    } catch (err) {
      console.error('Error getting product by ID:', err);
      setError(err.message);
      return null;
    }
  }, []);

  // Load products on mount only once
  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, [fetchAllProducts, fetchCategories]);

  const value = {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchAllProducts,
    getProductById
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};