// src/pages/admin/ManageOrders.jsx
import React, { useState, useEffect } from 'react';
import { localStorageHelper } from '../../utils/localStorage';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch orders from localStorage
  const fetchOrders = () => {
    try {
      const userOrders = localStorageHelper.get('userOrders') || [];
      // Transform the data to match our component structure
      const formattedOrders = userOrders.map(order => ({
        id: order.id,
        customer: order.shippingAddress?.name || 'Customer',
        email: `${order.userId}@example.com`, // Since we don't have email in order data
        total: order.total,
        status: order.status || 'pending',
        date: order.createdAt,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        userId: order.userId,
        shippingAddress: order.shippingAddress
      }));
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Get current orders from localStorage
      const userOrders = localStorageHelper.get('userOrders') || [];
      
      // Update the order status
      const updatedOrders = userOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      );
      
      // Save back to localStorage
      localStorageHelper.set('userOrders', updatedOrders);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      console.log(`Order ${orderId} status updated to: ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        // Get current orders from localStorage
        const userOrders = localStorageHelper.get('userOrders') || [];
        
        // Remove the order
        const updatedOrders = userOrders.filter(order => order.id !== orderId);
        
        // Save back to localStorage
        localStorageHelper.set('userOrders', updatedOrders);
        
        // Update local state
        setOrders(prev => prev.filter(order => order.id !== orderId));
        
        alert('Order deleted successfully!');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order. Please try again.');
      }
    }
  };

  // Get status badge with proper styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'Pending' },
      processing: { class: 'bg-info', text: 'Processing' },
      shipped: { class: 'bg-primary', text: 'Shipped' },
      delivered: { class: 'bg-success', text: 'Delivered' },
      cancelled: { class: 'bg-danger', text: 'Cancelled' },
      failed: { class: 'bg-secondary', text: 'Failed' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  // Filter orders by status
  const filteredOrders = statusFilter 
    ? orders.filter(order => order.status === statusFilter)
    : orders;

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Manage Orders</h1>
        <div className="d-flex gap-2 align-items-center">
          <label htmlFor="statusFilter" className="form-label mb-0">Filter by Status:</label>
          <select 
            id="statusFilter"
            className="form-select form-select-sm w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders Summary */}
      <div className="row mb-4">
        <div className="col-md-2 col-6">
          <div className="card bg-primary text-white">
            <div className="card-body text-center p-3">
              <h4 className="mb-0">{orders.length}</h4>
              <small>Total Orders</small>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="card bg-warning text-dark">
            <div className="card-body text-center p-3">
              <h4 className="mb-0">{orders.filter(o => o.status === 'pending').length}</h4>
              <small>Pending</small>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="card bg-info text-white">
            <div className="card-body text-center p-3">
              <h4 className="mb-0">{orders.filter(o => o.status === 'processing').length}</h4>
              <small>Processing</small>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="card bg-success text-white">
            <div className="card-body text-center p-3">
              <h4 className="mb-0">{orders.filter(o => o.status === 'delivered').length}</h4>
              <small>Delivered</small>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card shadow">
        <div className="card-body">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-inbox display-1 text-muted"></i>
              <h4 className="mt-3">No Orders Found</h4>
              <p className="text-muted">
                {statusFilter ? `No orders with status "${statusFilter}"` : 'No orders have been placed yet.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.id.toString().slice(-6)}</strong>
                      </td>
                      <td>
                        <div className="fw-bold">{order.customer}</div>
                        <small className="text-muted">{order.email}</small>
                      </td>
                      <td>
                        {new Date(order.date).toLocaleDateString()}<br/>
                        <small className="text-muted">
                          {new Date(order.date).toLocaleTimeString()}
                        </small>
                      </td>
                      <td>₹{order.total.toLocaleString()}</td>
                      <td>
                        <select 
                          className={`form-select form-select-sm ${getStatusBadge(order.status).props.className} text-white border-0`}
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={{width: 'fit-content', minWidth: '120px'}}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => setEditingOrder(order)}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => deleteOrder(order.id)}
                            title="Delete Order"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {editingOrder && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Details - #{editingOrder.id.toString().slice(-6)}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setEditingOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6>Customer Information</h6>
                    <p className="mb-2">
                      <strong>Name:</strong> {editingOrder.customer}<br/>
                      <strong>Email:</strong> {editingOrder.email}<br/>
                      <strong>User ID:</strong> {editingOrder.userId}<br/>
                      <strong>Order Date:</strong> {new Date(editingOrder.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>Shipping Address</h6>
                    {editingOrder.shippingAddress ? (
                      <p className="mb-2">
                        <strong>{editingOrder.shippingAddress.name}</strong><br/>
                        {editingOrder.shippingAddress.street}<br/>
                        {editingOrder.shippingAddress.city}, {editingOrder.shippingAddress.state}<br/>
                        {editingOrder.shippingAddress.zipCode}, {editingOrder.shippingAddress.country}
                      </p>
                    ) : (
                      <p className="text-muted">No shipping address available</p>
                    )}
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-12">
                    <h6>Order Status</h6>
                    {getStatusBadge(editingOrder.status)}
                  </div>
                </div>
                
                <h6>Order Items</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editingOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price.toLocaleString()}</td>
                          <td>₹{(item.quantity * item.price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end"><strong>Total Amount:</strong></td>
                        <td><strong>₹{editingOrder.total.toLocaleString()}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setEditingOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;