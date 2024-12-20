import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

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
            allOrdersItem.push(item);
          });
        });
        // console.log(allOrdersItem);
        setOrderData(allOrdersItem.reverse()); // to display the latest order first
      }
    } catch (error) {}
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

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p>
                    {currency}
                    {item.price}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="mt-1">
                  Date:{" "}
                  <span className="text-gray-400">
                    {new Date(item.date).toDateString()}
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
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                {/* <p className='min-w-2 h-2 rounded-full bg-green-500'></p> */}
                <p
                  className={`min-w-2 h-2 rounded-full ${
                    item.status === "Canceled" ? "bg-red-500" : "bg-green-500"
                  }`}
                ></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              {/* <button onClick={() => cancelOrder(item.orderId)} className='border px-4 py-2 text-sm text-red-500 font-medium rounded-sm'>Cancel</button>
                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button> */}
              {/* Conditionally render buttons */}
              {item.status !== "Canceled" && (
                // <div className="flex gap-4">
                <>
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
                </>
                // </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;