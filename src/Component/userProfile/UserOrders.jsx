import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/api';
import { useNavigate, useOutletContext } from 'react-router-dom';
import '../css/Order.css';
import swipeArrow from '../../assets/svg/swipearrow.svg';
import UserOrdersSkeleton from '../skeletons/UserOrdersSkeleton';

const UserOrders = () => {
  const { userData } = useOutletContext();
  const [orders, setOrders] = useState([]); // State to store orders
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480); // State to track screen size for responsive design
  const [loading, setLoading] = useState(true); // Add loading state
  const [dataFetched, setDataFetched] = useState(false); // Add a flag to track if data has been fetched
  const navigate = useNavigate();

  // Update the screen size state on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch orders and their associated product details
  useEffect(() => {
    const fetchOrdersWithProductDetails = async () => {
      if (!userData?._id) return; // Don't run if there's no user ID

      try {
        setLoading(true); // Start loading state

        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No authentication token found. Redirecting to login.');
          return;
        }

        // For development only: add a delay to see the skeleton
        if (import.meta.env.DEV) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Fetch orders associated with the user
        const data = await fetchWithAuth(`/orders/${userData._id}`, token);
        const ordersWithDetails = await Promise.all(
          data.orders.map(async (order) => {
            // Fetch details for each product in the order
            const itemsWithDetails = await Promise.all(
              order.items.map(async (item) => {
                try {
                  const product = await fetchWithAuth(
                    `/products/${item.productId}`,
                    token
                  );
                  return { ...item, productDetails: product };
                } catch {
                  return { ...item, productDetails: null }; // Handle cases where product details are unavailable
                }
              })
            );
            return { ...order, items: itemsWithDetails }; // Combine order with product details
          })
        );

        setOrders(ordersWithDetails); // Update state with enriched orders
        setDataFetched(true); // Mark data as fetched
      } catch (error) {
        console.error(
          'Failed to fetch orders or product details:',
          error.message
        );
        setDataFetched(true); // Still mark as fetched even on error
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchOrdersWithProductDetails();
  }, [userData?._id]);

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
        {/* Existing render code for orders... */}
        {orders.map((order, index) => (
          <React.Fragment key={order._id}>
            {isMobile ? (
              /* Mobile layout for order card */
              <div className='order-row-mobile'>
                <img
                  src={
                    order.items[0]?.productDetails?.image ||
                    'https://via.placeholder.com/100'
                  }
                  alt={
                    order.items[0]?.productDetails?.productName ||
                    'Product Image'
                  }
                  className='order-img'
                />
                <div className='order-text'>
                  <p className='order-name'>
                    {order.items[0]?.productDetails?.productName ||
                      'Unknown Product'}
                  </p>
                  <p className='order-quantity'>
                    Quantity: {order.items[0]?.quantity || 0}
                  </p>
                  <p className='expected-delivery'>
                    Expected Delivery:{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
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
                  {order.items.length > 0 && (
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
