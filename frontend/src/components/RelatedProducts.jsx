import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading state to true

  useEffect(() => {
    setLoading(true);
    if (products.length > 0) {
      let productsCopy = products.slice();

      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);

      // console.log(productsCopy.slice(0,5));
      setRelated(productsCopy.slice(0, 5));
    }
    setLoading(false);
  }, [products]);

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      {loading ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-full p-2">
              <div className="w-full h-64 bg-gray-200 animate-pulse mb-4"></div>
              <div className="w-full h-6 bg-gray-200 animate-pulse mb-2"></div>
              <div className="w-3/4 h-6 bg-gray-200 animate-pulse mb-2"></div>
              <div className="w-1/2 h-6 bg-gray-200 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {related.map((item, index) => (
            <ProductItem key={index} id={item._id} name={item.name} price={item.price} colorVariants={item.colorVariants} bestseller={item.bestseller} />
          ))}
        </div>
      )}
    </div>
  )
}

export default RelatedProducts