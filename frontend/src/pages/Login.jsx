import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  // const [currentState, setCurrentState] = useState('Sign Up');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [resetEmail, setResetEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        
        const response = await axios.post(backendUrl + '/api/user/register', {name, email, password})
        // console.log(response.data);
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
        
      } else {

        const response = await axios.post(backendUrl + '/api/user/login', {email, password})
        // console.log(response.data);
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
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
      window.location.reload(); // Force page refresh
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
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Password"
            required
          />
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
    </form>
  )
}

export default Login