import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import ReviewForm from "../components/ReviewForm";

const Loader = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 animate-pulse'>
      <div className='w-12 h-12 bg-gray-300 rounded-full'></div>
      <div className='space-y-2'>
        <div className='w-3/4 h-4 bg-gray-300 rounded-md'></div>
        <div className='w-1/2 h-4 bg-gray-300 rounded-md'></div>
      </div>
      <div className='space-y-2'>
        <div className='w-full h-4 bg-gray-300 rounded-md'></div>
        <div className='w-3/4 h-4 bg-gray-300 rounded-md'></div>
      </div>
      <div className='space-y-2'>
        <div className='w-full h-4 bg-gray-300 rounded-md'></div>
        <div className='w-3/4 h-4 bg-gray-300 rounded-md'></div>
      </div>
      <div className='space-y-2'>
        <div className='w-full h-4 bg-gray-300 rounded-md'></div>
        <div className='w-3/4 h-4 bg-gray-300 rounded-md'></div>
      </div>
    </div>
  );
};

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      // console.log(response.data);
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            item["orderId"] = order._id;
            item["refunded"] = order.refunded;
            item["estimatedDelivery"] = order.estimatedDelivery;
            item["amount"] = order.amount;
            allOrdersItem.push(item);
          });
        });
        // console.log(allOrdersItem);
        setOrderData(allOrdersItem.reverse()); // to display the latest order first
      }
    } catch (error) { 
      toast.error("Something went wrong!"); // Error toast
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/cancel",
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order canceled successfully!"); // Success toast
        loadOrderData(); // Refresh the orders list to show the updated status
      } else {
        toast.error(response.data.message || "Order cancellation failed!"); // Error toast
      }
    } catch (error) {
      toast.error("Something went wrong!"); // Error toast
      console.error(error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const openReviewPopup = (productId) => {
    setSelectedProductId(productId);
    setIsReviewOpen(true);
  };

  const closeReviewPopup = () => {
    setSelectedProductId(null);
    setIsReviewOpen(false);
  };
  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => <Loader key={index} />)
        ) : (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-base text-gray-700">
                    <p>
                      {currency}
                      {item.amount}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p className="px-2 py-1 border bg-slate-50 text-sm">
                      Size: {item.size}
                    </p>
                    <p className="px-2 py-1 border bg-slate-50 text-sm">
                      Color: {item.color}
                    </p>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                  <p className="text-gray-600">
      OrderID #: {item.orderId.slice(-6)} {/* Show last 6 characters */}
      <button 
        onClick={() => copyToClipboard(item.orderId)}
        className="ml-2 text-blue-500 hover:text-blue-600"
      >
        Copy full ID
      </button>
    </p>
                  <p className="mt-1">
                    Ordered Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-1">
                    Estimated Delivery:{" "}
                    <span className="text-gray-400">
                      {new Date(item.estimatedDelivery).toDateString()}
                    </span>
                  </p>

                  <p className="mt-1">
                    Payment:{" "}
                    <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                  {item.refunded && item.paymentMethod !== "COD" && (
                    <p className="text-sm text-green-500 mt-2">Amount refunded</p>
                  )}
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p
                    className={`min-w-2 h-2 rounded-full ${item.status === "Canceled" ? "bg-red-500" : "bg-green-500"
                      }`}
                  ></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                {item.status === "Delivered" ? (
                  <button
                    onClick={() => openReviewPopup(item._id)}
                    className="border px-4 py-2 text-sm text-blue-500 font-medium rounded-sm"
                  >
                    Review
                  </button>
                ) : (
                  item.status !== "Canceled" && (
                    <div className="space-x-2">
                      <button
                        onClick={() => cancelOrder(item.orderId)}
                        className="border px-4 py-2 text-sm text-red-500 font-medium rounded-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={loadOrderData}
                        className="border px-4 py-2 text-sm font-medium rounded-sm"
                      >
                        Track Order
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {isReviewOpen && (
        <ReviewForm productId={selectedProductId} onClose={closeReviewPopup} />
      )}
    </div>
  );
};

export default Orders;
