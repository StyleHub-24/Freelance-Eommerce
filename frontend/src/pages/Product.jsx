import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import ProductReviews from '../components/ProductReview';
import ProductDescription from '../components/ProductDescription';

const Product = () => {

  const {productId} = useParams();
  // console.log(productId);
  const {products, currency, addToCart} = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [activeTab, setActiveTab] = useState('description'); // Active tab state
  const [selectedColor, setSelectedColor] = useState(null);

  // Function to determine if a color is light or dark
  const isLightColor = (color) => {
    const c = color.toLowerCase();
    const lightColors = ['white', 'yellow', 'light', 'beige', 'ivory', 'cream'];
    return lightColors.some(light => c.includes(light));
  }

  const fetchProductData = () => {
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setSelectedColor(product.colorVariants[0]);
      setImage(product.colorVariants[0].images[0]);
    }
  }

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [productId, products])
  
  const handleColorChange = (colorVariant) => {
    setSelectedColor(colorVariant);
    setImage(colorVariant.images[0]);
    setSize('');
  }

  const isOutOfStock = selectedColor?.stock === 0;

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* product data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* product images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
          {selectedColor?.images.map((item, index) => (
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
            <p className='mt-5 text-3xl font-medium'>{currency} {productData.price}</p>

            {isOutOfStock && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700 font-medium">Currently Out of Stock</p>
              <p className="text-red-600 text-sm mt-1">This item in {selectedColor?.color} is temporarily unavailable</p>
            </div>
          )}

            <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
            <div className='flex flex-col gap-4 my-8'>
          <div className="flex justify-between items-center">
              <p>Select Color</p>
              <span className="text-sm text-gray-500">
                Stock: {selectedColor?.stock || 0} units
              </span>
            </div>
            <div className='flex flex-wrap gap-2'>
              {productData.colorVariants.map((variant, index) => {
                const isLight = isLightColor(variant.color);
                const variantOutOfStock = variant.stock === 0;
                return (
                  <button 
                    key={index}
                    onClick={() => handleColorChange(variant)}
                    style={{
                      backgroundColor: variant.color,
                      color: isLight ? '#000' : '#fff',
                      border: isLight ? '1px solid #e5e5e5' : 'none',
                      opacity: variantOutOfStock ? '0.5' : '1'
                    }}
                    className={`
                      w-auto min-w-[80px] h-10 px-3
                      rounded-md flex items-center justify-center
                      ${variant.color === selectedColor?.color 
                        ? 'ring-2 ring-offset-2 ring-orange-500' 
                        : 'hover:opacity-90'}
                      transition-all duration-200
                      text-sm font-medium
                      ${variantOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {variant.color}
                    {variantOutOfStock && ' (Out)'}
                  </button>
                );
              })}
            </div>
          </div>
            <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {selectedColor?.sizes.map((item, index) => (
                <button 
                  onClick={() => setSize(item)} 
                  className={`border py-2 px-4 
                    ${item === size ? 'border-orange-500' : ''}
                    ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-gray-100 hover:bg-gray-200'}`} 
                  key={index}
                  disabled={isOutOfStock}
                >
                  {item}
                </button>
              ))}
            </div>
            </div>
            <button 
            onClick={() => addToCart(productData._id, size, selectedColor?.color)} 
            className={`
              py-3 px-8 text-sm
              ${isOutOfStock 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black hover:bg-gray-800 active:bg-gray-700'}
              text-white
            `}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
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
  ) : <div className='opacity-0'></div>
}

export default Product