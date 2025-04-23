import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import RelatedProducts from './RelatedProducts';
import { toast } from 'react-toastify';
import { useCart } from './providers/CartContext';
import { useAuth } from './providers/AuthContext';
import ProductDetailSkeleton from './skeletons/ProductDetailSkeleton';

const ProductDetail = () => {
  const { addToCart, updateCartCount } = useCart();
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();
  const { productId } = useParams();
  const [product, setProduct] = useState(location.state?.product);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        if (location.state?.product) {
          const product = location.state.product;
          setProduct(product);

          // Direct use of Cloudinary URL
          if (product.image) {
            setMainImage(product.image);
            setImages([product.image]);
          }
        } else {
          const baseUrl = import.meta.env.VITE_API_URL;
          const response = await fetch(`${baseUrl}/products/${productId}`);

          if (!response.ok) {
            throw new Error('Failed to fetch product data');
          }

          const productData = await response.json();
          setProduct(productData);

          // Direct use of Cloudinary URL
          if (productData.image) {
            setMainImage(productData.image);
            setImages([productData.image]);
          }
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        toast.error('Error loading product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, location.state?.product]);

  const handleAddToCart = async () => {
    if (isAddingToCart) return; // Prevent multiple clicks

    try {
      setIsAddingToCart(true);

      // Immediately show loading toast for better UX
      const toastId = toast.loading('Adding to cart...');

      // For logged in users, make direct API call to avoid double fetching
      if (isLoggedIn && user?._id) {
        const token = localStorage.getItem('token');
        const userId = user._id;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/cart/${userId}/add`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: product._id,
              quantity: 1,
            }),
          }
        );

        if (response.ok) {
          // Update cart count without refetching all user data
          updateCartCount(userId);
          toast.update(toastId, {
            render: 'Product added to cart successfully!',
            type: 'success',
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          throw new Error('Failed to add product to cart');
        }
      } else {
        // Use addToCart for guest users
        const success = await addToCart(product, 1);

        if (success) {
          toast.update(toastId, {
            render: 'Product added to cart successfully!',
            type: 'success',
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          throw new Error('Failed to add product to cart');
        }
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('An error occurred while adding the product to the cart.');
    } finally {
      setIsAddingToCart(false);
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

          {/* Product details section */}
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
              disabled={isAddingToCart}
              className={`mt-6 brown-deep-button ${
                isAddingToCart ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
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
