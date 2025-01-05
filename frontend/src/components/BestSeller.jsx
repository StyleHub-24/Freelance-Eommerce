import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const Loader = () => {
  return (
    <div className="animate-pulse flex flex-col items-center space-y-4">
      <div className="w-full h-40 bg-gray-300 rounded-md"></div>
      <div className="w-3/4 h-4 bg-gray-300 rounded-md"></div>
      <div className="w-1/2 h-4 bg-gray-300 rounded-md"></div>
    </div>
  );
};

const BestSeller = () => {

    const {products} = useContext(ShopContext);

    const [bestSeller,setBestSeller] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (products.length > 0) {
        const bestProduct = products.filter((item) => (item.bestseller));
        setBestSeller(bestProduct.slice(0,5))
        setLoading(false);
      }
    }, [products])
    
  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'BEST'} text2={'SELLERS'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Lorem ispum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.
            </p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => <Loader key={index} />)
          ) : (
            bestSeller.map((item,index) => (
              <ProductItem key={index} id={item._id} name={item.name} price={item.price} colorVariants={item.colorVariants} bestseller={item.bestseller}/>
            ))
          )}
        </div>

    </div>
  )
}

export default BestSeller