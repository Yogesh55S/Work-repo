import { useState, useEffect, createContext, lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './Component/providers/CartContext';
import Navbar from './Component/Navbar';
import Footer from './Component/Footer';
import Loader from './Component/gifloader';
// Import Home component normally (not lazy-loaded)
// test commit
import Home from './Pages/Home';

import PrivacyPolicy from './Pages/PrivicyPolicy';

// Lazy load all components
const WinterCollection = lazy(() => import('./Pages/WinterCollection'));
const NotFound = lazy(() => import('./Pages/Notfound'));
const Shop = lazy(() => import('./Pages/Shop'));
const Contact = lazy(() => import('./Pages/Contact'));
const Cart = lazy(() => import('./Pages/Cart'));
const Login = lazy(() => import('./Pages/Login'));
const Register = lazy(() => import('./Pages/Register'));
const VerifyOTP = lazy(() => import('./Pages/VerifyOtp'));
const Unauthorized = lazy(() => import('./Pages/Unauthorized'));
const ForgotPassword = lazy(() => import('./Pages/Forgotpassword'));
const ResetPassword = lazy(() => import('./Pages/ResetPassword'));
const PaymentStatus = lazy(() => import('./Pages/PaymentStatus'));
const ProductDetail = lazy(() => import('./Component/ProductDetail'));

// Admin Panel Components
const AdminPanel = lazy(() => import('./Pages/AdminPanel'));
const AddProductForm = lazy(() => import('./Component/admin/AddProductForm'));
const ProductView = lazy(() => import('./Component/admin/ProductView'));
const Orders = lazy(() => import('./Component/admin/Orders'));
const OrderDetail = lazy(() => import('./Component/admin/OrderDetail'));

// User Panel Components
const UserPanel = lazy(() => import('./Pages/UserPanel'));
const PersonalInformation = lazy(() =>
  import('./Component/userProfile/PersonalInformation')
);
const AddressBook = lazy(() => import('./Component/userProfile/AddressBook'));
const UserOrders = lazy(() => import('./Component/userProfile/UserOrders'));
const OrderDetails = lazy(() => import('./Component/userProfile/OrderDetails'));
const Security = lazy(() => import('./Component/userProfile/Security'));
const HelpSupport = lazy(() => import('./Component/userProfile/HelpSupport'));

// Create AuthContext
export const AuthContext = createContext();

// Create LoadingContext
export const LoadingContext = createContext();

// Utility function to decode JWT
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
};

// Protected Route Component with Suspense
const ProtectedRoute = ({ children, requiredRole }) => {
  const storedToken = localStorage.getItem('authToken');
  if (!storedToken) {
    return <Navigate to='/login' replace />;
  }

  const decodedToken = parseJwt(storedToken);
  if (!decodedToken) {
    return <Navigate to='/login' replace />;
  }

  if (requiredRole && decodedToken.role !== requiredRole) {
    return <Navigate to='/unauthorized' replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Initialize user data from token
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          const decodedToken = parseJwt(storedToken);
          if (decodedToken?.userId) {
            setUser({
              userId: decodedToken.userId,
              role: decodedToken.role || 'user',
            });
          } else {
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        // Add a small delay to ensure the loader is visible
        setTimeout(() => {
          setIsLoading(false);
          setInitialLoad(false);
        }, 1000);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  // Show full-screen loader during initial load
  if (initialLoad) {
    return (
      <div
        className='loader-container'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          zIndex: 9999,
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ user, logout }}>
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
          <CartProvider>
            <Router>
              <Navbar />
              {isLoading && (
                <div
                  className='loader-overlay'
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 9999,
                  }}
                >
                  <Loader />
                </div>
              )}
              <Routes>
                <Route
                  path='*'
                  element={
                    <Suspense fallback={<Loader />}>
                      <NotFound />
                    </Suspense>
                  }
                />
                {/* Home route is not lazy loaded */}
                <Route path='/' element={<Home />} />

                {/* All other routes are lazy loaded */}
                <Route
                  path='/monsoon-collection'
                  element={
                    <Suspense fallback={<Loader />}>
                      <WinterCollection />
                    </Suspense>
                  }
                />
                <Route
                  path='/shop'
                  element={
                    <Suspense fallback={<Loader />}>
                      <Shop />
                    </Suspense>
                  }
                />
                <Route
                  path='/contact'
                  element={
                    <Suspense fallback={<Loader />}>
                      <Contact />
                    </Suspense>
                  }
                />
                <Route
                  path='/product/:id'
                  element={
                    <Suspense fallback={<Loader />}>
                      <ProductDetail />
                    </Suspense>
                  }
                />
                <Route
                  path='/cart'
                  element={
                    <Suspense fallback={<Loader />}>
                      <Cart userId={user?.userId} />
                    </Suspense>
                  }
                />
                <Route
                  path='/login'
                  element={
                    <Suspense fallback={<Loader />}>
                      <Login />
                    </Suspense>
                  }
                />
                <Route
                  path='/register'
                  element={
                    <Suspense fallback={<Loader />}>
                      <Register />
                    </Suspense>
                  }
                />
                <Route
                  path='/verify-otp'
                  element={
                    <Suspense fallback={<Loader />}>
                      <VerifyOTP />
                    </Suspense>
                  }
                />
                <Route
                  path='/unauthorized'
                  element={
                    <Suspense fallback={<Loader />}>
                      <Unauthorized />
                    </Suspense>
                  }
                />
                <Route
                  path='/forgot-password'
                  element={
                    <Suspense fallback={<Loader />}>
                      <ForgotPassword />
                    </Suspense>
                  }
                />
                <Route
                  path='/reset-password'
                  element={
                    <Suspense fallback={<Loader />}>
                      <ResetPassword />
                    </Suspense>
                  }
                />
                <Route
                  path='/payment-status'
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<Loader />}>
                        <PaymentStatus />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Panel Routes */}
                {/* Protected Admin Panel Routes */}
                <Route
                  path='/admin-panel/*'
                  element={
                    <ProtectedRoute requiredRole='admin'>
                      <Suspense fallback={<Loader />}>
                        <AdminPanel />
                      </Suspense>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AddProductForm />} />
                  <Route path='add-product' element={<AddProductForm />} />
                  <Route path='products' element={<ProductView />} />
                  <Route
                    path='orders'
                    element={<Orders userId={user?.userId} />}
                  />
                  <Route path='order/:orderId' element={<OrderDetail />} />{' '}
                </Route>

                {/* Protected User Panel Routes */}
                <Route
                  path='/user-panel/*'
                  element={
                    <ProtectedRoute requiredRole='user'>
                      <Suspense fallback={<Loader />}>
                        <UserPanel />
                      </Suspense>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<PersonalInformation />} />
                  <Route path='profile' element={<PersonalInformation />} />
                  <Route path='address-book' element={<AddressBook />} />
                  <Route
                    path='orders'
                    element={<UserOrders userId={user?.userId} />}
                  />
                  <Route
                    path='orders/:id'
                    element={<OrderDetails userId={user?.userId} />}
                  />
                  <Route
                    path='security'
                    element={<Security userId={user?.userId} />}
                  />
                  <Route path='help-support' element={<HelpSupport />} />
                </Route>

                <Route path='privacy-policy' element={<PrivacyPolicy />} />
              </Routes>
              <Footer />
              <ToastContainer
                position='bottom-right'
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
              />
            </Router>
          </CartProvider>
        </LoadingContext.Provider>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
