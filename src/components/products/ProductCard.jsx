// src/components/products/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { user } = useAuth();
  const isOutOfStock = product.stock === 0;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleWishlistToggle = () => {
    if (!user) {
      alert('Please login to manage your wishlist');
      return;
    }

    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="card h-100 product-card shadow-sm">
      <div className="position-relative">
        <img
          src={product.image}
          className="card-img-top"
          alt={product.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        
        {/* Wishlist Button */}
        <button
          className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle"
          onClick={handleWishlistToggle}
          style={{ width: '40px', height: '40px' }}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? (
            <i className="bi bi-heart-fill text-danger"></i>
          ) : (
            <i className="bi bi-heart text-muted"></i>
          )}
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
            <span className="badge bg-danger fs-6">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate" title={product.title}>
          {product.title}
        </h5>
        
        <p className="card-text text-muted flex-grow-1 small">
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description
          }
        </p>
        
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="h5 text-primary mb-0">₹{product.price}</span>
          <small className="text-muted">
            Stock: {product.stock}
          </small>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <span className="text-warning">⭐ {product.rating?.rate || 0}</span>
            <small className="text-muted ms-1">({product.rating?.count || 0})</small>
          </div>
          <span className="badge bg-secondary">{product.category}</span>
        </div>

        <div className="d-flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="btn btn-outline-primary flex-fill"
          >
            View Details
          </Link>
          <button
            className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;