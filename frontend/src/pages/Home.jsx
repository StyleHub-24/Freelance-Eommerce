import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';

const Home = () => {
  const { products } = useContext(ShopContext);
  const [loading, setLoading] = useState(true); // Set initial loading state to true

  useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
    }
  }, [products]);

  return (
    <div>
      {loading ? (
        <div className="flex flex-col gap-2 p-6">
          <div className="w-full h-64 bg-gray-200 animate-pulse mb-4"></div>
          <div className="w-full h-10 bg-gray-200 animate-pulse mb-2"></div>
          <div className="w-full h-6 bg-gray-200 animate-pulse mb-2"></div>
          <div className="w-full h-6 bg-gray-200 animate-pulse mb-2"></div>
          <div className="w-full h-6 bg-gray-200 animate-pulse mb-2"></div>
        </div>
      ) : (
        <>
          <Hero />
          <LatestCollection />
          <BestSeller />
          <OurPolicy />
          <NewsletterBox />
        </>
      )}
    </div>
  );
};

export default Home;