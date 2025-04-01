import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/api';

const OrderDetails = () => {
  const { orderId } = useParams(); // Retrieve the order ID from the route params
  const [orderDetails, setOrderDetails] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const IMAGE_BASE_URL =
    import.meta.env.VITE_IMAGE_BASE_URL || API_URL.replace('/api', '');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No token found in localStorage.');
          return;
        }

        console.log(`Fetching order details for orderId: ${orderId}`);

        const data = await fetchWithAuth(
          `${API_URL}/orders/details/${orderId}`,
          token,
          { method: 'GET' }
        );
        console.log('API Response:', data);

        if (data && data.order) {
          setOrderDetails(data.order);
        } else {
          console.error('Order data not found in API response:', data);
        }
      } catch (error) {
        console.error('Error fetching order details:', error.message);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [API_URL, orderId]);

  useEffect(() => {
    console.log('Updated orderDetails:', orderDetails);
  }, [orderDetails]);

  if (!orderDetails) {
    return (
      <p className='p-4 text-center text-gray-600'>Loading order details...</p>
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
            <strong>Name:</strong> {orderDetails.customerName || 'N/A'}
          </p>
          <p className='mb-2'>
            <strong>Email:</strong> {orderDetails.customerEmail || 'N/A'}
          </p>
          <p className='mb-2'>
            <strong>Mobile Number:</strong>{' '}
            {orderDetails.customerMobile || 'N/A'}
          </p>
          <p className='mb-2'>
            <strong>Address:</strong>{' '}
            {orderDetails.address ? (
              <span>
                {orderDetails.address.streetAddress},{' '}
                {orderDetails.address.city}, {orderDetails.address.state} -{' '}
                {orderDetails.address.zip}, {orderDetails.address.country}
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
                  item.productDetails?.image
                    ? `${IMAGE_BASE_URL}/${item.productDetails.image.replace(
                        /\\/g,
                        '/'
                      )}`
                    : 'https://via.placeholder.com/100'
                }
                alt={item.productDetails?.productName || 'Product Image'}
                className='w-20 h-20 object-cover rounded mr-4'
              />
              <div>
                <p className='text-lg font-semibold text-gray-800'>
                  {item.productDetails?.productName || 'Unknown Product'}
                </p>
                <p className='text-sm text-gray-600'>
                  Quantity: {item.quantity || 0}
                </p>
                <p className='text-sm text-gray-600'>
                  Price: ₹{item.productDetails?.price || 0}
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
