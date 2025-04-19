import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const OrderDetails = () => {
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [statusUpdate, setStatusUpdate] = useState("");
	const { orderId } = useParams();
	const navigate = useNavigate();

	const API_URL = import.meta.env.VITE_API_URL;

	useEffect(() => {
		const fetchOrderDetails = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem("token");
				if (!token) {
					setError("Authentication required");
					setLoading(false);
					return;
				}

				const response = await axios.get(
					`${API_URL}/orders/details/${orderId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);

				setOrder(response.data.order);
			} catch (err) {
				setError(
					err.response?.data?.message || "Failed to fetch order details",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchOrderDetails();
	}, [API_URL, orderId]);

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString() + " " + date.toLocaleTimeString();
	};

	const updateOrderStatus = async () => {
		if (!statusUpdate) return;

		try {
			const token = localStorage.getItem("token");
			await axios.put(
				`${API_URL}/orders/${orderId}/status`,
				{ status: statusUpdate },
				{ headers: { Authorization: `Bearer ${token}` } },
			);

			// Update local state
			setOrder({ ...order, status: statusUpdate });
			setStatusUpdate("");
		} catch (err) {
			setError("Failed to update order status");
		}
	};

	const getStatusClass = (status) => {
		switch (status) {
			case "delivered":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			case "shipped":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 p-4 rounded-md text-red-700">
				<p className="font-medium">Error</p>
				<p>{error}</p>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
				<p>Order not found</p>
			</div>
		);
	}

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<div className="max-w-5xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-2xl font-bold">Order Details</h1>
						<p className="text-gray-600">
							Order #{order._id.substring(order._id.length - 6)}
						</p>
					</div>
					<button
						onClick={() => navigate("/admin-panel/orders")}
						className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
					>
						Back to Orders
					</button>
				</div>

				{/* Order Summary Card */}
				<div className="bg-white rounded-lg shadow mb-6">
					<div className="p-6 border-b">
						<div className="flex justify-between items-center">
							<div>
								<h2 className="text-xl font-semibold">Order Summary</h2>
								<p className="text-gray-600">
									Placed on {formatDate(order.createdAt)}
								</p>
							</div>
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
									order.status || "pending",
								)}`}
							>
								{order.status || "pending"}
							</span>
						</div>
					</div>

					<div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Order ID and Date */}
						<div>
							<h3 className="text-sm font-medium text-gray-500">ORDER ID</h3>
							<p className="mt-2 text-gray-900">{order._id}</p>
							<h3 className="mt-4 text-sm font-medium text-gray-500">
								PAYMENT
							</h3>
							<p className="mt-2 text-gray-900">
								₹{order.totalAmount.toFixed(2)}
							</p>
						</div>

						{/* Customer Info */}
						<div>
							<h3 className="text-sm font-medium text-gray-500">CUSTOMER</h3>
							<p className="mt-2 text-gray-900">{order.user?.email || "N/A"}</p>
							<p className="text-gray-900">{order.address?.deliveryName}</p>
							<p className="text-gray-900">{order.address?.deliveryNumber}</p>
						</div>

						{/* shipped Address */}
						<div>
							<h3 className="text-sm font-medium text-gray-500">
								shipped ADDRESS
							</h3>
							<p className="mt-2 text-gray-900">
								{order.address?.streetAddress}
							</p>
							<p className="text-gray-900">
								{order.address?.city}, {order.address?.state}{" "}
								{order.address?.zip}
							</p>
						</div>
					</div>

					{/* Status Update Section */}
					<div className="p-6 bg-gray-50 border-t">
						<h3 className="text-sm font-medium text-gray-500 mb-2">
							UPDATE STATUS
						</h3>
						<div className="flex items-center gap-3">
							<select
								value={statusUpdate}
								onChange={(e) => setStatusUpdate(e.target.value)}
								className="border rounded-md p-2 flex-grow"
							>
								<option value="">Select status</option>
								<option value="pending">Pending</option>
								<option value="shipped">Shipped</option>
								<option value="delivered">Delivered</option>
								<option value="cancelled">Cancelled</option>
							</select>
							<button
								onClick={updateOrderStatus}
								disabled={!statusUpdate}
								className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed"
							>
								Update
							</button>
						</div>
					</div>
				</div>

				{/* Order Items */}
				<div className="bg-white rounded-lg shadow mb-6">
					<div className="p-6 border-b">
						<h2 className="text-xl font-semibold">
							Order Items ({order.items.length})
						</h2>
					</div>

					<div className="divide-y">
						{order.items.map((item, index) => (
							<div key={index} className="p-6 flex items-center">
								<div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
									{item.productId?.image ? (
										<img
											src={item.productId.image}
											alt={item.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											No image
										</div>
									)}
								</div>

								<div className="ml-4 flex-grow">
									<h3 className="font-medium">{item.name}</h3>
									<p className="text-gray-500 text-sm">
										Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
									</p>
								</div>

								<div className="text-right">
									<p className="font-medium">
										₹{(item.price * item.quantity).toFixed(2)}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* Order Totals */}
					<div className="p-6 bg-gray-50 border-t">
						<div className="flex justify-between mb-2">
							<span className="text-gray-600">Subtotal</span>
							<span>₹{order.totalAmount.toFixed(2)}</span>
						</div>
						<div className="flex justify-between mb-2">
							<span className="text-gray-600">shipped</span>
							<span>₹0.00</span>
						</div>
						<div className="flex justify-between font-medium text-lg pt-2 border-t">
							<span>Total</span>
							<span>₹{order.totalAmount.toFixed(2)}</span>
						</div>
					</div>
				</div>

				{/* Timeline/History could be added here */}
				{/* <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Order Timeline</h2>
          </div>
          <div className="p-6">
            Timeline content
          </div>
        </div> */}
			</div>
		</div>
	);
};

export default OrderDetails;
