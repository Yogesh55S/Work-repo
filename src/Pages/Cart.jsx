import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useCart } from '../Component/providers/CartContext';
import { useAuth } from '../Component/providers/AuthContext';
import GuestCartService from '../services/GuestCartService';
import { useNavigate, Link } from 'react-router-dom';
import '../Component/css/AddressBook.css';
import emptyCart from '../assets/svg/empty-cart.svg';
import CartSkeleton from '../Component/skeletons/Cartskeleton';
import AddressForm from '../Component/AddressForm';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
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

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const { isLoggedIn, user } = useAuth();
  const userId = user?._id;
  const { removeFromCart, updateCartItemQuantity } = useCart();

  // Function to calculate delivery charges based on state
  const calculateDeliveryCharges = (state) => {
    if (!state) return 0;
    
    const nearDelhiStates = [
      'delhi', 
      'haryana',
      'chandigarh', // Fixed: made lowercase consistent
    ];
    
    const normalizedState = state.toLowerCase().trim();
    
    if (nearDelhiStates.includes(normalizedState)) {
      return 59;
    } else {
      return 99;
    }
  };

  // Calculate final delivery charges (considering free delivery threshold)
  const getFinalDeliveryCharges = (state, subtotal) => {
    if (subtotal >= 499) return 0;
    return calculateDeliveryCharges(state);
  };

  // Update delivery charges when address is selected
  useEffect(() => {
    if (selectedAddress?.state && totalAmount > 0) {
      const charges = getFinalDeliveryCharges(selectedAddress.state, totalAmount);
      setDeliveryCharges(charges);
    } else {
      setDeliveryCharges(0);
    }
  }, [selectedAddress, totalAmount]);

  // Check if user is logged in when trying to checkout
  useEffect(() => {
    if (showAddressModal && !isLoggedIn) {
      setShowAddressModal(false);
      setLoginPromptVisible(true);
    }
  }, [showAddressModal, isLoggedIn]);

  // Cashfree SDK loading
  useEffect(() => {
    const checkCashfreeSDK = () => {
      if (window.Cashfree) {
        console.log('Cashfree SDK is available');
        return true;
      }
      return false;
    };

    if (checkCashfreeSDK()) {
      return;
    }

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

    return () => {
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

    if (!window.Cashfree) {
      console.error('Cashfree SDK is not available');
      toast.error('Payment system is not ready. Please try again.');
      return;
    }

    try {
      setIsProcessing(true);

      // Calculate final delivery charges at checkout
      const finalDeliveryCharges = getFinalDeliveryCharges(selectedAddress.state, totalAmount);

      const response = await fetch(`${API_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          addressId: selectedAddress._id,
          deliveryCharges: finalDeliveryCharges,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      const data = await response.json();
      console.log('Backend response:', data);

      if (data.paymentSessionId) {
        localStorage.setItem('currentOrderId', data.orderId);

        const cashfree = window.Cashfree({
          mode: 'production'
        });

        const result = await cashfree.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: '_self'
        });
    
        console.log('Payment result:', result);
      } else {
        throw new Error('Payment session not created');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      let cartData = [];

      if (isLoggedIn && userId) {
        const response = await fetch(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();

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
        const guestCart = GuestCartService.getCart();
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

  const handleAddAddress = async (formData) => {
    try {
      if (
        !formData.deliveryName ||
        !formData.deliveryNumber ||
        !formData.streetAddress ||
        !formData.city ||
        !formData.state ||
        !formData.zip
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
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchAddresses();
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

  // Calculate final total with delivery charges
  const finalTotal = totalAmount + deliveryCharges;

  return (
    <div className='container mx-auto p-4 pt-28'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Your Cart</h1>

      {loading ? (
        <CartSkeleton />
      ) : cartItems.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <div className='bg-white p-8 rounded-lg shadow-md text-center max-w-md'>
            <img src={emptyCart} alt='empty-cart' className='max-w-xs mb-6 mx-auto' />
            <h4 className='text-xl font-semibold mb-3'>Your cart is empty</h4>
            <p className='text-gray-600 mb-6'>
              Browse our collections and find something special.
            </p>
            <Link to='/shop' className='brown-deep-button inline-block py-3 px-6 rounded-md'>
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className='flex flex-col lg:flex-row items-start gap-8'>
          {/* Cart Items */}
          <div className='flex-1 space-y-6 w-full'>
            <div className='bg-white rounded-lg shadow-md'>
              <div className='p-4 border-b'>
                <h2 className='text-xl font-semibold'>Cart Items ({cartItems.length})</h2>
              </div>
              
              {cartItems.map((item) => {
                const productId = item.productDetails?._id || item.productId;
                const productName = item.productDetails?.productName || 'Unknown Product';
                const productPrice = item.productDetails?.price || 0;
                const productImage = item.productDetails?.image;

                return (
                  <div
                    key={productId}
                    className='flex items-center border-b p-6 hover:bg-gray-50'
                  >
                    <img
                      src={productImage || 'https://via.placeholder.com/120'}
                      alt={productName}
                      className='w-24 h-24 md:w-28 md:h-28 object-cover rounded-md mr-4'
                    />
                    
                    <div className='flex-1'>
                      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                        <div className='mb-4 md:mb-0'>
                          <h3 className='font-semibold text-lg mb-2'>{productName}</h3>
                          <p className='text-xl font-bold text-amber-800'>₹{productPrice}</p>
                        </div>
                        
                        <div className='flex items-center gap-4'>
                          <div className='flex items-center gap-2'>
                            <label className='text-sm font-medium'>Qty:</label>
                            <select
                              value={item.quantity}
                              onChange={(e) => updateQuantity(productId, parseInt(e.target.value, 10))}
                              className='border border-gray-300 rounded px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                            >
                              {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className='text-right'>
                            <p className='font-bold text-lg'>₹{(productPrice * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className='mt-3'>
                        <button
                          onClick={() => handleRemoveItem(productId)}
                          className='text-red-600 hover:text-red-800 text-sm font-medium'
                        >
                          Remove Item
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className='w-full lg:w-[350px]'>
            <div className='bg-white rounded-lg shadow-md p-6 sticky top-6'>
              <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
              
              <div className='space-y-3 mb-6'>
                <div className='flex justify-between'>
                  <span>Subtotal ({cartItems.length} items):</span>
                  <span className='font-semibold'>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Delivery Charges:</span>
                  {!selectedAddress ? (
                    <span className='text-gray-500'>Select address to calculate</span>
                  ) : deliveryCharges === 0 ? (
                    <span className='text-green-600 font-semibold'>FREE</span>
                  ) : (
                    <span className='font-semibold'>₹{deliveryCharges}</span>
                  )}
                </div>
                {totalAmount < 499 && totalAmount > 0 && (
                  <div className='text-sm text-amber-600 bg-amber-50 p-2 rounded'>
                    Add ₹{(499 - totalAmount).toLocaleString()} more for FREE delivery!
                  </div>
                )}
                <div className='border-t pt-3'>
                  <div className='flex justify-between text-lg font-bold'>
                    <span>Total:</span>
                    <span className='text-amber-800'>
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    fetchAddresses();
                    setShowAddressModal(true);
                  } else {
                    setLoginPromptVisible(true);
                  }
                }}
                className='brown-deep-button w-full py-3 rounded-md font-semibold'
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
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4'>
          <div className='bg-white p-6 rounded-lg max-w-md w-full'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>Sign in to continue</h2>
              <button
                onClick={() => setLoginPromptVisible(false)}
                className='text-gray-500 hover:text-gray-700 text-xl'
              >
                ×
              </button>
            </div>
            
            <p className='mb-6 text-gray-600'>
              Please sign in to continue with your purchase. Your cart items will be saved.
            </p>
            
            <div className='flex gap-4'>
              <button
                onClick={() => setLoginPromptVisible(false)}
                className='flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setLoginPromptVisible(false);
                  navigate('/login', { state: { returnUrl: '/cart' } });
                }}
                className='flex-1 brown-deep-button py-2 px-4 rounded-md font-semibold'
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4'>
          <div className='bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold'>Select an Address</h2>
              <button
                onClick={() => setShowAddressModal(false)}
                className='text-gray-500 hover:text-gray-700 text-xl'
              >
                ×
              </button>
            </div>

            {addressesLoading ? (
              <div className='space-y-4'>
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className='border p-4 rounded-lg flex items-center gap-4'
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
              <div className='space-y-4 mb-6'>
                {addresses.map((address) => {
                  const addressDeliveryCharge = getFinalDeliveryCharges(address.state, totalAmount);
                  
                  return (
                    <div
                      key={address._id}
                      className={`border p-4 rounded-lg flex items-start gap-4 cursor-pointer hover:bg-gray-50 ${
                        selectedAddress?._id === address._id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <input
                        type='radio'
                        name='address'
                        value={address._id}
                        checked={selectedAddress?._id === address._id}
                        onChange={() => setSelectedAddress(address)}
                        className='mt-1'
                      />
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <p className='font-semibold mb-1'>{address.deliveryName}</p>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            addressDeliveryCharge === 0
                              ? 'bg-green-100 text-green-800' 
                              : addressDeliveryCharge === 59 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {addressDeliveryCharge === 0
                              ? 'FREE delivery' 
                              : `₹${addressDeliveryCharge} delivery`}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600 mb-1'>
                          {address.streetAddress}, {address.city}, {address.state} - {address.zip}
                        </p>
                        <p className='text-sm text-gray-600'>{address.deliveryNumber}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className='text-center py-8 text-gray-600'>No saved addresses. Please add one.</p>
            )}

            <div className='flex gap-4 justify-center'>
              <button
                onClick={() => setShowAddAddressForm(true)}
                className='py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
              >
                Add Address
              </button>
              <button
                onClick={handleCheckout}
                disabled={!selectedAddress || isProcessing}
                className={`py-2 px-6 rounded-md font-semibold ${
                  selectedAddress && !isProcessing
                    ? 'brown-deep-button'
                    : 'bg-gray-300 cursor-not-allowed text-gray-600'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Form */}
      {showAddAddressForm && (
        <AddressForm
          initialData={newAddressInitialState}
          onSave={handleAddAddress}
          onCancel={() => setShowAddAddressForm(false)}
        />
      )}
    </div>
  );
};

export default Cart;