import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  // const [currentState, setCurrentState] = useState('Sign Up');
  const { token, setToken, navigate, backendUrl, getUserCart } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state

  const togglePasswordVisibility = () => setShowPassword(!showPassword); // Toggle function

  const [resetEmail, setResetEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        
        const response = await axios.post(backendUrl + '/api/user/register', {name, email, password})
        // console.log(response.data);
        if (response.data.success) {
          toast.success("Sign Up Successful!")
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          // Fetch cart data immediately after successful Sign Up
          await getUserCart(response.data.token)
        } else {
          toast.error(response.data.message)
        }
        
      } else {

        const response = await axios.post(backendUrl + '/api/user/login', {email, password})
        // console.log(response.data);
        if (response.data.success) {
          toast.success("Login Successful!")
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          // Fetch cart data immediately after successful login
          await getUserCart(response.data.token)
        } else {
          toast.error(response.data.message)
        }
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const onForgotPasswordHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password`, {
        email: resetEmail,
      });
      if (response.data.success) {
        toast.success('Password reset link sent to your email!');
        setCurrentState('Login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/')
      // window.location.reload(); // Force page refresh
    }
  }, [token])

  return (
    <form onSubmit={currentState === 'Forgot Password' ? onForgotPasswordHandler : onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 '>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      {currentState === 'Sign Up' && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}
      {(currentState === 'Login' || currentState === 'Sign Up') && (
        <>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Email"
            required
          />
           <div className="w-full relative">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? 'text' : 'password'}
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="Password"
              required
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </>
      )}

      {currentState === 'Forgot Password' && (
        <input
          onChange={(e) => setResetEmail(e.target.value)}
          value={resetEmail}
          type="email"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Enter your email"
          required
        />
      )}
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
      {currentState === 'Login' && (
          <p onClick={() => setCurrentState('Forgot Password')} className="cursor-pointer">Forgot your password?</p>
        )}
        {
          currentState === 'Login'
          ? ( <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create Account</p> )
          : currentState === 'Sign Up' 
          ? ( <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p> )
          : ( <p onClick={() => setCurrentState('Login')} className="cursor-pointer">Back to Login</p> )
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4 active:bg-gray-700'>{currentState === 'Login' ? 'Sign In' : currentState === 'Sign Up' ? 'Sign Up' : 'Send Reset Link'}</button>
      {/* {(currentState === 'Login' || currentState === 'Sign Up') && (
        <button type="button" class="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-20 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2">
        <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
        <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
        </svg>
        <img src="https://1000logos.net/wp-content/uploads/2016/11/Google-Symbol.png" alt="" className='object-cover h-6'/>
        Continue with Google
        </button>
      )} */}

    </form>
  )
}

export default Login