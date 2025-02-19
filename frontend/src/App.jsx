import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import ResetPassword from './pages/ResetPassword'
import { ShopContext } from './context/ShopContext'
import UserProfile from './components/UserProfile'
import ChatInterface from './components/ChatInterface'
const App = () => {

  const {backendUrl, token} = useContext(ShopContext)

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer/>
      <Navbar /> {/* here we include navbar to show this navbar for all pages*/}
      <SearchBar/>
      {/* Here we include routes so that app access all pages through routes */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection /> } />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/verify' element={<Verify />} />
        <Route path="/reset-password/:token" element={<ResetPassword backendUrl={backendUrl} />} />
        <Route path='/user-profile' element={<UserProfile token={token}/>} />
      </Routes>
      {token && <ChatInterface />}
      <Footer/>
    </div>
  )
}

export default App