// src/pages/Login.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { loginWithGoogle, loginAsMockUser, user, loading, isMock } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination or set default based on role
  const from = location.state?.from?.pathname || '/';

  React.useEffect(() => {
    if (user) {
      // Determine where to redirect based on user role
      let redirectPath = from;
      
      if (from === '/' || from === '/login') {
        // If coming from home or login page, redirect to appropriate dashboard
        redirectPath = user.isAdmin ? '/admin/dashboard' : '/dashboard';
      } else if (user.isAdmin && from.startsWith('/dashboard')) {
        // If admin is trying to access customer routes, redirect to admin dashboard
        redirectPath = '/admin/dashboard';
      } else if (!user.isAdmin && from.startsWith('/admin')) {
        // If customer is trying to access admin routes, redirect to customer dashboard
        redirectPath = '/dashboard';
      }
      
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, from]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // The useEffect will handle redirection based on user role
    } catch (error) {
      console.error('Login failed:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleMockLogin = async (userType = 'user') => {
    try {
      if (userType === 'user') {
        await loginAsMockUser(0);
      } else if (userType === 'admin') {
        await loginAsMockUser(1);
      } else if (userType === 'arun') {
        await loginAsMockUser(2);
      }
      // The useEffect will handle redirection based on user role
    } catch (error) {
      console.error('Mock login failed:', error);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body text-center p-5">
              <h2 className="card-title mb-4">Welcome to ZenMart</h2>
              <p className="text-muted mb-4">
                Sign in to access your account and start shopping
              </p>
              
              {/* Google Login Button */}
              <button
                className="btn btn-outline-primary w-100 mb-3 d-flex align-items-center justify-content-center"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <span className="me-2">🔍</span>
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </button>

              {/* Mock Login Options - Only show in development */}
              {isMock && (
                <>
                  <div className="position-relative my-4">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                      Development Only
                    </span>
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-outline-success"
                      onClick={() => handleMockLogin('user')}
                      disabled={loading}
                    >
                      👤 Login as Customer
                    </button>
                    
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => handleMockLogin('admin')}
                      disabled={loading}
                    >
                      ⚡ Login as Admin
                    </button>

                    <small className="text-muted mt-2">
                      After login: Customers go to Dashboard, Admins go to Admin Dashboard
                    </small>
                  </div>
                </>
              )}

              <div className="mt-4">
                <small className="text-muted">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </small>
              </div>
            </div>
          </div>

          {/* Development Info Card */}
          {isMock && (
            <div className="card mt-4 border-info">
              <div className="card-body">
                <h6 className="card-title text-info">🔧 Development Mode</h6>
                <p className="card-text small text-muted">
                  You're in development mode. Use the mock login buttons above to test different user roles.
                </p>
                <div className="small">
                  <strong>Customer Login:</strong> Redirects to Customer Dashboard<br/>
                  <strong>Admin Login:</strong> Redirects to Admin Dashboard
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;