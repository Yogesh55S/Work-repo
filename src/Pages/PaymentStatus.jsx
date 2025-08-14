import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState("loading");
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Use useRef to persist across re-renders - this prevents multiple calls
  const isVerifyingRef = useRef(false);
  const hasVerifiedRef = useRef(false);
  
  // Check if we're using new flow (temp_order_id) or old flow (order_id)
  const tempOrderId = searchParams.get("temp_order_id");
  const cfOrderId = searchParams.get("cf_order_id");
  const orderId = searchParams.get("order_id");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Prevent multiple executions
    if (hasVerifiedRef.current || isVerifyingRef.current) {
      console.log('Already verified or in progress, skipping...');
      return;
    }

    // Determine which flow to use
    if (tempOrderId && cfOrderId) {
      // New flow: Verify payment first, then save order
      verifyPaymentAndSaveOrder();
    } else if (orderId) {
      // Old flow: Order already saved, just verify payment status
      verifyExistingOrder();
    } else {
      setPaymentStatus("error");
      setError("Order ID not found in the URL");
    }
  }, []); // Empty dependency array - run only once

  // NEW FLOW: Verify payment first, then save order to database
  const verifyPaymentAndSaveOrder = async () => {
    if (isVerifyingRef.current || hasVerifiedRef.current) {
      console.log('Verification already in progress or completed, skipping...');
      return;
    }

    try {
      isVerifyingRef.current = true;
      console.log('Starting new flow - verify payment first, then save order');
      
      // Get order data from localStorage
      const pendingOrderData = localStorage.getItem('pendingOrderData');
      if (!pendingOrderData) {
        setPaymentStatus("error");
        setError("Order data not found. Please try placing the order again.");
        return;
      }

      const orderData = JSON.parse(pendingOrderData);
      console.log('Retrieved order data from localStorage:', orderData);

      console.log('Verifying payment with:', { tempOrderId, cfOrderId });

      // Step 1: Verify payment and save order (NO custom headers to avoid CORS)
      const response = await fetch(`${API_URL}/orders/verify-and-save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Removed X-Request-ID to avoid CORS issues
        },
        body: JSON.stringify({
          tempOrderId,
          cashfreeOrderId: cfOrderId,
          orderData,
          requestId: `${tempOrderId}_${cfOrderId}_${Date.now()}` // Include in body instead
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment verification failed");
      }

      const data = await response.json();
      console.log('Verification and save response:', data);
      setOrderDetails(data);

      if (data.success && data.paymentStatus === "paid") {
        setPaymentStatus("success");
        hasVerifiedRef.current = true; // Mark as completed
        
        // Clear temporary data after successful order save
        localStorage.removeItem('pendingOrderData');
        localStorage.removeItem('tempOrderId');
        localStorage.removeItem('cashfreeOrderId');
        
      } else {
        setPaymentStatus("failed");
      }

    } catch (error) {
      console.error("Error in verify-and-save flow:", error);
      setPaymentStatus("error");
      setError(error.message || "Failed to verify payment and save order");
    } finally {
      isVerifyingRef.current = false;
    }
  };

  // OLD FLOW: Order already exists in database, just verify payment
  const verifyExistingOrder = async () => {
    if (isVerifyingRef.current || hasVerifiedRef.current) {
      console.log('Verification already in progress or completed, skipping...');
      return;
    }

    try {
      isVerifyingRef.current = true;
      console.log('Using existing flow - order already in database');
      
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/orders/status/${orderId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment verification failed");
      }

      const data = await response.json();
      console.log('Order status response:', data);
      setOrderDetails(data);

      // Map status to display status
      if (data.status === "PAID" || data.paymentStatus === "paid") {
        setPaymentStatus("success");
        hasVerifiedRef.current = true; // Mark as completed
      } else if (["FAILED", "EXPIRED", "CANCELLED"].includes(data.status) || data.paymentStatus === "failed") {
        setPaymentStatus("failed");
        hasVerifiedRef.current = true; // Mark as completed
      } else {
        setPaymentStatus("pending");
        // If still pending, check again in 5 seconds (only once more)
        if (!hasVerifiedRef.current) {
          setTimeout(() => {
            if (paymentStatus === "pending" && !hasVerifiedRef.current) {
              hasVerifiedRef.current = true; // Prevent further retries
              verifyExistingOrder();
            }
          }, 5000);
        }
      }
    } catch (error) {
      console.error("Error verifying existing order:", error);
      setPaymentStatus("error");
      setError(error.message || "Failed to verify payment status");
    } finally {
      isVerifyingRef.current = false;
    }
  };

  // Retry payment verification
  const handleRetryVerification = () => {
    // Reset flags for retry
    isVerifyingRef.current = false;
    hasVerifiedRef.current = false;
    
    setPaymentStatus("loading");
    setError(null);
    
    if (tempOrderId && cfOrderId) {
      verifyPaymentAndSaveOrder();
    } else if (orderId) {
      verifyExistingOrder();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        
        {/* Loading State */}
        {paymentStatus === "loading" && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              {tempOrderId ? "Verifying payment and saving order..." : "Verifying payment status..."}
            </h2>
            <p className="text-gray-600">
              {tempOrderId 
                ? "Please wait while we confirm your payment and save your order."
                : "Please wait while we confirm your payment."
              }
            </p>
          </div>
        )}

        {/* Success State */}
        {paymentStatus === "success" && (
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-800">Payment Successful!</h2>
            <p className="text-gray-600">
              {tempOrderId 
                ? "Thank you for your purchase. Your order has been saved successfully."
                : "Thank you for your purchase. Your payment has been confirmed."
              }
            </p>
            
            {/* Order Details */}
            {orderDetails?.order && (
              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Order ID:</strong> {orderDetails.order.dbOrderId || orderDetails.order.id}
                </p>
                {orderDetails.order.amount && (
                  <p className="text-sm text-gray-600">
                    <strong>Amount Paid:</strong> ₹{orderDetails.order.amount}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> <span className="text-green-600 font-medium">Confirmed & Paid</span>
                </p>
                {orderDetails.order.items && orderDetails.order.items.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <strong>Items:</strong> {orderDetails.order.items.length} item(s)
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center pt-4">
              <Link 
                to="/orders" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Orders
              </Link>
              <Link 
                to="/shop" 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Failed State */}
        {paymentStatus === "failed" && (
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-800">Payment Failed</h2>
            <p className="text-gray-600">
              We couldn't process your payment. Your order was not saved. Please try again.
            </p>
            
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Reference:</strong> {tempOrderId || orderId || "N/A"}
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <Link 
                to="/cart" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </Link>
              <Link 
                to="/shop" 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Pending State */}
        {paymentStatus === "pending" && (
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <svg className="h-6 w-6 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-yellow-800">Payment Processing</h2>
            <p className="text-gray-600">
              Your payment is being processed. This may take a few moments.
            </p>

            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={handleRetryVerification}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Check Again
              </button>
              <Link 
                to="/contact" 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}

        {/* Error State */}
        {paymentStatus === "error" && (
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
            <p className="text-gray-600">
              {error || "We couldn't verify your payment status."}
            </p>

            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={handleRetryVerification}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              <Link 
                to="/contact" 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
