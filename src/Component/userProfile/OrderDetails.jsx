import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/api';

const OrderDetails = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const IMAGE_BASE_URL =
    import.meta.env.VITE_IMAGE_BASE_URL ||
    import.meta.env.VITE_API_URL.replace('/api', '');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');

        if (!token) {
          throw new Error('No authentication token found');
        }

        if (!id) {
          throw new Error('No order ID provided');
        }

        const data = await fetchWithAuth(`orders/details/${id}`, token);

        if (!data || !data.order) {
          throw new Error('Invalid order data received');
        }

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

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5C3822]'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-6xl mx-auto p-4 pt-28'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <h2 className='text-red-800 font-semibold mb-2'>Error</h2>
          <p className='text-red-600'>{error}</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className='max-w-6xl mx-auto p-4 pt-28'>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <h2 className='text-yellow-800 font-semibold mb-2'>No Order Found</h2>
          <p className='text-yellow-600'>
            The requested order could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto p-4 pt-28'>
      <h1 className='text-2xl font-bold mb-6 text-gray-800'>Order Details</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Order Info Section */}
        <div className='border p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Order Info</h2>
          <p className='mb-2'>
            <strong>Order Date:</strong>{' '}
            {new Date(orderDetails.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className='mb-2'>
            <strong>Delivery Date:</strong>{' '}
            {new Date(
              new Date(orderDetails.createdAt).getTime() +
                7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className='mb-2'>
            <strong>Order ID:</strong> #{orderDetails._id}
          </p>
          <p className='mb-2'>
            <strong>Total Spent:</strong> ₹{orderDetails.totalAmount}
          </p>
          <p className='mb-2'>
            <strong>Payment Method:</strong>{' '}
            {orderDetails.paymentMethod || 'N/A'}
          </p>
        </div>

        {/* Customer Info Section */}
        <div className='border p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Customer Info</h2>
          <p className='mb-2'>
            <strong>Name:</strong> {orderDetails.address?.deliveryName || 'N/A'}
          </p>
          <p className='mb-2'>
            <strong>Mobile Number:</strong>{' '}
            {orderDetails.address?.deliveryNumber || 'N/A'}
          </p>
          <p className='mb-2'>
            <strong>Address:</strong>{' '}
            {orderDetails.address ? (
              <span>
                {orderDetails.address.streetAddress},{' '}
                {orderDetails.address.city}, {orderDetails.address.state} -{' '}
                {orderDetails.address.zip}
              </span>
            ) : (
              'N/A'
            )}
          </p>
        </div>
      </div>

      {/* Items Section */}
      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4'>Items in Order</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {orderDetails.items.map((item) => (
            <div
              key={item._id}
              className='border rounded-lg shadow-md p-4 flex items-center'
            >
              <img
                src={
                  item.productId.image
                    ? `${IMAGE_BASE_URL}/${item.productId.image.replace(
                        /\\/g,
                        '/'
                      )}`
                    : 'https://via.placeholder.com/100'
                }
                alt={item.name || 'Product Image'}
                className='w-20 h-20 object-cover rounded mr-4'
              />
              <div>
                <p className='text-lg font-semibold text-gray-800'>
                  {item.name || 'Unknown Product'}
                </p>
                <p className='text-sm text-gray-600'>
                  Quantity: {item.quantity || 0}
                </p>
                <p className='text-sm text-gray-600'>
                  Price: ₹{item.price || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
