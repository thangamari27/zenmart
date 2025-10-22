// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { localStorageHelper } from '../utils/localStorage';

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [savedAddresses] = useState(() => {
    return localStorageHelper.get('userAddresses') || [];
  });
  
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSubmit = () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      alert('Please fill all address fields');
      return;
    }

    const updatedAddresses = [...savedAddresses, { ...newAddress, id: Date.now() }];
    localStorageHelper.set('userAddresses', updatedAddresses);
    setUseNewAddress(false);
    setNewAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    });
    alert('Address saved successfully!');
  };

  const handlePlaceOrder = async () => {
    if ((!selectedAddress && !useNewAddress) || (useNewAddress && (!newAddress.name || !newAddress.street))) {
      alert('Please select or add a shipping address');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const shippingAddress = useNewAddress ? newAddress : savedAddresses.find(addr => addr.id === parseInt(selectedAddress));
      
      const order = {
        id: Date.now(),
        userId: user.uid,
        items: items,
        total: getCartTotal(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress: shippingAddress
      };

      // Save order to localStorage (simulating backend)
      const existingOrders = localStorageHelper.get('userOrders') || [];
      localStorageHelper.set('userOrders', [...existingOrders, order]);

      // Clear cart
      clearCart();

      // Redirect to order confirmation
      navigate('/dashboard/orders', { 
        state: { 
          message: 'Order placed successfully!',
          orderId: order.id
        }
      });

    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Your cart is empty</h2>
          <p className="text-muted mb-4">Add some items to your cart before checkout.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Checkout</h1>
        </div>
      </div>

      <div className="row">
        {/* Order Summary */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {items.map(item => (
                <div key={item.productId} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="rounded me-3"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
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
              
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Shipping:</span>
                <span>₹0.00</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Tax:</span>
                <span>₹{(getCartTotal() * 0.1).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>₹{(getCartTotal() * 1.1).toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Address Selection */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Shipping Address</h5>
            </div>
            <div className="card-body">
              {savedAddresses.length > 0 && (
                <div className="mb-4">
                  <h6>Select Saved Address</h6>
                  {savedAddresses.map(address => (
                    <div key={address.id} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id.toString() && !useNewAddress}
                        onChange={() => {
                          setSelectedAddress(address.id.toString());
                          setUseNewAddress(false);
                        }}
                      />
                      <label className="form-check-label">
                        <strong>{address.name}</strong><br />
                        {address.street}, {address.city}, {address.state} {address.zipCode}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="addressType"
                  checked={useNewAddress}
                  onChange={() => setUseNewAddress(true)}
                />
                <label className="form-check-label">
                  <strong>Use new address</strong>
                </label>
              </div>

              {useNewAddress && (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={newAddress.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="street"
                      value={newAddress.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={newAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={newAddress.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="zipCode"
                      value={newAddress.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-outline-primary"
                      onClick={handleAddressSubmit}
                    >
                      Save This Address
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Confirmation */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Complete Order</h5>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Processing...
                    </>
                  ) : (
                    `Place Order - ₹${(getCartTotal() * 1.1).toFixed(2)}`
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/cart')}
                >
                  Back to Cart
                </button>
              </div>
              
              <div className="mt-4">
                <h6>Order Protection</h6>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked />
                  <label className="form-check-label small">
                    Get order updates via email
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked />
                  <label className="form-check-label small">
                    Protect my order with purchase protection
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;