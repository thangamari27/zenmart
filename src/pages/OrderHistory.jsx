// src/pages/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { localStorageHelper } from '../utils/localStorage';

const OrderHistory = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading orders
    const loadOrders = () => {
      setLoading(true);
      setTimeout(() => {
        const userOrders = localStorageHelper.get('userOrders') || [];
        const userSpecificOrders = userOrders.filter(order => order.userId === user.uid);
        setOrders(userSpecificOrders);
        setLoading(false);
      }, 1000);
    };

    loadOrders();
  }, [user.uid]);

  // Show success message if redirected from checkout
  useEffect(() => {
    if (location.state?.message) {
      alert(location.state.message);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'Pending' },
      confirmed: { class: 'bg-info', text: 'Confirmed' },
      shipped: { class: 'bg-primary', text: 'Shipped' },
      delivered: { class: 'bg-success', text: 'Delivered' },
      cancelled: { class: 'bg-danger', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      );
      setOrders(updatedOrders);
      localStorageHelper.set('userOrders', updatedOrders);
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
            <h1>Order History</h1>
            <div>
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-receipt" style={{ fontSize: '4rem', color: '#6c757d' }}>📦</i>
              </div>
              <h4>No orders found</h4>
              <p className="text-muted mb-4">
                {filter === 'all' 
                  ? "You haven't placed any orders yet."
                  : `No ${filter} orders found.`
                }
              </p>
              {filter === 'all' && (
                <a href="/products" className="btn btn-primary">
                  Start Shopping
                </a>
              )}
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                {filteredOrders.map(order => (
                  <div key={order.id} className="card mb-4">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-0">Order #{order.id}</h5>
                          <small className="text-muted">
                            Placed on {formatDate(order.createdAt)}
                          </small>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          {getStatusBadge(order.status)}
                          <strong>₹{order.total.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      {/* Order Items */}
                      <div className="mb-4">
                        <h6>Items</h6>
                        {order.items.map(item => (
                          <div key={item.productId} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div className="d-flex align-items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="rounded me-3"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                              <div>
                                <h6 className="mb-1">{item.name}</h6>
                                <small className="text-muted">Qty: {item.quantity}</small>
                              </div>
                            </div>
                            <div className="text-end">
                              <h6 className="mb-1">₹{(item.price * item.quantity).toFixed(2)}</h6>
                              <small className="text-muted">₹{item.price} each</small>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Address */}
                      <div className="row">
                        <div className="col-md-6">
                          <h6>Shipping Address</h6>
                          <p className="mb-0">
                            <strong>{order.shippingAddress.name}</strong><br />
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                            
                          </p>
                        </div>
                        
                        <div className="col-md-6">
                          <h6>Actions</h6>
                          <div className="d-flex gap-2">
                            <button className="btn btn-outline-primary btn-sm">
                              View Details
                            </button>
                            <button className="btn btn-outline-secondary btn-sm">
                              Track Order
                            </button>
                            {order.status === 'pending' && (
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Status Guide */}
          <div className="card mt-4">
            <div className="card-body">
              <h5>Order Status Guide</h5>
              <div className="row text-center">
                <div className="col">
                  <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '40px', height: '40px' }}>
                    <span>1</span>
                  </div>
                  <p className="mb-0 small">Pending</p>
                </div>
                <div className="col">
                  <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '40px', height: '40px' }}>
                    <span>2</span>
                  </div>
                  <p className="mb-0 small">Confirmed</p>
                </div>
                <div className="col">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '40px', height: '40px' }}>
                    <span>3</span>
                  </div>
                  <p className="mb-0 small">Shipped</p>
                </div>
                <div className="col">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '40px', height: '40px' }}>
                    <span>4</span>
                  </div>
                  <p className="mb-0 small">Delivered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;