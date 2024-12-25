import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify';
import { assets } from '../assets/assets'

const Orders = ({token}) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {
      
      const response = await axios.post(backendUrl + '/api/order/list', {}, {headers: {token}});
      // console.log(response.data);
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      // console.log(error);
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status: event.target.value}, {headers: {token}});
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.message)
    }
  }

  const handleRefundChange = async (orderId, refunded) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/updateRefund', { orderId, refunded }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrders();
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.message);
    }
  };
  const handleEstimatedDeliveryChange = async ( orderId,event) => {
    const newDate = new Date(event.target.value).getTime();
    try {
      // Send the updated estimated delivery date to the backend
      const response = await axios.post(
        backendUrl + '/api/order/updateEstimatedDelivery',
        { orderId, estimatedDelivery: newDate },
        { headers: { token } }
      );
  
      // Check if the update was successful
      if (response.data.success) {
        toast.success(response.data.message); // Show success message
        await fetchAllOrders(); // Optionally refresh orders if needed
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.message); // Show error message if the request fails
    }
  };
  
  
  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
              <div>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> </p>
                  } else {
                    return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> ,</p>

                  }
                })}
              </div>
              <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p>{order.address.phone}</p>
              <p>{order.address.alternativephone?order.address.alternativephone:''}</p>
            </div>
            <div>
                <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                <p className='mt-3'>Methd: {order.paymentMethod}</p>
                <p>Payment: { order.payment ? 'Done' : 'Pending' }</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                <span>
                <p>Delivery Within:</p>
                <input type="date" value={order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : ''}onChange={(e) => handleEstimatedDeliveryChange(order._id, e)} className="text-sm p-0 ps-1 border border-gray-300 rounded-md  sm:text-xs  md:text-sm"/>
                </span>
            </div>
            <p className='text-sm sm:text-[15px]'>Total: {currency}{order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-1 font-semibold' disabled={order.status === 'Canceled'}>
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>

            {order.status === 'Canceled' && order.paymentMethod !== 'COD' && (
              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  checked={order.refunded}
                  onChange={() => handleRefundChange(order._id, !order.refunded)}
                  id={`refund-${order._id}`}
                  className="mr-2"
                />
                <label htmlFor={`refund-${order._id}`} className="text-sm">Refunded</label>
              </div>
            )}

          </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders