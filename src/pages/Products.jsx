// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { useProducts } from '../contexts/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import SearchSortBar from '../components/products/SearchSortBar';

const Products = () => {
  const { products: allProducts, categories, fetchProducts, loading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: '',
    page: 1,
    limit: 12
  });

  // Client-side filtering and sorting (like the original code)
  const filterAndSortProducts = () => {
    let filtered = [...allProducts];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category && filters.category !== '') {
      filtered = filtered.filter((product) => product.category === filters.category);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'price':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.rating?.rate || 0) - (a.rating?.rate || 0);
        default:
          return 0;
      }
    });

    // Pagination
    const startIndex = (currentPage - 1) * filters.limit;
    const endIndex = startIndex + filters.limit;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    setFilteredProducts(paginatedProducts);
    setTotalPages(Math.ceil(filtered.length / filters.limit));
  };

  // Use client-side filtering instead of server-side
  useEffect(() => {
    filterAndSortProducts();
  }, [allProducts, filters, currentPage]);

  const handleSearch = (search) => {
    setFilters(prev => ({ ...prev, search }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, category }));
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setFilters(prev => ({ ...prev, sort }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Our Products</h1>
          
          <SearchSortBar
            categories={categories}
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            currentFilters={filters}
          />

          {/* Products Count */}
          <div className="mb-3">
            <small className="text-muted">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              {allProducts.length > 0 && ` of ${allProducts.length}`}
            </small>
          </div>

          <ProductGrid
            products={filteredProducts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;