import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import OrderDetailsSkeleton from '../skeletons/OrderDetailsSkeleton';
import { toast } from 'react-toastify';

const OrderDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!token) throw new Error('No authentication token found');
        if (!id) throw new Error('No order ID provided');

        console.log('Fetching order details for ID:', id);

        // Fetch from your Supabase API
        const response = await fetch(`${API_URL}/orders/details/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Order details response:', data);

        if (!data || !data.order) {
          throw new Error('Invalid order data received');
        }

        // Transform the data to match your UI expectations
        const transformedOrder = {
          _id: data.order.id,
          id: data.order.id,
          totalAmount: data.order.total_amount,
          status: data.order.status,
          paymentStatus: data.order.payment_status,
          createdAt: data.order.created_at,
          updatedAt: data.order.updated_at,
          shippingAddress: data.order.shipping_address,
          deliveryCharges: data.order.delivery_charges || 0,
          cashfreeOrderId: data.order.cashfree_order_id,
          // Map the address from shippingAddress
          address: {
            deliveryName: data.order.shipping_address?.deliveryName || data.order.shipping_address?.delivery_name,
            deliveryNumber: data.order.shipping_address?.deliveryNumber || data.order.shipping_address?.delivery_number,
            streetAddress: data.order.shipping_address?.streetAddress || data.order.shipping_address?.street_address,
            city: data.order.shipping_address?.city,
            state: data.order.shipping_address?.state,
            zip: data.order.shipping_address?.zip,
          },
          items: data.order.order_items?.map(item => ({
            _id: item.id,
            productId: item.product_id,
            quantity: item.quantity,
            price: item.price,
            name: item.product_name,
            productDetails: {
              id: item.product_id,
              productName: item.product_name,
              price: item.price,
              image: 'https://via.placeholder.com/100',
            }
          })) || []
        };

        setOrderDetails(transformedOrder);

      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(error.message || 'Failed to fetch order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, token, API_URL]);

  // Function to check if order can be cancelled
  const canCancelOrder = (order) => {
    const cancellableStatuses = ['pending', 'confirmed', 'processing'];
    return cancellableStatuses.includes(order.status?.toLowerCase());
  };

  // Function to cancel order
  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setIsCancelling(true);

      const response = await fetch(`${API_URL}/orders/cancel/${id}`, {
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
        // Update the order status in state
        setOrderDetails(prev => ({
          ...prev,
          status: 'cancelled'
        }));
        toast.success('Order cancelled successfully');
      } else {
        throw new Error(data.message || 'Failed to cancel order');
      }

    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  // Function to get status badge style
  const getStatusBadgeStyle = (status) => {
    if (!status) return 'bg-gray-100 text-black';
    status = status.toLowerCase();
    if (status === 'delivered' || status === 'completed' || status === 'paid') {
      return 'bg-green-100 text-black border border-green-200';
    } else if (
      status === 'pending' ||
      status === 'processing' ||
      status === 'shipped'
    ) {
      return 'bg-yellow-100 text-black border border-yellow-200';
    } else if (
      status === 'cancelled' ||
      status === 'canceled' ||
      status === 'failed'
    ) {
      return 'bg-red-100 text-black border border-red-200';
    }
    return 'bg-amber-100 text-black border border-amber-900';
  };

  if (isLoading) return <OrderDetailsSkeleton />;

  if (error) {
    return (
      <div className='max-w-6xl mx-auto p-4'>
        <div className='bg-red-50 border-l-4 border-red-500 rounded-lg p-3 shadow-sm text-left'>
          <h2 className='text-amber-900 font-bold mb-1 flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 mr-1'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            Error
          </h2>
          <p className='text-black text-sm'>{error}</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className='max-w-6xl mx-auto p-4'>
        <div className='bg-yellow-50 border-l-4 border-amber-500 rounded-lg p-3 shadow-sm text-left'>
          <h2 className='text-amber-900 font-bold mb-1 flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 mr-1'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            No Order Found
          </h2>
          <p className='text-black text-sm'>
            The requested order could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto p-4 rounded-lg'>
      <div className='flex items-center justify-between mb-4 pb-2 border-b border-amber-900'>
        <div className='flex items-center'>
          <div className='bg-amber-900 rounded-full p-1 mr-3 shadow-sm'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 text-white'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='text-left'>
            <h1 className='text-2xl font-bold text-amber-900'>Order Details</h1>
            <p className='text-black text-sm'>
              View complete information about your order
            </p>
          </div>
        </div>
        
        {/* Cancel Order Button */}
        {canCancelOrder(orderDetails) && (
          <button
            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2'
            onClick={handleCancelOrder}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cancelling...
              </>
            ) : (
              'Cancel Order'
            )}
          </button>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
        {/* Order Info Section */}
        <div className='bg-white p-4 rounded-lg shadow-sm border border-amber-900 hover:shadow-md transition-shadow duration-300'>
          <h2 className='text-lg font-bold mb-3 text-amber-900 flex items-center pb-1 border-b border-amber-900'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 mr-1'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z'
                clipRule='evenodd'
              />
            </svg>
            Order Information
          </h2>
          <div className='space-y-2 text-left'>
            <div className='flex items-center text-black p-2 rounded-md'>
              <span className='font-semibold w-28 text-sm'>Order Date:</span>
              <span className='text-sm'>
                {new Date(orderDetails.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className='flex items-center text-black p-1'>
              <span className='font-semibold w-28 text-sm'>Delivery Date:</span>
              <span className='text-sm'>
                {new Date(
                  new Date(orderDetails.createdAt).getTime() +
                    7 * 24 * 60 * 60 * 1000
                ).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className='flex items-center text-black p-2 rounded-md'>
              <span className='font-semibold w-28 text-sm'>Order ID:</span>
              <span className='font-mono bg-white px-2 py-1 rounded-full text-xs border border-amber-900 shadow-sm'>
                #{orderDetails._id}
              </span>
            </div>
            <div className='flex items-center text-black p-1'>
              <span className='font-semibold w-28 text-sm'>Total Amount:</span>
              <span className='font-semibold'>₹{orderDetails.totalAmount}</span>
            </div>
            <div className='flex items-center text-black p-2 rounded-md'>
              <span className='font-semibold w-28 text-sm'>
                Delivery Status:
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusBadgeStyle(
                  orderDetails.status
                )}`}
              >
                {orderDetails.status || 'N/A'}
              </span>
            </div>
            <div className='flex items-center text-black p-1'>
              <span className='font-semibold w-28 text-sm'>
                Payment Status:
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusBadgeStyle(
                  orderDetails.paymentStatus
                )}`}
              >
                {orderDetails.paymentStatus || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Info Section */}
        <div className='bg-white p-4 rounded-lg shadow-sm border border-amber-900 hover:shadow-md transition-shadow duration-300'>
          <h2 className='text-lg font-bold mb-3 text-amber-900 flex items-center pb-1 border-b border-amber-900'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 mr-1'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                clipRule='evenodd'
              />
            </svg>
            Customer Information
          </h2>
          <div className='space-y-2 text-left'>
            <div className='flex items-start text-black p-2 rounded-md'>
              <span className='font-semibold w-28 text-sm'>Name:</span>
              <span className='font-medium text-sm'>
                {orderDetails.address?.deliveryName || 'N/A'}
              </span>
            </div>
            <div className='flex items-start text-black p-1'>
              <span className='font-semibold w-28 text-sm'>Mobile Number:</span>
              <span className='font-medium text-sm'>
                {orderDetails.address?.deliveryNumber || 'N/A'}
              </span>
            </div>
            <div className='flex items-start text-black p-2 rounded-md'>
              <span className='font-semibold w-28 text-sm mt-1'>Address:</span>
              <span className='text-sm'>
                {orderDetails.address ? (
                  <>
                    {orderDetails.address.streetAddress},<br />
                    {orderDetails.address.city}, {orderDetails.address.state} -{' '}
                    {orderDetails.address.zip}
                  </>
                ) : (
                  'N/A'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className='bg-white p-4 rounded-lg shadow-sm border border-amber-900'>
        <h2 className='text-lg font-bold mb-3 text-amber-900 flex items-center pb-1 border-b border-amber-900 text-left'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4 mr-1'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
          </svg>
          Items in Order ({orderDetails.items?.length || 0})
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
          {orderDetails.items && orderDetails.items.length > 0 ? (
            orderDetails.items.map((item) => (
              <div
                key={item._id}
                className='rounded-md shadow-sm p-2 flex items-center border border-amber-900 hover:border-amber-900 hover:shadow-md transition-all duration-300'
              >
                <div className='bg-white rounded-md p-1 mr-2 shadow-sm border'>
                  <img
                    src={item.productDetails?.image || 'https://via.placeholder.com/100'}
                    alt={item.name || 'Product Image'}
                    className='w-16 h-16 object-cover rounded-md'
                  />
                </div>
                <div className='text-left'>
                  <p className='text-sm font-semibold text-black mb-1'>
                    {item.name || item.productDetails?.productName || 'Unknown Product'}
                  </p>
                  <div className='bg-white px-2 py-1 rounded-md'>
                    <div className='flex items-center mb-0.5 text-black'>
                      <span className='font-medium text-xs'>
                        Quantity: {item.quantity || 0}
                      </span>
                    </div>
                    <div className='flex items-center text-black'>
                      <span className='font-semibold text-xs'>
                        Price: ₹{item.price || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full text-center text-gray-500 py-4'>
              No items found in this order
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
