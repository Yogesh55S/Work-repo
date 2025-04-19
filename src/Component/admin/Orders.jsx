import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Orders = () => {
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [page, setPage] = useState(1);
	const [pagination, setPagination] = useState({
		total: 0,
		pages: 1,
		limit: 10,
	});

	const API_URL = import.meta.env.VITE_API_URL;

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem("token");
				if (!token) {
					setError("Authentication required");
					setLoading(false);
					return;
				}

				const response = await axios.get(`${API_URL}/orders/all`, {
					headers: { Authorization: `Bearer ${token}` },
					params: { page, limit: 10 },
				});

				setOrders(response.data.orders);
				setPagination(response.data.pagination);
			} catch (err) {
				setError(err.response?.data?.message || "Failed to fetch orders");
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [API_URL, page]);

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString() + " " + date.toLocaleTimeString();
	};

	const handlePageChange = (newPage) => {
		if (newPage > 0 && newPage <= pagination.pages) {
			setPage(newPage);
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

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-2xl font-bold mb-6">All Orders</h1>

				{orders.length === 0 ? (
					<div className="bg-white p-6 rounded-lg shadow text-center">
						<p className="text-gray-500">No orders found</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full bg-white rounded-lg shadow">
							<thead className="bg-gray-100">
								<tr>
									<th className="py-3 px-4 text-left">Order ID</th>
									<th className="py-3 px-4 text-left">Date</th>
									<th className="py-3 px-4 text-left">Customer</th>
									<th className="py-3 px-4 text-right">Total Amount</th>
									<th className="py-3 px-4 text-center">Status</th>
									<th className="py-3 px-4 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{orders.map((order) => (
									<tr key={order._id} className="hover:bg-gray-50">
										<td className="py-3 px-4 text-blue-600 font-medium">
											#{order._id.substring(order._id.length - 6)}
										</td>
										<td className="py-3 px-4 text-gray-700">
											{formatDate(order.createdAt)}
										</td>
										<td className="py-3 px-4">
											{order.user?.email || "N/A"}
											<p className="text-sm text-gray-500">
												{order.address?.deliveryName}
											</p>
										</td>
										<td className="py-3 px-4 text-right font-semibold">
											₹{order.totalAmount.toFixed(2)}
										</td>
										<td className="py-3 px-4 text-center">
											<span
												className={`inline-block px-2 py-1 text-xs rounded-full
                          ${order.status === "delivered" && "bg-green-100 text-green-800"}
                          ${order.status === "pending" && "bg-yellow-100 text-yellow-800"}
                          ${order.status === "cancelled" && "bg-red-100 text-red-800"}
						  ${order.status === "shipped" && "bg-blue-100 text-blue-800"}
                          ${!order.status && "bg-gray-100 text-gray-800"}
                        `}
											>
												{order.status || "pending"}
											</span>
										</td>
										<td className="py-3 px-4 text-right">
											<button
												className="text-blue-600 hover:text-blue-800"
												onClick={() =>
													navigate(`/admin-panel/order/${order._id}`)
												}
											>
												View Details
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{/* Pagination controls */}
						<div className="flex justify-between items-center mt-6">
							<div className="text-sm text-gray-600">
								Showing {(page - 1) * pagination.limit + 1} to{" "}
								{Math.min(page * pagination.limit, pagination.total)} of{" "}
								{pagination.total} orders
							</div>

							<div className="flex gap-2">
								<button
									onClick={() => handlePageChange(page - 1)}
									disabled={page === 1}
									className={`px-3 py-1 rounded ${
										page === 1
											? "bg-gray-100 text-gray-400 cursor-not-allowed"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}
								>
									Previous
								</button>

								{[...Array(pagination.pages).keys()].map((pageNum) => (
									<button
										key={pageNum + 1}
										onClick={() => handlePageChange(pageNum + 1)}
										className={`px-3 py-1 rounded ${
											page === pageNum + 1
												? "bg-blue-500 text-white"
												: "bg-gray-200 text-gray-700 hover:bg-gray-300"
										}`}
									>
										{pageNum + 1}
									</button>
								))}

								<button
									onClick={() => handlePageChange(page + 1)}
									disabled={page === pagination.pages}
									className={`px-3 py-1 rounded ${
										page === pagination.pages
											? "bg-gray-100 text-gray-400 cursor-not-allowed"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}
								>
									Next
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Orders;
