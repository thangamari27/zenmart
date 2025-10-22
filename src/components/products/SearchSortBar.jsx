// src/components/products/SearchSortBar.jsx
import React, { useState } from 'react';

const SearchSortBar = ({ 
  categories, 
  onSearch, 
  onCategoryChange, 
  onSortChange,
  currentFilters = {}
}) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category || '');
  const [sortBy, setSortBy] = useState(currentFilters.sort || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    onCategoryChange(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSortChange(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('');
    onSearch('');
    onCategoryChange('');
    onSortChange('');
  };

  const hasActiveFilters = searchTerm || selectedCategory || sortBy;

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row g-3">
          {/* Search Input */}
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search products by name, description..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="col-md-7 d-md-none">
            <button
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="bi bi-funnel"></i>
              <span>Filters</span>
            </button>
          </div>

          {/* Filters - Desktop */}
          <div className="col-md-3 d-none d-md-block">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2 d-none d-md-block">
            <select
              className="form-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="">Sort By</option>
              <option value="title">Name A-Z</option>
              <option value="price">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div className="col-md-2 d-none d-md-block">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={handleClear}
              disabled={!hasActiveFilters}
            >
              Clear All
            </button>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="col-12 d-md-none">
              <div className="row g-2">
                <div className="col-6">
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="">Sort By</option>
                    <option value="title">Name A-Z</option>
                    <option value="price">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
                <div className="col-12">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={handleClear}
                    disabled={!hasActiveFilters}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSortBar;