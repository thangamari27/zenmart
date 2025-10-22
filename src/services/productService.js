// src/services/productService.js
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const productService = {
  async getProducts(filters = {}) {
    const { category, search, sort, page = 1, limit = 12 } = filters;
    let url = `${API_BASE}/products?`;
    
    const params = new URLSearchParams();
    
    // Category filter
    if (category && category !== 'all' && category !== '') {
      params.append('category', category);
    }
    
    // Search filter - json-server uses q for global search across all fields
    if (search && search.trim() !== '') {
      params.append('q', search.trim());
    }
    
    // Sorting
    if (sort) {
      if (sort === 'price_desc') {
        params.append('_sort', 'price');
        params.append('_order', 'desc');
      } else if (sort === 'rating') {
        // For rating, we need to sort by rating.rate
        params.append('_sort', 'rating.rate');
        params.append('_order', 'desc');
      } else if (sort === 'title') {
        params.append('_sort', 'title');
        params.append('_order', 'asc');
      } else {
        params.append('_sort', sort);
        params.append('_order', 'asc');
      }
    }
    
    // Pagination
    if (page) params.append('_page', page);
    if (limit) params.append('_limit', limit);
    
    url += params.toString();
    
    console.log('Fetching products from:', url); // Debug log
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      // Get total count for pagination
      const totalCount = response.headers.get('X-Total-Count');
      const data = await response.json();
      
      return {
        products: data,
        totalCount: parseInt(totalCount) || data.length
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return empty results instead of throwing to prevent UI crashes
      return { products: [], totalCount: 0 };
    }
  },

  async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    // For mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct = {
          ...productData,
          id: Date.now().toString(),
          rating: { rate: 0, count: 0 }
        };
        resolve(newProduct);
      }, 500);
    });
  },

  updateProduct: async (productId, productData) => {
    // For mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...productData, id: productId });
      }, 500);
    });
  },

  deleteProduct: async (productId) => {
    // For mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, id: productId });
      }, 500);
    });
  }
};