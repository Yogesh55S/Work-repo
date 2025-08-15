import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import '../css/Order.css';
import swipeArrow from '../../assets/svg/swipearrow.svg';
import UserOrdersSkeleton from '../skeletons/UserOrdersSkeleton';
import { toast } from 'react-toastify';

const UserOrders = () => {
  const { userData } = useOutletContext();
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [cancellingOrders, setCancellingOrders] = useState(new Set());
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // Update the screen size state on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrdersFromSupabase = async () => {
      if (!user?.id || !token) return;

      try {
        setLoading(true);

        // For development only: add a delay to see the skeleton
        if (import.meta.env.DEV) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log('Fetching orders for user:', user.id);

        // Fetch orders from your Supabase API
        const response = await fetch(`${API_URL}/orders/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched orders:', data);

        // Transform the data to match your UI expectations
        const transformedOrders = data.orders.map(order => ({
          _id: order.id,
          id: order.id,
          totalAmount: order.total_amount,
          status: order.status,
          paymentStatus: order.payment_status,
          createdAt: order.created_at,
          shippingAddress: order.shipping_address,
          deliveryCharges: order.delivery_charges || 0,
          items: order.order_items?.map(item => ({
            productId: item.product_id,
            quantity: item.quantity,
            price: item.price,
            productDetails: {
              id: item.product_id,
              productName: item.product_name,
              price: item.price,
              image: 'https://via.placeholder.com/100', // Placeholder for now
            }
          })) || []
        }));

        setOrders(transformedOrders);
        setDataFetched(true);

      } catch (error) {
        console.error('Failed to fetch orders:', error.message);
        toast.error('Failed to load orders');
        setDataFetched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersFromSupabase();
  }, [user?.id, token, API_URL]);

  // Function to check if order can be cancelled
  const canCancelOrder = (order) => {
    const cancellableStatuses = ['pending', 'confirmed', 'processing'];
    return cancellableStatuses.includes(order.status?.toLowerCase());
  };

  // Function to cancel order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancellingOrders(prev => new Set([...prev, orderId]));

      const response = await fetch(`${API_URL}/orders/cancel/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel order');
      }

      const data = await response.json();
      
      if (data.success) {
        // Update the order in the state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId || order.id === orderId
              ? { ...order, status: 'cancelled' }
              : order
          )
        );
        toast.success('Order cancelled successfully');
      } else {
        throw new Error(data.message || 'Failed to cancel order');
      }

    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setCancellingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Function to get status badge style
  const getStatusBadgeStyle = (status) => {
    if (!status) return 'bg-gray-100 text-black';
    status = status.toLowerCase();
    if (status === 'delivered' || status === 'completed' || status === 'paid') {
      return 'bg-green-100 text-green-800';
    } else if (
      status === 'pending' ||
      status === 'processing' ||
      status === 'shipped' ||
      status === 'confirmed'
    ) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (
      status === 'cancelled' ||
      status === 'canceled' ||
      status === 'failed'
    ) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  // Show skeleton while loading
  if (loading) {
    return <UserOrdersSkeleton />;
  }

  // Only show "No orders found" after data has been fetched and orders array is empty
  if (dataFetched && orders.length === 0) {
    return <p className='p-4 text-center text-gray-600'>No orders found.</p>;
  }

  // Rest of the component remains the same
  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6 text-gray-800'>Your Orders</h1>
      <div className='user-orders-scroll-container'>
        {orders.map((order, index) => (
          <React.Fragment key={order._id}>
            {isMobile ? (
              /* Mobile layout for order card */
              <div className='order-row-mobile'>
                <img
                  src={
                    order.items && order.items.length > 0 && order.items[0]?.productDetails?.image
                      ? order.items.productDetails.image
                      : 'https://via.placeholder.com/100'
                  }
                  alt={
                    order.items && order.items.length > 0 && order.items[0]?.productDetails?.productName
                      ? order.items.productDetails.productName
                      : 'Product Image'
                  }
                  className='order-img'
                />
                <div className='order-text'>
                  <p className='order-name'>
                    {order.items && order.items.length > 0 && order.items[0]?.productDetails?.productName
                      ? order.items.productDetails.productName
                      : 'Unknown Product'}
                  </p>
                  <p className='order-quantity'>
                    Quantity: {order.items && order.items.length > 0 && order.items[0]?.quantity
                      ? order.items.quantity
                      : 0}
                  </p>
                  <p className='expected-delivery'>
                    Expected Delivery:{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {/* Status Badge for Mobile */}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadgeStyle(order.status)}`}>
                    {order.status === 'cancelled' ? 'Cancelled' : order.status}
                  </span>
                </div>
                <div
                  className='order-arrow'
                  onClick={() => navigate(`/user-panel/orders/${order._id}`)}
                >
                  <img src={swipeArrow} alt='Swipe Arrow' />
                </div>
              </div>
            ) : (
              /* Desktop layout for order card */
              <div className='border border-[#5C3822] rounded-lg mb-6 overflow-hidden bg-white'>
                <div className='bg-[#5C3822] text-white p-4 flex justify-between items-center'>
                  <div>
                    <p className='order-label'>Order Placed:</p>
                    <p className='order-value flex'>
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className='order-label'>Order ID:</p>
                    <p className='order-value'>#{order._id}</p>
                  </div>
                  <div>
                    <p className='order-label'>Total:</p>
                    <p className='order-value'>₹{order.totalAmount}</p>
                  </div>
                  <div>
                    <p className='order-label'>Status:</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(order.status)}`}>
                      {order.status === 'cancelled' ? 'Cancelled' : order.status}
                    </span>
                  </div>
                </div>
                <div className='p-4 bg-gray-50'>
                  <p className='text-gray-700 font-medium mb-2'>
                    <span className='font-semibold text-gray-800'>
                      Expected Delivery:
                    </span>{' '}
                    {new Date(
                      new Date(order.createdAt).getTime() +
                        7 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {order.items && order.items.length > 0 ? (
                    <div className='flex items-center mb-4'>
                      <img
                        src={
                          order.items[0]?.productDetails?.image ||
                          'https://via.placeholder.com/100'
                        }
                        alt={
                          order.items[0]?.productDetails?.productName ||
                          'Product Image'
                        }
                        className='w-20 h-20 object-cover rounded mr-4'
                      />
                      <div className='flex-grow'>
                        <p className='text-lg font-semibold text-gray-800'>
                          {order.items[0]?.productDetails?.productName ||
                            'Unknown Product'}
                        </p>
                        <p className='text-sm text-gray-600'>
                          Quantity: {order.items[0]?.quantity || 0}
                        </p>
                        {order.items.length > 1 && (
                          <p className='text-xs text-gray-500'>
                            +{order.items.length - 1} more item(s)
                          </p>
                        )}
                      </div>
                      <div className='flex flex-col gap-2'>
                        <button
                          className='view-order bg-[#B09383] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#6E422A] transition'
                          onClick={() =>
                            navigate(`/user-panel/orders/${order._id}`)
                          }
                        >
                          VIEW ORDER
                        </button>
                        
                        {/* Cancel Order Button for Desktop */}
                        {canCancelOrder(order) && (
                          <button
                            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed'
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingOrders.has(order._id)}
                          >
                            {cancellingOrders.has(order._id) ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className='flex items-center mb-4'>
                      <img
                        src='https://via.placeholder.com/100'
                        alt='No items'
                        className='w-20 h-20 object-cover rounded mr-4'
                      />
                      <div className='flex-grow'>
                        <p className='text-lg font-semibold text-gray-800'>No items found</p>
                        <p className='text-sm text-gray-600'>Quantity: 0</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {index < orders.length - 1 && <hr className='order-divider' />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;
