import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/api';
import OrderDetailsSkeleton from '../skeletons/OrderDetailsSkeleton';

const OrderDetails = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No authentication token found');
        if (!id) throw new Error('No order ID provided');

        const data = await fetchWithAuth(`orders/details/${id}`, token);
        if (!data || !data.order)
          throw new Error('Invalid order data received');

        setOrderDetails(data.order);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(error.message || 'Failed to fetch order details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  // Function to get status badge style
  const getStatusBadgeStyle = (status) => {
    if (!status) return 'bg-gray-100  text-black';
    status = status.toLowerCase();
    if (status === 'delivered' || status === 'completed' || status === 'paid') {
      return 'bg-green-100  text-black border border-green-200';
    } else if (
      status === 'pending' ||
      status === 'processing' ||
      status === 'shipped'
    ) {
      return 'bg-yellow-100  text-black border border-yellow-200';
    } else if (
      status === 'cancelled' ||
      status === 'canceled' ||
      status === 'failed'
    ) {
      return 'bg-red-100  text-black border border-red-200';
    }
    return 'bg-amber-100  text-black border border-amber-900';
  };

  if (isLoading) return <OrderDetailsSkeleton />;

  if (error) {
    return (
      <div className='max-w-6xl mx-auto p-4'>
        <div className='bg-red-50 border-l-4 border-red-500 rounded-lg p-3 shadow-sm text-left'>
          <h2 className=' text-amber-900 font-bold mb-1 flex items-center'>
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
          <p className=' text-black text-sm'>{error}</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className='max-w-6xl mx-auto p-4'>
        <div className='bg-yellow-50 border-l-4 border-amber-500 rounded-lg p-3 shadow-sm text-left'>
          <h2 className=' text-amber-900 font-bold mb-1 flex items-center'>
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
          <p className=' text-black text-sm'>
            The requested order could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto p-4   rounded-lg'>
      <div className='flex items-center mb-4 pb-2 border-b border-amber-900'>
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
          <h1 className='text-2xl font-bold  text-amber-900'>Order Details</h1>
          <p className=' text-black text-sm'>
            View complete information about your order
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
        {/* Order Info Section */}
        <div className='bg-white p-4 rounded-lg shadow-sm border border-amber-900 hover:shadow-md transition-shadow duration-300'>
          <h2 className='text-lg font-bold mb-3  text-amber-900 flex items-center pb-1 border-b border-amber-900'>
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
            <div className='flex items-center  text-black   p-2 rounded-md'>
              <span className='font-semibold w-28 text-sm'>Order Date:</span>
              <span className='text-sm'>
                {new Date(orderDetails.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className='flex items-center  text-black p-1'>
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
            <div className='flex items-center  text-black   p-2 rounded-md'>
              <span className='font-semibold w-28 text-sm'>Order ID:</span>
              <span className='font-mono bg-white px-2 py-1 rounded-full text-xs border border-amber-900 shadow-sm'>
                #{orderDetails._id}
              </span>
            </div>
            <div className='flex items-center  text-black p-1'>
              <span className='font-semibold w-28 text-sm'>Total Amount:</span>
              <span className='font-semibold'>{orderDetails.totalAmount}</span>
            </div>
            <div className='flex items-center  text-black   p-2 rounded-md'>
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
            <div className='flex items-center  text-black p-1'>
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
          <h2 className='text-lg font-bold mb-3  text-amber-900 flex items-center pb-1 border-b border-amber-900'>
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
            <div className='flex items-start  text-black   p-2 rounded-md'>
              <span className='font-semibold w-28 text-sm'>Name:</span>
              <span className='font-medium text-sm'>
                {orderDetails.address?.deliveryName || 'N/A'}
              </span>
            </div>
            <div className='flex items-start  text-black p-1'>
              <span className='font-semibold w-28 text-sm'>Mobile Number:</span>
              <span className='font-medium text-sm'>
                {orderDetails.address?.deliveryNumber || 'N/A'}
              </span>
            </div>
            <div className='flex items-start  text-black   p-2 rounded-md'>
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
        <h2 className='text-lg font-bold mb-3  text-amber-900 flex items-center pb-1 border-b border-amber-900 text-left'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4 mr-1'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
          </svg>
          Items in Order ({orderDetails.items.length})
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
          {orderDetails.items.map((item) => (
            <div
              key={item._id}
              className='  rounded-md shadow-sm p-2 flex items-center border border-amber-900 hover:border-amber-900 hover:shadow-md transition-all duration-300'
            >
              <div className='bg-white rounded-md p-1 mr-2 shadow-sm border '>
                <img
                  src={
                    item.productId.image || 'https://via.placeholder.com/100'
                  }
                  alt={item.productId.name || 'Product Image'}
                  className='w-16 h-16 object-cover rounded-md'
                />
              </div>
              <div className='text-left'>
                <p className='text-sm font-semibold  text-black mb-1'>
                  {item.name || 'Unknown Product'}
                </p>
                <div className='bg-white px-2 py-1 rounded-md  '>
                  <div className='flex items-center mb-0.5  text-black'>
                    {/* <svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-3 w-3 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
											/>
										</svg> */}
                    <span className='font-medium text-xs'>
                      Quantity: {item.quantity || 0}
                    </span>
                  </div>
                  <div className='flex items-center  text-black'>
                    {/* <svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-3 w-3 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg> */}
                    <span className='font-semibold text-xs'>
                      Price: {item.price || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
