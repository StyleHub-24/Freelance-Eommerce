import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products} = useContext(ShopContext)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
    alternativephone:''
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData(data => ({...data, [name]: value}))

  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + '/api/order/verifyRazorpay', 
            response, 
            {headers: {token}}
          );
          if (data.success) {
            toast.success(data.message)
            navigate('/orders')
            setCartItems({})
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message)
        }
      },
      modal: {
        ondismiss: async () => {
          // Handle payment modal dismissal
          try {
            const { data } = await axios.post(
              backendUrl + '/api/order/cancelRazorpay',
              { orderId: order.receipt },
              { headers: { token } }
            );
            if (data.success) {
              toast.info('Payment cancelled');
            }
          } catch (error) {
            console.log(error);
            toast.error('Error handling payment cancellation');
          }
        }
      }
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      
      let orderItems = []

      for(const productId in cartItems) {
        for(const color in cartItems[productId]) {
          for(const size in cartItems[productId][color]) {
            if (cartItems[productId][color][size] > 0) {
              const product = products.find(p => p._id === productId);
              const colorVariant = product?.colorVariants.find(v => v.color === color);
              
              if (product && colorVariant) {
                orderItems.push({
                  _id: product._id,
                  name: product.name,
                  description: product.description,
                  price: colorVariant.price,
                  image: colorVariant.images,
                  category: product.category,
                  subCategory: product.subCategory,
                  bestseller: product.bestseller,
                  date: product.date,
                  color: color,
                  size: size,
                  quantity: cartItems[productId][color][size],
                });
              }
            }
          }
        }
      }

      // console.log(orderItems);
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      }
      
      switch (method) {

        // API Calls for COD 
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers: {token}});
          if (response.data.success) {
            toast.success(response.data.message)
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;

        // API Calls for Stripe Payment
        case 'stripe': 
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers: {token}});

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data
            window.location.replace(session_url)
          } else {
            toast.error(responseStripe.data.message)
          }
          break;

        // API Calls for Stripe Payment
        case 'razorpay': 
          // before calling the razorpay api go to index.html and add the razorpay script <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
          const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers: {token}});

          if (responseRazorpay.data.success) {
            // console.log(responseRazorpay.data.order);
            initPay(responseRazorpay.data.order)
            
          } else {
            toast.error(responseStripe.data.message)
          }
          break;

        default:
          break;
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-sxl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First Name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last Name' />
        </div>
          <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email Address' />
          <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
          <div className='flex gap-3'>
            <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
            <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
          </div>
          <div className='flex gap-3'>
            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
            <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
          </div>
          <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
          <input onChange={onChangeHandler} name='alternativephone' value={formData.alternativephone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Alternative Number (Optional)' />
      </div>
      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal/>
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'}/>
          {/* Payment method selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4 '>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white py-3 px-16 text-sm active:bg-gray-700'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder