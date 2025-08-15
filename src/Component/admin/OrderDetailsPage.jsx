// src/Component/admin/OrderDetailsPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/admin/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log('Order details response:', response.data);
        setOrder(response.data.order);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(
          err.response?.data?.message || 
          err.response?.data?.error ||
          "Failed to fetch order details"
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
      setIsUpdating(true);
      const token = localStorage.getItem("authToken");
      
      const response = await axios.put(
        `${API_URL}/admin/orders/${orderId}/status`,
        { status: statusUpdate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setOrder({ ...order, status: statusUpdate });
      setStatusUpdate("");
      
      // Show success message (optional)
      alert("Order status updated successfully!");
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.response?.data?.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
      case "confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading order details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <h3 className="font-medium">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => navigate("/admin-panel/orders")}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">Order not found</h3>
        <button
          onClick={() => navigate("/admin-panel/orders")}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate("/admin-panel/orders")}
            className="text-sm text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Back to Orders
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            Order #{order._id?.substring(order._id.length - 6)}
          </h2>
          <p className="text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(order.status)}`}>
            {order.status || "pending"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order ID and Date */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">ORDER ID</h3>
                <p className="mt-2 text-gray-900">{order._id}</p>
                <h3 className="mt-4 text-sm font-medium text-gray-500">
                  PAYMENT
                </h3>
                <p className="mt-2 text-gray-900">
                  ₹{order.totalAmount?.toFixed(2)}
                </p>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">CUSTOMER</h3>
                <p className="mt-2 text-gray-900">{order.user?.email || "N/A"}</p>
                <p className="text-gray-900">{order.address?.deliveryName || "N/A"}</p>
                <p className="text-gray-900">{order.address?.deliveryNumber || "N/A"}</p>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  SHIPPING ADDRESS
                </h3>
                <p className="mt-2 text-gray-900">
                  {order.address?.streetAddress || "N/A"}
                </p>
                <p className="text-gray-900">
                  {order.address?.city || "N/A"}, {order.address?.state || "N/A"}{" "}
                  {order.address?.zip || "N/A"}
                </p>
              </div>
            </div>

            {/* Status Update Section */}
            <div className="mt-6 p-6 bg-gray-50 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                UPDATE STATUS
              </h3>
              <div className="flex items-center gap-3">
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="border rounded-md p-2 flex-grow"
                  disabled={isUpdating}
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={updateOrderStatus}
                  disabled={!statusUpdate || isUpdating}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                Order Items ({order.items?.length || 0})
              </h2>
            </div>

            <div className="divide-y">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="p-6 flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      {item.productId?.image ? (
                        <img
                          src={item.productId.image}
                          alt={item.productName || item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium">{item.productName || "Unknown Product"}</h3>
                      <p className="text-gray-500 text-sm">
                        Quantity: {item.quantity || 0} × ₹{item.price?.toFixed(2) || "0.00"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No items found in this order
                </div>
              )}
            </div>

            {/* Order Totals */}
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{order.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Delivery Charges</span>
                <span>₹{order.deliveryCharges?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Empty for now since status update is moved to main section */}
        <div className="space-y-6">
          {/* Customer Information Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Customer Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Email:</span>
                <p className="font-medium">{order.user?.email || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-500">Name:</span>
                <p className="font-medium">{order.address?.deliveryName || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>
                <p className="font-medium">{order.address?.deliveryNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
            {order.address ? (
              <div className="text-sm">
                <p>{order.address.deliveryName}</p>
                <p>{order.address.deliveryNumber}</p>
                <p>{order.address.streetAddress}</p>
                <p>
                  {order.address.city}, {order.address.state}{" "}
                  {order.address.zip}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No address provided</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
