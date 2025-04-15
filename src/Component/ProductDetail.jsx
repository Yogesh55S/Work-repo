import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import RelatedProducts from './RelatedProducts';
import { toast } from 'react-toastify';
import { useCart } from './providers/CartContext';
import ProductDetailSkeleton from './skeletons/ProductDetailSkeleton';

const ProductDetail = () => {
  const { updateCartCount } = useCart();
  const location = useLocation();
  const { productId } = useParams();
  const [product, setProduct] = useState(location.state?.product);
  const [loading, setLoading] = useState(true); // Always start with loading
  const [mainImage, setMainImage] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        // If we have product from location state, we still simulate loading
        if (location.state?.product) {
          const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
          const mainImg = `${baseUrl}/${location.state.product.image.replace(
            /\\/g,
            '/'
          )}`;
          setMainImage(mainImg);
          setImages(location.state.product.images || [mainImg]);
        }
        // Otherwise fetch from API
        else if (productId) {
          // API call
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/products/${productId}`
          );

          if (response.ok) {
            const productData = await response.json();
            setProduct(productData);

            const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
            const mainImg = `${baseUrl}/${productData.image.replace(
              /\\/g,
              '/'
            )}`;
            setMainImage(mainImg);
            setImages(productData.images || [mainImg]);
          } else {
            toast.error('Error fetching product details');
          }
        } else {
          toast.error('No product information available');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, location.state?.product]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?._id;

    if (!token || !userId) {
      toast.info('You need to log in to add items to the cart.');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cart/${userId}/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id, quantity: 1 }),
        }
      );

      if (response.ok) {
        await response.json();
        toast.success('Product added to cart successfully!');
        updateCartCount(userId);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('An error occurred while adding the product to the cart.');
    }
  };

  // Show skeleton while loading
  if (loading) {
    return <ProductDetailSkeleton />;
  }

  // Show error message if product not found
  if (!product) {
    return (
      <div className='text-center text-gray-600 pt-28'>Product not found.</div>
    );
  }

  return (
    <div className='max-w-full mx-auto p-4 pt-28'>
      <div className='container mx-auto lg:w-[1240px]'>
        <div className='flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-12'>
          {/* Product Image */}
          <div className='w-full md:w-[40%]'>
            <img
              src={mainImage}
              alt={product.productName}
              className='w-full h-auto object-cover shadow'
            />
            <div className='flex mt-4 space-x-4'>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.productName} thumbnail ${index + 1}`}
                  className={`w-16 h-16 object-cover shadow cursor-pointer ${
                    mainImage === img ? 'ring-2 ring-button-primary' : ''
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Rest of your component remains the same */}
          <div className='w-full md:w-[60%]'>
            <h1 className='text-2xl mb-4 font-bold'>{product.productName}</h1>
            <p className='text-gray-700 mb-6'>{product.description}</p>
            <p className='text-green-600 mb-4 text-lg font-semibold'>
              ₹{product.price}
            </p>

            {/* Product Attributes */}
            <div className='mt-4'>
              <h3 className='text-xl font-semibold mb-2'>Product Details</h3>
              <ul className='text-gray-600 text-base list-disc ml-5'>
                {product.netQuantity && (
                  <li>
                    <strong>Net Quantity:</strong> {product.netQuantity}
                  </li>
                )}
                {product.allergenInformation && (
                  <li>
                    <strong>Allergen Information:</strong>{' '}
                    {product.allergenInformation}
                  </li>
                )}
                {product.directionsToUse && (
                  <li>
                    <strong>Directions to Use:</strong>{' '}
                    {product.directionsToUse}
                  </li>
                )}
                {product.useBefore && (
                  <li>
                    <strong>Use Before:</strong> {product.useBefore}
                  </li>
                )}
                {product.type && (
                  <li>
                    <strong>Type:</strong> {product.type}
                  </li>
                )}
                {product.subType && (
                  <li>
                    <strong>Sub-Type:</strong> {product.subType}
                  </li>
                )}
              </ul>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className='mt-6 brown-deep-button'
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related Products Section */}
        <div className='mt-[min(2rem, 5vh)]'>
          <RelatedProducts productType={product.type} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
