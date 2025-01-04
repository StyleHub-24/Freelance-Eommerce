import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>StyleHub was born out of a passion forn innovation and a desire to revolutionize the way we live. We believe that technology has the power to transform our lives and make our world a better place.</p>
          <p>Since our inception, we've worked tirelessly to curate a diverse selection of products that reflect our commitment to excellence. From smart home solutions to cutting-edge gadgets, we've got you covered.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission at Stylehub is to empower customers with choice, convenience, and style. We're committed to providing a seamless and enjoyable shopping experience for all our customers.</p>
        </div>
      </div>
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We meticulously select and verify our products to ensure they meet our high standards of quality.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>With our user-friendly interface, you can shop from anywhere, at any time.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our team of dedicated professionals is here to assist you every step of the way.</p>
        </div>
      </div>
      <NewsletterBox/>
    </div>
  )
}

export default About