// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';

const Home = () => {
  const { products, categories } = useProducts();

  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Welcome to Our E-Commerce Store
              </h1>
              <p className="lead mb-4">
                Discover amazing products at great prices. Shop with confidence 
                and enjoy fast delivery and excellent customer service.
              </p>
              <Link to="/products" className="btn btn-light btn-lg">
                Shop Now
              </Link>
            </div>
            <div className="col-lg-6">
              <img
                src={"shoping.svg"}
                alt="Hero"
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Featured Products</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {featuredProducts.map(product => (
              <div key={product.id} className="col">
                <div className="card h-100">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.title}  
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">₹{product.price}</p>
                    <Link
                      to={`/products/${product.id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/products" className="btn btn-outline-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Shop by Category</h2>
          <div className="row g-4">
            {categories.map(category => (
              <div key={category.id} className="col-6 col-md-3">
                <Link
                  to={`/products?category=${category.slug}`}
                  className="card text-decoration-none text-dark h-100"
                >
                  <div className="card-body text-center">
                    <h5 className="card-title">{category.name}</h5>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5>ZenMart</h5>
              <p className="mb-0">
                Your trusted online shopping destination for quality products 
                at affordable prices.
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
                <li><Link to="/products" className="text-white text-decoration-none">Products</Link></li>
                <li><Link to="/about" className="text-white text-decoration-none">About Us</Link></li>
                <li><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h5>Contact Info</h5>
              <ul className="list-unstyled">
                <li>📧 support@ZenMart.com</li>
                <li>📞 +91 98765 43210</li>
                <li>📍 Tirunelveli, Tamil Nadu</li>
              </ul>
            </div>
          </div>
          <hr className="my-4" />
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0">&copy; 2025 Our ZenMart Store. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex justify-content-md-end gap-3">
                <a href="#" className="text-white text-decoration-none">
                  <i className="bi bi-facebook"></i> Facebook
                </a>
                <a href="#" className="text-white text-decoration-none">
                  <i className="bi bi-twitter"></i> Twitter
                </a>
                <a href="#" className="text-white text-decoration-none">
                  <i className="bi bi-instagram"></i> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;