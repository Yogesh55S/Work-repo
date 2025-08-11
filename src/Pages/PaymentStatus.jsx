import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

const PaymentStatus = () => {
	const [searchParams] = useSearchParams();
	const [paymentStatus, setPaymentStatus] = useState("loading");
	const [orderDetails, setOrderDetails] = useState(null);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const orderId = searchParams.get("order_id");
	const API_URL = import.meta.env.VITE_API_URL;

	useEffect(() => {
		const verifyPayment = async () => {
			if (!orderId) {
				setPaymentStatus("error");
				setError("Order ID not found in the URL");
				return;
			}

			try {
				// ✅ Fixed: Use 'token' instead of 'authToken' to match your Cart component
				const token = localStorage.getItem("token");
				
				const response = await fetch(`${API_URL}/orders/status/${orderId}`, {
					headers: {
						...(token && { Authorization: `Bearer ${token}` }), // Only add auth header if token exists
					},
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || "Payment verification failed");
				}

				const data = await response.json();
				setOrderDetails(data);

				// ✅ Map Cashfree status to our display status
				if (data.status === "PAID" || data.paymentStatus === "paid") {
					setPaymentStatus("success");
				} else if (["FAILED", "EXPIRED", "CANCELLED"].includes(data.status) || data.paymentStatus === "failed") {
					setPaymentStatus("failed");
				} else {
					setPaymentStatus("pending");
					// ✅ If still pending, check again in 3 seconds
					setTimeout(() => {
						if (paymentStatus === "pending") {
							verifyPayment();
						}
					}, 3000);
				}
			} catch (error) {
				console.error("Error verifying payment:", error);
				setPaymentStatus("error");
				setError(error.message || "Failed to verify payment status");
			}
		};

		// Give the backend a moment to process
		const timer = setTimeout(() => {
			verifyPayment();
		}, 1500);

		return () => clearTimeout(timer);
	}, [orderId, API_URL]);

	// Retry payment verification
	const handleRetryVerification = () => {
		setPaymentStatus("loading");
		setError(null);
		
		// Trigger verification again
		const timer = setTimeout(() => {
			const verifyPayment = async () => {
				if (!orderId) return;

				try {
					const token = localStorage.getItem("token");
					const response = await fetch(`${API_URL}/orders/status/${orderId}`, {
						headers: {
							...(token && { Authorization: `Bearer ${token}` }),
						},
					});

					if (!response.ok) {
						throw new Error("Payment verification failed");
					}

					const data = await response.json();
					setOrderDetails(data);

					if (data.status === "PAID" || data.paymentStatus === "paid") {
						setPaymentStatus("success");
					} else if (["FAILED", "EXPIRED", "CANCELLED"].includes(data.status) || data.paymentStatus === "failed") {
						setPaymentStatus("failed");
					} else {
						setPaymentStatus("pending");
					}
				} catch (error) {
					setPaymentStatus("error");
					setError(error.message);
				}
			};
			
			verifyPayment();
		}, 1000);

		return () => clearTimeout(timer);
	};

	return (
		<div className="container mx-auto p-4 pt-28 max-w-lg">
			<div className="bg-white rounded-lg shadow-md p-6">
				<h1 className="text-2xl font-bold mb-6 text-center">Payment Status</h1>

				{paymentStatus === "loading" && (
					<div className="text-center py-10">
						<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
						<p className="mt-4">Verifying payment status...</p>
					</div>
				)}

				{paymentStatus === "success" && (
					<div className="text-center py-6 space-y-4">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
							<svg
								className="w-8 h-8 text-green-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								></path>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-green-600">
							Payment Successful!
						</h2>
						<p className="text-gray-600">Thank you for your purchase.</p>
						
						{/* ✅ Show the actual database order ID if available */}
						<p className="text-sm text-gray-500">
							Order ID: {orderDetails?.order?.dbOrderId || orderDetails?.order?.id || orderId}
						</p>
						
						{orderDetails?.order?.amount && (
							<p className="text-md font-semibold">
								Amount Paid: ₹{orderDetails.order.amount}
							</p>
						)}

						<div className="mt-8 space-y-3">
							<Link
								to="/user-panel/orders"
								className="block w-full bg-blue-500 text-white py-2 rounded-md font-bold hover:bg-blue-600 text-center"
							>
								View Your Orders
							</Link>
							<Link
								to="/shop"
								className="block w-full bg-gray-200 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-300 text-center"
							>
								Continue Shopping
							</Link>
						</div>
					</div>
				)}

				{paymentStatus === "failed" && (
					<div className="text-center py-6 space-y-4">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
							<svg
								className="w-8 h-8 text-red-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-red-600">
							Payment Failed
						</h2>
						<p className="text-gray-600">
							We couldn't process your payment. Please try again.
						</p>
						<p className="text-sm text-gray-500">Order ID: {orderId}</p>
						<p className="text-sm text-gray-500">
							Status: {orderDetails?.status || "Unknown"}
						</p>

						<div className="mt-8 flex flex-col space-y-3">
							<Link
								to="/cart"
								className="block w-full bg-blue-500 text-white py-2 rounded-md font-bold hover:bg-blue-600 text-center"
							>
								Try Again
							</Link>
							<Link
								to="/shop"
								className="block w-full bg-gray-200 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-300 text-center"
							>
								Continue Shopping
							</Link>
						</div>
					</div>
				)}

				{paymentStatus === "pending" && (
					<div className="text-center py-6 space-y-4">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100">
							<svg
								className="w-8 h-8 text-yellow-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-yellow-600">
							Payment Pending
						</h2>
						<p className="text-gray-600">
							Your payment is being processed. This may take a few moments.
						</p>
						<p className="text-sm text-gray-500">Order ID: {orderId}</p>
						<p className="text-sm text-gray-500">
							Status: {orderDetails?.status || "Processing"}
						</p>

						<div className="mt-8 flex flex-col space-y-3">
							<button
								onClick={handleRetryVerification}
								className="block w-full bg-blue-500 text-white py-2 rounded-md font-bold hover:bg-blue-600"
							>
								Check Status Again
							</button>
							<Link
								to="/user-panel/orders"
								className="block w-full bg-gray-200 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-300 text-center"
							>
								View Orders
							</Link>
						</div>
					</div>
				)}

				{paymentStatus === "error" && (
					<div className="text-center py-6 space-y-4">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
							<svg
								className="w-8 h-8 text-red-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								></path>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-red-600">
							Verification Error
						</h2>
						<p className="text-gray-600">
							{error || "We couldn't verify your payment status."}
						</p>
						<p className="text-sm text-gray-500">
							Order ID: {orderId || "N/A"}
						</p>

						<div className="mt-8 flex flex-col space-y-3">
							<button
								onClick={handleRetryVerification}
								className="block w-full bg-blue-500 text-white py-2 rounded-md font-bold hover:bg-blue-600"
							>
								Try Again
							</button>
							<Link
								to="/cart"
								className="block w-full bg-gray-200 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-300 text-center"
							>
								Return to Cart
							</Link>
							<Link
								to="/"
								className="text-blue-500 hover:text-blue-700 text-sm"
							>
								Return to Home
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PaymentStatus;