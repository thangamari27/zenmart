// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { localStorageHelper } from '../utils/localStorage';

const Dashboard = () => {
  const { user } = useAuth();
  const { getCartItemsCount, getWishlistCount } = useCart();
  const navigate = useNavigate();
  const [totalOrders, setTotalOrders] = useState(0);

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (user?.isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Load user orders data
  useEffect(() => {
    if (user && !user.isAdmin) {
      const userOrders = localStorageHelper.get('userOrders') || [];
      const userSpecificOrders = userOrders.filter(order => order.userId === user.uid);
      setTotalOrders(userSpecificOrders.length);
    }
  }, [user]);

  // If user is not logged in, show message
  if (!user) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <h3>Please log in to access your dashboard</h3>
          <Link to="/login" className="btn btn-primary mt-3">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">My Dashboard</h1>
          <p className="text-muted">Welcome back, {user.displayName || 'Customer'}! Here's your shopping overview.</p>
        </div>
      </div>

      <div className="row">
        {/* User Info */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <img
                src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                alt="Profile"
                className="rounded-circle mb-3 border"
                width="100"
                height="100"
                style={{objectFit: 'cover'}}
              />
              <h4 className="mb-2">{user.displayName || 'Customer'}</h4>
              <p className="text-muted mb-2">{user.email}</p>
              <span className="badge bg-primary">Premium Customer</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-4 mb-4">
              <Link to="/cart" className="text-decoration-none">
                <div className="card bg-primary text-white shadow-sm h-100">
                  <div className="card-body text-center d-flex flex-column justify-content-center">
                    <h2 className="display-6">{getCartItemsCount()}</h2>
                    <p className="mb-0">Items in Cart</p>
                    <small>Ready to checkout</small>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-4 mb-4">
              <Link to="/dashboard/orders" className="text-decoration-none">
                <div className="card bg-success text-white shadow-sm h-100">
                  <div className="card-body text-center d-flex flex-column justify-content-center">
                    <h2 className="display-6">{totalOrders}</h2>
                    <p className="mb-0">Total Orders</p>
                    <small>All time purchases</small>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-4 mb-4">
              <Link to="/dashboard/wishlist" className="text-decoration-none">
                <div className="card bg-warning text-dark shadow-sm h-100">
                  <div className="card-body text-center d-flex flex-column justify-content-center">
                    <h2 className="display-6">{getWishlistCount()}</h2>
                    <p className="mb-0">Wishlist Items</p>
                    <small>Saved for later</small>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3 col-6">
                  <Link to="/products" className="btn btn-outline-primary w-100 h-100 py-3">
                    <i className="bi bi-bag me-2"></i>
                    Continue Shopping
                  </Link>
                </div>
                <div className="col-md-3 col-6">
                  <Link to="/dashboard/wishlist" className="btn btn-outline-success w-100 h-100 py-3">
                    <i className="bi bi-heart me-2"></i>
                    View Wishlist
                  </Link>
                </div>
                <div className="col-md-3 col-6">
                  <Link to="/dashboard/orders" className="btn btn-outline-info w-100 h-100 py-3">
                    <i className="bi bi-receipt me-2"></i>
                    Order History
                  </Link>
                </div>
                <div className="col-md-3 col-6">
                  <Link to="/cart" className="btn btn-outline-warning w-100 h-100 py-3">
                    <i className="bi bi-cart3 me-2"></i>
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;