// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Products',
      value: '45',
      icon: 'bi-box-seam',
      color: 'primary',
      link: '/admin/products'
    },
    {
      title: 'Total Orders',
      value: '128',
      icon: 'bi-clipboard-check',
      color: 'success',
      link: '/admin/orders'
    },
    {
      title: 'Pending Orders',
      value: '12',
      icon: 'bi-clock',
      color: 'warning',
      link: '/admin/orders?status=pending'
    },
    {
      title: 'Total Users',
      value: '89',
      icon: 'bi-people',
      color: 'info',
      link: '/admin/users'
    }
  ];

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Admin Dashboard</h1>
            <div className="d-flex align-items-center">
              <img
                src={user.photoURL || 'https://via.placeholder.com/40'}
                alt="Admin"
                className="rounded-circle me-2"
                width="40"
                height="40"
              />
              <div>
                <div className="fw-bold">{user.displayName || 'Admin'}</div>
                <small className="text-muted">Administrator</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-xl-3 col-md-6 mb-4">
            <Link to={stat.link} className="text-decoration-none">
              <div className={`card border-left-${stat.color} shadow h-100 py-2`}>
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className={`text-xs font-weight-bold text-${stat.color} text-uppercase mb-1`}>
                        {stat.title}
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stat.value}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className={`bi ${stat.icon} fa-2x text-gray-300`}></i>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-3 col-md-6 mb-4">
                  <Link to="/admin/products" className="text-decoration-none">
                    <div className="card border-left-primary shadow h-100">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Manage Products
                            </div>
                            <div className="h6 mb-0 font-weight-bold text-gray-800">
                              Add, edit or remove products
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="bi bi-box-seam text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <Link to="/admin/orders" className="text-decoration-none">
                    <div className="card border-left-success shadow h-100">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                              Manage Orders
                            </div>
                            <div className="h6 mb-0 font-weight-bold text-gray-800">
                              View and update orders
                            </div>
                          </div>
                          <div className="col-auto">
                            <i className="bi bi-clipboard-check text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default AdminDashboard;