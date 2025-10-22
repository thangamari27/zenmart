// src/components/products/ProductGrid.jsx
import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ 
  products, 
  currentPage, 
  totalPages, 
  onPageChange,
  loading 
}) => {
  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <span style={{ fontSize: '4rem', color: '#6c757d' }}>🔍</span>
        </div>
        <h4 className="text-muted">No products found</h4>
        <p className="text-muted">Try different search terms or filters</p>
      </div>
    );
  }

  const visiblePages = () => {
    const pages = [];
    const showPages = 3;
    
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div>
      {/* Product Count */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <small className="text-muted">
          Showing {products.length} products • Page {currentPage} of {totalPages}
        </small>
      </div>

      {/* Products Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {products.map(product => (
          <div key={product.id} className="col">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <button
              className={`btn btn-outline-primary ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>

            <div className="d-flex gap-2 flex-wrap justify-content-center">
              {visiblePages().map(page => (
                <button
                  key={page}
                  className={`btn ${
                    page === currentPage ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className={`btn btn-outline-primary ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>

          {/* Page Selector */}
          <div className="text-center mt-3">
            <small className="text-muted me-2">Jump to:</small>
            <select 
              className="form-select form-select-sm d-inline-block w-auto"
              value={currentPage}
              onChange={(e) => onPageChange(Number(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <option key={page} value={page}>
                  Page {page}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;