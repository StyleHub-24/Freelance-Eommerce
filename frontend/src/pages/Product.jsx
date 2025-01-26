import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import ProductReviews from '../components/ProductReview';
import ProductDescription from '../components/ProductDescription';
import { XCircle } from 'lucide-react';

const Product = () => {

  const {productId} = useParams();
  // console.log(productId);
  const {products, currency, addToCart} = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColorVariant, setSelectedColorVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to determine if a color is light or dark
  const isLightColor = (color) => {
    const c = color.toLowerCase();
    const lightColors = ['white', 'yellow', 'light', 'beige', 'ivory', 'cream'];
    return lightColors.some(light => c.includes(light));
  }

  const fetchProductData = () => {
    setLoading(true);
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setSelectedColorVariant(product.colorVariants[0]);
      setImage(product.colorVariants[0].images[0]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [productId, products])
  
  const handleColorChange = (colorVariant) => {
    setSelectedColorVariant(colorVariant);
    setImage(colorVariant.images[0]);
    setSelectedSize('');
  }

  // Calculate if the current selection is out of stock
  const getCurrentSizeStock = () => {
    if (!selectedColorVariant || !selectedSize) return 0;
    const sizeData = selectedColorVariant.sizes.find(s => s.size === selectedSize);
    return sizeData ? sizeData.stock : 0;
  }

  const isOutOfStock = !selectedColorVariant || selectedColorVariant.sizes.every(size => size.stock === 0);

  return loading ? (
    <div className="flex flex-col gap-2">
      <div className="w-full h-64 bg-gray-200 animate-pulse mb-4"></div>
      <div className="w-full h-10 bg-gray-200 animate-pulse mb-2"></div>
      <div className="w-full h-6 bg-gray-200 animate-pulse mb-2"></div>
      <div className="w-full h-6 bg-gray-200 animate-pulse mb-2"></div>
      <div className="w-full h-6 bg-gray-200 animate-pulse mb-2"></div>
    </div>
  ) : productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* product images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
          {selectedColorVariant?.images.map((item, index) => (
              <img 
                onClick={() => setImage(item)} 
                src={item} 
                key={index} 
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer ${isOutOfStock ? 'opacity-50' : ''}`} 
                alt="" 
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%] relative'>
          <img className={`w-full h-auto ${isOutOfStock ? 'opacity-50' : ''}`} src={image} alt="" />
            {isOutOfStock && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-black bg-opacity-75 text-white px-6 py-3 rounded-lg text-xl font-medium">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>
        {/* product details */}
        <div className='flex-1'>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            <div className='flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>(122)</p>
            </div>
            <p className='mt-5 text-3xl font-medium'>{currency} {selectedColorVariant?.price}</p>
            {isOutOfStock && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700 font-medium">Currently Out of Stock</p>
              <p className="text-red-600 text-sm mt-1">This item in {selectedColorVariant?.color} is temporarily unavailable</p>
            </div>
          )}
            <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

            {/* Color Selection */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Color: {selectedColorVariant?.color}</p>
              <div className="flex flex-wrap gap-2">
                {productData.colorVariants.map((variant, index) => {
                  const totalStock = variant.sizes.reduce((total, size) => total + size.stock, 0);
                  return (
                    <button
                      key={variant.color}
                      onClick={() => handleColorChange(variant)}
                      className={`w-8 h-8 rounded-full transition-all relative ${
                        variant === selectedColorVariant 
                          ? 'ring-2 ring-black scale-110' 
                          : 'ring-1 ring-gray-300'
                      } ${totalStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ 
                        backgroundColor: variant.color,
                        outline: isLightColor(variant.color) ? '1px solid #ddd' : 'none'
                      }}
                      disabled={totalStock === 0}
                      aria-label={`${variant.color}${totalStock === 0 ? ' (Out of Stock)' : ''}`}
                    >
                      {totalStock === 0 && (
                        <XCircle className="absolute -top-2 -right-2 w-4 h-4 text-red-500 bg-white rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {selectedColorVariant?.sizes.map((sizeData) => (
                  <button
                    key={sizeData.size}
                    onClick={() => setSelectedSize(sizeData.size)}
                    className={`h-10 w-14 flex items-center justify-center border rounded-md text-sm relative ${
                      selectedSize === sizeData.size
                        ? 'border-orange-500 bg-gray-100'
                        : sizeData.stock === 0 
                        ? 'opacity-40 border-gray-200 bg-white cursor-not-allowed' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    disabled={sizeData.stock === 0}
                  >
                    {sizeData.size}
                    {sizeData.stock === 0 && (
                      <XCircle className="absolute -top-2 -right-2 w-4 h-4 text-red-500" />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Size Guide */}
              {selectedSize && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium mb-2">Measurements for size {selectedSize}:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Chest (inches)</p>
                      <p className="text-sm">{selectedColorVariant?.sizes.find(s => s.size === selectedSize)?.chestMeasurements.inches}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Chest (cm)</p>
                      <p className="text-sm">{selectedColorVariant?.sizes.find(s => s.size === selectedSize)?.chestMeasurements.cm}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                if (selectedSize && selectedColorVariant) {
                  addToCart(productId, selectedSize, selectedColorVariant.color);
                }
              }}
              className={`mt-6 py-3 px-6 rounded-md text-white font-medium ${
                !selectedSize || getCurrentSizeStock() === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              }`}
              disabled={!selectedSize || getCurrentSizeStock() === 0}
            >
              {!selectedSize 
                ? 'Select a Size'
                : getCurrentSizeStock() === 0
                ? 'OUT OF STOCK'
                : 'ADD TO CART'}
            </button>
            <hr className='mt-8 sm:w-4/5'/>
            <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                <p>100% Original Product.</p>
                <p>Cash on delivery is available on this product.</p>
                <p>Easy return and exchange policy within 7 days.</p>
            </div>
        </div>
      </div>
     {/* Description & Reviews Section */}
     <div className="mt-20">
        <div className="flex">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-5 py-3 text-sm ${
              activeTab === 'description' ? 'border-b-2 border-orange-500 font-bold' : 'border'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-5 py-3 text-sm ${
              activeTab === 'review' ? 'border-b-2 border-orange-500 font-bold' : 'border'
            }`}
          >
            Reviews
          </button>
        </div>
        {activeTab === 'description' && <ProductDescription productId={productId} productDescription={productData.description} />}
        {activeTab === 'review' && <ProductReviews productId={productId} subCategory={productData.subCategory}/>}
      </div>
      {/* display related products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : null;
}

export default Product