import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const scrollToTop = () => {
    // window.scrollTo(0, 0);
    window.scrollTo({
        top: 0,
        behavior: 'smooth'  // Enables smooth scrolling
      });
}

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <img src={assets.logo} className='mb-5 w-32' alt="" />
                <p className='w-full md:w-2/3 text-gray-600'>
                    Lorem ispum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </p>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <Link to='/' onClick={scrollToTop}><li>Home</li></Link>
                    <Link to='/about' onClick={scrollToTop}><li>About us</li></Link>
                    <Link><li>Delivery</li></Link>
                    <Link><li>Privacy policy</li></Link>
                </ul>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+91 XXXXX XXXXX</li>
                    <li>contact@stylehubyou.com</li>
                </ul>
            </div>

        </div>

        <div>
            <hr/>
            <p className='py-5 text-sm text-center'>Copyright &copy; 2024 StyleHub.com - All Rights Reserved.</p>
        </div>
        <div>
            <hr/>
            <p  className='hidden py-5 text-sm text-center'>Developed By Arup Maity & Sk Mahammad Afzal</p>
        </div>
    </div>
  )
}

export default Footer