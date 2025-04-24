import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useCart } from '../Component/providers/CartContext';
import { useAuth } from '../Component/providers/AuthContext';
import GuestCartService from '../services/GuestCartService';
import { useNavigate, Link } from 'react-router-dom';
import '../Component/css/AddressBook.css';
import emptyCart from '../assets/svg/empty-cart.svg';
import CartSkeleton from '../Component/skeletons/Cartskeleton';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [loginPromptVisible, setLoginPromptVisible] = useState(false);

  const newAddressInitialState = {
    tag: 'home',
    deliveryName: '',
    deliveryNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
  };

  const [newAddress, setNewAddress] = useState(newAddressInitialState);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const { isLoggedIn, user } = useAuth();
  const userId = user?._id;
  const { removeFromCart, updateCartItemQuantity } = useCart();

  // Check if user is logged in when trying to checkout
  useEffect(() => {
    if (showAddressModal && !isLoggedIn) {
      setShowAddressModal(false);
      setLoginPromptVisible(true);
    }
  }, [showAddressModal, isLoggedIn]);

  useEffect(() => {
    // Simple function to check if Cashfree SDK is available
    const checkCashfreeSDK = () => {
      if (window.Cashfree) {
        console.log('Cashfree SDK is available');
        return true;
      }
      return false;
    };

    // Check if SDK is already loaded
    if (checkCashfreeSDK()) {
      return;
    }

    // If not loaded, try to load it
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => {
      console.log('Cashfree SDK script loaded');
      checkCashfreeSDK();
    };
    script.onerror = () => {
      console.error('Failed to load Cashfree SDK script');
    };
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // Remove any script elements we added
      const scripts = document.querySelectorAll(
        'script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]'
      );
      scripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      setLoginPromptVisible(true);
      return;
    }

    if (!selectedAddress) {
      toast.info('Please select an address first!');
      return;
    }

    // Check if Cashfree SDK is available
    if (!window.Cashfree) {
      console.error('Cashfree SDK is not available at checkout time');
      alert('Payment system is not ready. Please try again in a moment.');
      return;
    }

    try {
      setIsProcessing(true);

      // Step 1: Create order on your backend
      const response = await fetch(`${API_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          addressId: selectedAddress._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      const data = await response.json();
      console.log('Checkout response data:', data);

      // Process with Cashfree
      if (window.Cashfree && data.paymentSessionId) {
        localStorage.setItem('currentOrderId', data.orderId);

        const cashfree = window.Cashfree({
          mode: 'production', // or "sandbox" for testing
        });

        cashfree
          .checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: '_self',
          })
          .then(() => {
            console.log('Cashfree checkout completed');
          })
          .catch((error) => {
            console.error('Error during Cashfree checkout:', error);
            throw new Error('Failed to complete payment');
          });
      } else {
        throw new Error('Invalid payment data received from server');
      }
    } catch (error) {
      console.error('Error during checkout:', error.message);
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      let cartData = [];

      if (isLoggedIn && userId) {
        // Fetch authenticated user's cart
        const response = await fetch(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();

          // Get full product details for each cart item
          cartData = await Promise.all(
            userData.cart.map(async (item) => {
              try {
                const productResponse = await fetch(
                  `${API_URL}/products/${item.productId}`
                );

                if (productResponse.ok) {
                  const productData = await productResponse.json();
                  return {
                    ...item,
                    productDetails: productData,
                  };
                }
                return item;
              } catch (error) {
                console.error(
                  `Error fetching product ${item.productId}:`,
                  error
                );
                return item;
              }
            })
          );
        }
      } else {
        // Get guest cart from localStorage
        const guestCart = GuestCartService.getCart();
        // For guest cart, we already have product details stored
        cartData = guestCart;
      }
      setCartItems(cartData);
    } catch (error) {
      console.error('Error fetching cart items:', error.message);
      toast.error('Failed to load your cart items');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    if (!isLoggedIn || !userId) {
      setAddressesLoading(false);
      return;
    }

    try {
      setAddressesLoading(true);

      const response = await fetch(`${API_URL}/addresses/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error.message);
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      // Validate address fields
      if (
        !newAddress.deliveryName ||
        !newAddress.deliveryNumber ||
        !newAddress.streetAddress ||
        !newAddress.city ||
        !newAddress.state ||
        !newAddress.zip
      ) {
        toast.error('Please fill in all required fields');
        return;
      }

      const response = await fetch(`${API_URL}/addresses/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        await fetchAddresses();
        setNewAddress(newAddressInitialState);
        setShowAddAddressForm(false);
        toast.success('Address added successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error.message);
      toast.error('Error adding address');
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      // First update local state for immediate feedback
      const updatedCart = cartItems.map((item) => {
        if (
          item.productId === productId ||
          (item.productDetails && item.productDetails._id === productId)
        ) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedCart);

      // Then update cart in backend/localStorage
      let success = false;

      if (isLoggedIn && userId) {
        success = await updateCartItemQuantity(userId, productId, newQuantity);
      } else {
        success = GuestCartService.updateQuantity(productId, newQuantity);
      }

      if (!success) {
        throw new Error('Failed to update cart');
      }

      toast.success('Cart updated successfully');
    } catch (error) {
      console.error('Error updating cart quantity:', error.message);
      toast.error('Failed to update quantity');

      // Revert to previous state on error by re-fetching cart
      fetchCartItems();
    }
  };

  const calculateTotal = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + (item.productDetails?.price || 0) * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  const handleRemoveItem = async (productId) => {
    try {
      let success = false;

      if (isLoggedIn && userId) {
        success = await removeFromCart(userId, productId);
      } else {
        success = GuestCartService.removeFromCart(productId);
      }

      if (success) {
        setCartItems(
          cartItems.filter((item) => {
            const itemId = item.productDetails?._id || item.productId;
            return itemId !== productId;
          })
        );
        toast.success('Item removed from cart');
      } else {
        toast.error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error removing item from cart');
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [isLoggedIn, userId]);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  return (
    <div className='container mx-auto p-4 pt-28'>
      <h1 className='text-2xl font-bold mb-5'>Your Cart</h1>

      {/* Show skeleton while loading */}
      {loading ? (
        <CartSkeleton />
      ) : cartItems.length === 0 ? (
        <div className='flex flex-col items-center justify-center'>
          <img src={emptyCart} alt='empty-cart' className='max-w-xs mb-4' />
          <h4 className='text-xl font-medium mb-2'>Nothing Here Yet!</h4>
          <p className='text-gray-500 mb-6'>
            Browse our collections and find something special.
          </p>
          <Link to='/products' className='brown-deep-button'>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className='flex flex-col lg:flex-row items-start gap-5'>
          {/* Cart Items */}
          <div className='flex-1 space-y-4 w-full'>
            {cartItems.map((item) => {
              const productId = item.productDetails?._id || item.productId;
              const productName =
                item.productDetails?.productName || 'Unknown Product';
              const productPrice = item.productDetails?.price || 0;
              const productImage = item.productDetails?.image;

              return (
                <div
                  key={productId}
                  className='flex items-start border-b-2 p-4 sm:p-2'
                >
                  <img
                    src={productImage || 'https://via.placeholder.com/100'}
                    alt={productName}
                    className='md:w-24 md:h-24 sm:w-32 sm:h-32 object-cover mr-4'
                  />
                  <div className='flex-1'>
                    <div className='flex justify-between md:items-center'>
                      <h3 className='font-semibold text-sm sm:text-base md:text-lg'>
                        {productName}
                      </h3>
                      <p className='text-gray-700 font-medium text-base mt-10 md:mt-0'>
                        ₹{productPrice}
                      </p>
                    </div>

                    <div className='mt-2 flex items-center gap-2'>
                      <label htmlFor='qty' className='text-sm text-gray-600'>
                        Qty:
                      </label>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            productId,
                            parseInt(e.target.value, 10)
                          )
                        }
                        className='border rounded px-2 py-1'
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='mt-2 text-sm text-red-600 flex gap-4'>
                      <button onClick={() => handleRemoveItem(productId)}>
                        Remove Item
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className='w-full lg:w-[350px] bg-gray-100 p-4 rounded-lg sticky top-6 lg:self-start'>
            <div className='text-xl font-semibold flex justify-between'>
              <span>Subtotal ({cartItems.length} items):</span>
              <span className='text-black font-bold'>₹{totalAmount}</span>
            </div>
            <div className='flex justify-center mt-6'>
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    fetchAddresses();
                    setShowAddressModal(true);
                  } else {
                    setLoginPromptVisible(true);
                  }
                }}
                className='brown-deep-button'
                style={{ width: '100%' }}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Proceed to Buy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      {loginPromptVisible && (
        <div className='fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg max-w-md w-full relative'>
            <button
              onClick={() => setLoginPromptVisible(false)}
              className='absolute top-3 right-3 text-xl'
            >
              &times;
            </button>
            <h2 className='text-xl font-bold mb-4'>Sign in to continue</h2>
            <p className='mb-4'>
              Please sign in to continue with your purchase. Your cart items
              will be saved.
            </p>
            <div className='flex gap-4 justify-end'>
              <button
                onClick={() => setLoginPromptVisible(false)}
                className='px-4 py-2 border rounded'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setLoginPromptVisible(false);
                  navigate('/login', { state: { returnUrl: '/cart' } });
                }}
                className='brown-deep-button'
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className='fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg max-w-lg w-full relative'>
            <button
              onClick={() => setShowAddressModal(false)}
              className='absolute top-3 right-3 text-xl'
            >
              &times;
            </button>
            <h2 className='text-xl font-bold mb-4'>Select an Address</h2>

            {addressesLoading ? (
              // Skeleton loader for addresses
              <div className='space-y-4'>
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className='border p-4 rounded flex items-center gap-4'
                  >
                    <div className='w-4 h-4 bg-gray-200 rounded-full animate-pulse'></div>
                    <div className='flex-1'>
                      <div className='h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse'></div>
                      <div className='h-4 bg-gray-200 rounded w-full mb-2 animate-pulse'></div>
                      <div className='h-4 bg-gray-200 rounded w-1/2 animate-pulse'></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : addresses.length > 0 ? (
              <div className='space-y-4'>
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`border p-4 rounded flex items-center gap-4 ${
                      selectedAddress?._id === address._id
                        ? 'border-blue-500 bg-blue-50'
                        : ''
                    }`}
                  >
                    <input
                      type='radio'
                      name='address'
                      id={`address-${address._id}`}
                      value={address._id}
                      checked={selectedAddress?._id === address._id}
                      onChange={() => setSelectedAddress(address)}
                    />
                    <label
                      htmlFor={`address-${address._id}`}
                      className='flex-1 cursor-pointer'
                    >
                      <p className='font-bold'>{address.deliveryName}</p>
                      <p className='text-sm'>
                        {address.streetAddress}, {address.city}, {address.state}{' '}
                        - {address.zip}
                      </p>
                      <p className='text-sm'>{address.deliveryNumber}</p>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p>No saved addresses. Please add one.</p>
            )}

            <div className='flex gap-4 mt-4 justify-center'>
              <button
                onClick={() => setShowAddAddressForm(true)}
                className='brown-deep-button bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
              >
                Add Address
              </button>
              <button
                onClick={handleCheckout}
                disabled={!selectedAddress || isProcessing}
                className={`brown-deep-button ${
                  selectedAddress && !isProcessing
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 cursor-not-allowed text-gray-600'
                } px-4 py-2 rounded`}
              >
                {isProcessing ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Form */}
      {showAddAddressForm && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h3 className='modal-title'>Add New Address</h3>
            <div className='modal-grid'>
              <div className='form-group full-width'>
                <label>Name *</label>
                <input
                  type='text'
                  name='deliveryName'
                  value={newAddress.deliveryName}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      deliveryName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className='form-group full-width'>
                <label>Mobile Number *</label>
                <input
                  type='text'
                  name='deliveryNumber'
                  value={newAddress.deliveryNumber}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      deliveryNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className='form-group full-width'>
                <label>Street Address *</label>
                <input
                  type='text'
                  name='streetAddress'
                  value={newAddress.streetAddress}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      streetAddress: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className='form-group'>
                <label>City *</label>
                <input
                  type='text'
                  name='city'
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-group'>
                <label>State *</label>
                <input
                  type='text'
                  name='state'
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-group'>
                <label>ZIP *</label>
                <input
                  type='text'
                  name='zip'
                  value={newAddress.zip}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-group'>
                <label>Tag *</label>
                <select
                  name='tag'
                  value={newAddress.tag}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, tag: e.target.value })
                  }
                >
                  <option value='home'>Home</option>
                  <option value='work'>Work</option>
                  <option value='other'>Other</option>
                </select>
              </div>
            </div>
            <div className='modal-actions'>
              <button
                onClick={() => setShowAddAddressForm(false)}
                className='cancel-btn'
              >
                CANCEL
              </button>
              <button onClick={handleAddAddress} className='save-btn'>
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
