// src/pages/Wishlist.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { localStorageHelper } from '../utils/localStorage';

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const userWishlist = localStorageHelper.get('userWishlist') || [];
      const userSpecificWishlist = userWishlist.filter(item => item.userId === user.uid);
      setWishlistItems(userSpecificWishlist);
      setLoading(false);
    }, 500);
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(item => item.productId !== productId);
    setWishlistItems(updatedWishlist);
    
    // Update localStorage
    const allWishlists = localStorageHelper.get('userWishlist') || [];
    const filteredWishlists = allWishlists.filter(item => 
      !(item.userId === user.uid && item.productId === productId)
    );
    localStorageHelper.set('userWishlist', filteredWishlists);
  };

  const moveToCart = (product) => {
    if (product.stock === 0) {
      alert('This product is out of stock and cannot be added to cart.');
      return;
    }

    try {
      addToCart(product, 1);
      removeFromWishlist(product.id);
      alert('Product moved to cart!');
    } catch (error) {
      alert(error.message);
    }
  };

  const addAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.stock > 0);
    
    if (inStockItems.length === 0) {
      alert('No items in stock to add to cart.');
      return;
    }

    let movedCount = 0;
    inStockItems.forEach(item => {
      try {
        addToCart(item, 1);
        movedCount++;
      } catch (error) {
        console.error(`Failed to add ${item.name} to cart:`, error);
      }
    });

    // Remove all in-stock items from wishlist
    const outOfStockItems = wishlistItems.filter(item => item.stock === 0);
    setWishlistItems(outOfStockItems);
    
    // Update localStorage
    const allWishlists = localStorageHelper.get('userWishlist') || [];
    const updatedWishlists = allWishlists.filter(storedItem => 
      outOfStockItems.some(currentItem => 
        currentItem.productId === storedItem.productId && currentItem.userId === storedItem.userId
      )
    );
    localStorageHelper.set('userWishlist', updatedWishlists);

    alert(`Successfully moved ${movedCount} item(s) to cart!`);
  };

  const clearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      setWishlistItems([]);
      
      // Remove only this user's items from localStorage
      const allWishlists = localStorageHelper.get('userWishlist') || [];
      const otherUsersWishlists = allWishlists.filter(item => item.userId !== user.uid);
      localStorageHelper.set('userWishlist', otherUsersWishlists);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>My Wishlist</h1>
            {wishlistItems.length > 0 && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={addAllToCart}
                  disabled={!wishlistItems.some(item => item.stock > 0)}
                >
                  Add All to Cart
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={clearWishlist}
                >
                  Clear Wishlist
                </button>
              </div>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-heart" style={{ fontSize: '4rem', color: '#6c757d' }}>❤️</i>
              </div>
              <h4>Your wishlist is empty</h4>
              <p className="text-muted mb-4">
                Save items you love to your wishlist. Review them anytime and easily move them to your cart.
              </p>
              <Link to="/products" className="btn btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {wishlistItems.map(item => (
                    <div key={item.productId} className="col">
                      <div className="card h-100">
                        <div className="position-relative">
                          <img
                            src={item.image}
                            className="card-img-top"
                            alt={item.name}
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                          {item.stock === 0 && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
                              <span className="badge bg-danger fs-6">Out of Stock</span>
                            </div>
                          )}
                          <button
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                            onClick={() => removeFromWishlist(item.productId)}
                            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                          >
                            ×
                          </button>
                        </div>
                        
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{item.name}</h5>
                          <p className="card-text text-muted flex-grow-1">
                            {item.description}
                          </p>
                          
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="h5 text-primary mb-0">₹{item.price}</span>
                            <div className="d-flex align-items-center">
                              <span className="text-warning">⭐ {item.rating?.rate || 0}</span>
                              <small className="text-muted ms-1">({item.rating?.count || 0})</small>
                            </div>
                          </div>

                          <div className="d-flex gap-2">
                            <Link
                              to={`/products/${item.productId}`}
                              className="btn btn-outline-primary flex-fill"
                            >
                              View Details
                            </Link>
                            <button
                              className={`btn ${item.stock === 0 ? 'btn-secondary' : 'btn-primary'}`}
                              onClick={() => moveToCart(item)}
                              disabled={item.stock === 0}
                            >
                              {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Wishlist Summary */}
                <div className="card mt-4">
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-md-4">
                        <h4>{wishlistItems.length}</h4>
                        <p className="text-muted mb-0">Total Items</p>
                      </div>
                      <div className="col-md-4">
                        <h4>{wishlistItems.filter(item => item.stock > 0).length}</h4>
                        <p className="text-muted mb-0">In Stock</p>
                      </div>
                      <div className="col-md-4">
                        <h4>₹{wishlistItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</h4>
                        <p className="text-muted mb-0">Total Value</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;