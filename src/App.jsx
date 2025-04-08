import { useState, useEffect, createContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './Component/Navbar';
import Footer from './Component/Footer';
import Home from './Pages/Home';
import WinterCollection from './Pages/WinterCollection';
import Shop from './Pages/Shop';
import Contact from './Pages/Contact';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import Register from './Pages/Register';
import VerifyOTP from './Pages/VerifyOtp';
import Unauthorized from './Pages/Unauthorized';
import ForgotPassword from './Pages/Forgotpassword';
import ResetPassword from './Pages/ResetPassword';
import PaymentStatus from './Pages/PaymentStatus';

// Admin Panel Components
import AdminPanel from './Pages/AdminPanal';
import AddProductForm from './Component/admin/AddProductForm';
import ProductView from './Component/admin/ProductView';
import Orders from './Component/admin/Orders';
import Settings from './Component/admin/Settings';

// User Panel Components
import UserPanel from './Pages/UserPanel';
import PersonalInformation from './Component/userProfile/PersonalInformation';
import AddressBook from './Component/userProfile/AddressBook';
import UserOrders from './Component/userProfile/UserOrders';
import OrderDetails from './Component/userProfile/OrderDetails';
import Payment from './Component/userProfile/Payment';
import Security from './Component/userProfile/Security';
import HelpSupport from './Component/userProfile/HelpSupport';
import ProductDetail from './Component/ProductDetail';

// Create AuthContext
export const AuthContext = createContext();

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

// Protected Route Component
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
  const [cartCount, setCartCount] = useState(0);

  // Initialize user data from token
  useEffect(() => {
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
  }, []);

  // Fetch cart count when user logs in
  useEffect(() => {
    if (user?.userId) {
      fetchCartCount(user.userId);
    }
  }, [user]);

  const fetchCartCount = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        const totalItems = data.cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setCartCount(0); // Reset cart count on logout
    localStorage.removeItem('authToken');
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ user, logout }}>
        <Router>
          <Navbar cartCount={cartCount} setCartCount={setCartCount} />
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/winter-collection' element={<WinterCollection />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/contact' element={<Contact />} />
            <Route
              path='/product/:id'
              element={<ProductDetail setCartCount={setCartCount} />}
            />
            <Route path='/cart' element={<Cart userId={user?.userId} />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/verify-otp' element={<VerifyOTP />} />
            <Route path='/unauthorized' element={<Unauthorized />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route
              path='/payment-status'
              element={
                <ProtectedRoute>
                  <PaymentStatus />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Panel Routes */}
            <Route
              path='/admin-panel/*'
              element={
                <ProtectedRoute requiredRole='admin'>
                  <AdminPanel />
                </ProtectedRoute>
              }
            >
              <Route index element={<AddProductForm />} />

              <Route path='add-product' element={<AddProductForm />} />
              <Route path='products' element={<ProductView />} />
              <Route path='orders' element={<Orders userId={user?.userId} />} />
              <Route path='settings' element={<Settings />} />
            </Route>

            {/* Protected User Panel Routes */}
            <Route
              path='/user-panel/*'
              element={
                <ProtectedRoute requiredRole='user'>
                  <UserPanel />
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
              <Route path='payment' element={<Payment />} />
              <Route
                path='security'
                element={<Security userId={user?.userId} />}
              />
              <Route path='help-support' element={<HelpSupport />} />
            </Route>
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
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
