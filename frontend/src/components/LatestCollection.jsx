import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const Loader = () => {
  return (
    <div className="animate-pulse flex flex-col items-center space-y-4">
      <div className="w-full h-40 bg-gray-300 rounded-md"></div>
      <div className="w-3/4 h-4 bg-gray-300 rounded-md"></div>
      <div className="w-1/2 h-4 bg-gray-300 rounded-md"></div>
    </div>
  );
};

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      setLatestProducts(products.slice(0, 10));
      setLoading(false);
    }
  }, [products]);

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTION'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Lorem ispum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.
        </p>
      </div>

      {/* Rendering Products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => <Loader key={index} />)
        ) : (
          latestProducts.map((item, index) => (
            <ProductItem key={index} id={item._id} name={item.name} price={item.price} colorVariants={item.colorVariants} bestseller={item.bestseller} />
          ))
        )}
      </div>
    </div>
  )
}

export default LatestCollection