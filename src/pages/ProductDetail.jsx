// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { localStorageHelper } from '../utils/localStorage';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProductById, products } = useProducts();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const productData = await getProductById(id);
      if (productData) {
        setProduct(productData);
        
        // Get related products from same category
        const related = products
          .filter(p => p.category === productData.category && p.id !== productData.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        navigate('/products', { replace: true });
      }
    } catch (error) {
      console.error('Error loading product:', error);
      navigate('/products', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    try {
      addToCart(product, quantity);
      alert('Product added to cart successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddToWishlist = () => {
    if (!user) {
      alert('Please login to add items to your wishlist');
      navigate('/login');
      return;
    }

    if (!product) return;

    const wishlistItem = {
      ...product,
      userId: user.uid,
      productId: product.id
    };

    const existingWishlist = localStorageHelper.get('userWishlist') || [];
    
    // Check if product already in wishlist
    const alreadyInWishlist = existingWishlist.some(
      item => item.productId === product.id && item.userId === user.uid
    );

    if (alreadyInWishlist) {
      alert('This product is already in your wishlist!');
      return;
    }

    const updatedWishlist = [...existingWishlist, wishlistItem];
    localStorageHelper.set('userWishlist', updatedWishlist);
    alert('Product added to wishlist!');
  };

  const handleBuyNow = () => {
    if (!product) return;

    try {
      addToCart(product, quantity);
      navigate('/cart');
    } catch (error) {
      alert(error.message);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
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

  if (!product) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <h2>Product Not Found</h2>
          <p className="text-muted mb-4">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/products" className="text-decoration-none">Products</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.title} {/* FIXED: Changed from product.name to product.title */}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Product Images */}
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-body text-center">
              <img
                src={product.image}
                alt={product.title} 
                className="img-fluid rounded"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h1 className="h2 mb-3">{product.title}</h1> {/* FIXED: Changed from product.name to product.title */}
              
              <div className="d-flex align-items-center mb-3">
                <div className="d-flex align-items-center me-4">
                  {/* FIXED: Access rating.rate instead of rating directly */}
                  <span className="text-warning h5 mb-0">⭐ {product.rating?.rate || 0}</span>
                  <small className="text-muted ms-1">({product.rating?.count || 0} reviews)</small>
                </div>
                <span className="badge bg-secondary">{product.category}</span>
              </div>

              <div className="mb-4">
                <h2 className="text-primary mb-2">₹{product.price}</h2>
                <div className={`badge ${isOutOfStock ? 'bg-danger' : 'bg-success'} fs-6`}>
                  {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
                </div>
              </div>

              <p className="mb-4">{product.description}</p>

              {/* Quantity Selector */}
              <div className="row mb-4">
                <div className="col-auto">
                  <label className="form-label fw-bold">Quantity:</label>
                  <div className="input-group" style={{ width: '140px' }}>
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={quantity}
                      min="1"
                      max={product.stock}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= product.stock) {
                          setQuantity(value);
                        }
                      }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock || isOutOfStock}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 mb-4">
                <button
                  className={`btn btn-primary flex-fill ${isOutOfStock ? 'disabled' : ''}`}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                <button
                  className={`btn btn-success flex-fill ${isOutOfStock ? 'disabled' : ''}`}
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                >
                  Buy Now
                </button>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-danger flex-fill"
                  onClick={handleAddToWishlist}
                >
                  ❤️ Add to Wishlist
                </button>
              </div>

              {/* Product Features */}
              <div className="mt-4 pt-4 border-top">
                <h5 className="mb-3">Product Features</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">✅ Free shipping on orders over ₹50</li>
                  <li className="mb-2">✅ 30-day return policy</li>
                  <li className="mb-2">✅ 1-year warranty included</li>
                  <li className="mb-2">✅ 24/7 customer support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <ul className="nav nav-tabs" id="productTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="description-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#description"
                    type="button"
                    role="tab"
                  >
                    Description
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="reviews-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#reviews"
                    type="button"
                    role="tab"
                  >
                    {/* FIXED: Use rating.count instead of reviews */}
                    Reviews ({product.rating?.count || 0})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="shipping-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#shipping"
                    type="button"
                    role="tab"
                  >
                    Shipping & Returns
                  </button>
                </li>
              </ul>
              
              <div className="tab-content p-3" id="productTabsContent">
                <div
                  className="tab-pane fade show active"
                  id="description"
                  role="tabpanel"
                >
                  <p>{product.description}</p>
                  <p className="mb-0">
                    This premium product offers exceptional quality and value. 
                    Designed with attention to detail and built to last.
                  </p>
                </div>
                
                <div
                  className="tab-pane fade"
                  id="reviews"
                  role="tabpanel"
                >
                  <div className="text-center py-4">
                    <h5>Customer Reviews</h5>
                    <p className="text-muted">
                      {/* FIXED: Use rating.rate and rating.count */}
                      This product has an average rating of {product.rating?.rate || 0} stars 
                      based on {product.rating?.count || 0} reviews.
                    </p>
                    <button className="btn btn-outline-primary">
                      Write a Review
                    </button>
                  </div>
                </div>
                
                <div
                  className="tab-pane fade"
                  id="shipping"
                  role="tabpanel"
                >
                  <h6>Shipping Information</h6>
                  <ul>
                    <li>Free standard shipping on orders over ₹50</li>
                    <li>Express shipping available for ₹9.99</li>
                    <li>Usually ships within 1-2 business days</li>
                    <li>International shipping available</li>
                  </ul>
                  
                  <h6 className="mt-4">Return Policy</h6>
                  <ul>
                    <li>30-day money-back guarantee</li>
                    <li>Free returns within 30 days of purchase</li>
                    <li>Items must be in original condition</li>
                    <li>Contact customer service for return authorization</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <h3 className="mb-4">Related Products</h3>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="col">
                  <div className="card h-100">
                    <img
                      src={relatedProduct.image}
                      className="card-img-top"
                      alt={relatedProduct.title} 
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{relatedProduct.title}</h5> {/* FIXED: Changed from product.name to product.title */}
                      <p className="card-text text-primary fw-bold">₹{relatedProduct.price}</p>
                      <div className="mt-auto">
                        <Link
                          to={`/products/${relatedProduct.id}`}
                          className="btn btn-outline-primary w-100"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;