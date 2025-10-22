// src/components/common/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount, getWishlistCount } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is admin
  useEffect(() => {
    if (user) {
      const adminEmails = ['admin@example.com', 'arun.kumar@example.com'];
      setIsAdmin(adminEmails.includes(user.email));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  // Close dropdown when route changes
  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

  // Dynamic navigation links based on user role and login status
  const getMainNavigationLinks = () => {
    const baseLinks = [
      // Home/Dashboard link - changes based on login status and role
      {
        path: user ? (isAdmin ? '/admin/dashboard' : '/dashboard') : '/',
        label: user ? 'Dashboard' : 'Home',
        icon: user ? 'bi-speedometer2' : 'bi-house',
        show: true
      },
      {
        path: '/products',
        label: 'Products',
        icon: 'bi-grid',
        show: true
      }
    ];

    const adminLinks = [
      {
        path: '/admin/products',
        label: 'Manage Products',
        icon: 'bi-box-seam',
        show: isAdmin
      },
      {
        path: '/admin/orders',
        label: 'Manage Orders',
        icon: 'bi-clipboard-check',
        show: isAdmin
      }
    ];

    return [...baseLinks, ...adminLinks].filter(link => link.show);
  };

  // Dynamic user dropdown links based on role
  const getUserDropdownLinks = () => {
    const customerLinks = [
      {
        path: '/dashboard',
        label: 'Dashboard',
        icon: 'bi-speedometer2',
        show: !isAdmin && user
      },
      {
        path: '/dashboard/orders',
        label: 'My Orders',
        icon: 'bi-receipt',
        show: !isAdmin && user
      },
      {
        path: '/dashboard/wishlist',
        label: 'Wishlist',
        icon: 'bi-heart',
        show: !isAdmin && user,
        badge: getWishlistCount() > 0 ? getWishlistCount() : null
      }
    ];

    const adminLinks = [
      {
        type: 'divider',
        show: isAdmin && user
      },
      {
        type: 'header',
        label: 'Admin Panel',
        icon: 'bi-shield-check',
        show: isAdmin && user
      },
      {
        path: '/admin/dashboard',
        label: 'Admin Dashboard',
        icon: 'bi-speedometer2',
        show: isAdmin && user
      },
      {
        path: '/admin/products',
        label: 'Manage Products',
        icon: 'bi-box-seam',
        show: isAdmin && user
      },
      {
        path: '/admin/orders',
        label: 'Manage Orders',
        icon: 'bi-clipboard-check',
        show: isAdmin && user
      },
      {
        path: '/admin/users',
        label: 'Manage Users',
        icon: 'bi-people',
        show: isAdmin && user
      }
    ];

    return [...customerLinks, ...adminLinks].filter(link => link.show);
  };

  const mainNavigationLinks = getMainNavigationLinks();
  const userDropdownLinks = getUserDropdownLinks();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow">
      <div className="container">
        {/* Brand Logo - Dynamic based on role */}
        <Link 
          className="navbar-brand fw-bold d-flex align-items-center" 
          to={user ? (isAdmin ? "/admin/dashboard" : "/dashboard") : "/"}
        >
          <span className="bg-white text-primary rounded-circle p-2 me-2" style={{width: '35px', height: '35px'}}>
            🛍️
          </span>
          <span className="d-none d-sm-inline">ZenMart{isAdmin ? ' Admin' : ''}</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="true"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Main Navigation */}
          <ul className="navbar-nav me-auto">
            {mainNavigationLinks.map((link, index) => (
              <li key={index} className="nav-item">
                <Link 
                  className={`nav-link ${isActiveLink(link.path)}`} 
                  to={link.path}
                >
                  <i className={`${link.icon} me-1`}></i>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* User Actions */}
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* Cart with Badge - Show for all users */}
            <li className="nav-item me-2">
              <Link 
                className="nav-link position-relative px-3 py-2 rounded" 
                to="/cart"
              >
                <i className="bi bi-cart3 fs-5"></i>
                {getCartItemsCount() > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {getCartItemsCount()}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
                <span className="d-none d-lg-inline ms-1">Cart</span>
              </Link>
            </li>

            {/* Wishlist with Badge - Hide for admin in main nav */}
            {!isAdmin && user && (
              <li className="nav-item me-2 d-none d-sm-block">
                <Link 
                  className="nav-link position-relative px-3 py-2 rounded" 
                  to="/dashboard/wishlist"
                >
                  <i className="bi bi-heart fs-5"></i>
                  {getWishlistCount() > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                      {getWishlistCount()}
                      <span className="visually-hidden">items in wishlist</span>
                    </span>
                  )}
                  <span className="d-none d-lg-inline ms-1">Wishlist</span>
                </Link>
              </li>
            )}

            {/* User Dropdown */}
            {user ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-white text-decoration-none d-flex align-items-center px-3 py-2 rounded"
                  onClick={() => setShowDropdown(!showDropdown)}
                  aria-expanded={showDropdown}
                >
                  <img
                    src={user.photoURL || user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                    alt="Profile"
                    className="rounded-circle me-2"
                    width="32"
                    height="32"
                    style={{objectFit: 'cover'}}
                  />
                  <span className="d-none d-md-inline">
                    {user.displayName || user.name || user.email}
                    {isAdmin && <span className="badge bg-warning ms-1">Admin</span>}
                  </span>
                </button>
                <ul className={`dropdown-menu dropdown-menu-end ${showDropdown ? 'show' : ''}`}>
                  {/* User Info */}
                  <li className="dropdown-header">
                    <div className="d-flex align-items-center">
                      <img
                        src={user.photoURL || user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                        alt="Profile"
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                        style={{objectFit: 'cover'}}
                      />
                      <div>
                        <div className="fw-bold">{user.displayName || user.name || 'User'}</div>
                        <small className="text-muted">{user.email}</small>
                        {isAdmin && (
                          <div>
                            <span className="badge bg-warning small">Administrator</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>

                  {/* Dynamic User Links */}
                  {userDropdownLinks.map((link, index) => {
                    if (link.type === 'divider') {
                      return <li key={index}><hr className="dropdown-divider" /></li>;
                    }
                    
                    if (link.type === 'header') {
                      return (
                        <li key={index} className="dropdown-header">
                          <i className={`${link.icon} me-1`}></i>
                          {link.label}
                        </li>
                      );
                    }

                    return (
                      <li key={index}>
                        <Link 
                          className="dropdown-item" 
                          to={link.path}
                          onClick={() => setShowDropdown(false)}
                        >
                          <i className={`${link.icon} me-2`}></i>
                          {link.label}
                          {link.badge && (
                            <span className="badge bg-warning float-end">{link.badge}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}

                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link 
                  className="btn btn-outline-light btn-sm ms-2" 
                  to="/login"
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;