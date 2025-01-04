import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({ id, name, price, colorVariants, bestseller }) => {
  const { currency } = useContext(ShopContext);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  // Get the first image of the currently selected color variant
  const currentImage = colorVariants?.[selectedColorIndex]?.images?.[0];

  const currentStock = colorVariants?.[selectedColorIndex]?.stock || 0;
  const isOutOfStock = currentStock === 0;

  return (
    <Link className='text-gray-700 cursor-pointer relative group' to={`/product/${id}`}>
      {bestseller && (
        <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded z-10">
          Bestseller
        </span>
      )}
      <div className='overflow-hidden relative'>
        <img 
          className={`hover:scale-110 transition ease-in-out w-full h-64 object-cover ${isOutOfStock ? 'opacity-40' : ''}`}
          src={currentImage} 
          alt={name}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="backdrop-blur-sm bg-black/30 w-full py-3 transform -rotate-12">
              <span className="block text-center text-white font-semibold tracking-wider text-sm uppercase">
                Out of Stock
              </span>
            </div>
          </div>
        )}
        {/* Color options */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {colorVariants?.map((variant, index) => (
            <button
              key={variant.color}
              className={`w-4 h-4 rounded-full border ${
                index === selectedColorIndex ? 'border-black' : 'border-gray-300'
              } transition-all hover:scale-110 ${variant.stock === 0 ? 'opacity-50' : ''}`}
              style={{ backgroundColor: variant.color }}
              onClick={(e) => {
                e.preventDefault();
                setSelectedColorIndex(index);
              }}
              aria-label={`Select ${variant.color} color${variant.stock === 0 ? ' (Out of Stock)' : ''}`}
            />
          ))}
        </div>
      </div>
      <div className='mt-2'>
        <p className='pt-1 pb-1 text-sm'>{name}</p>
        <div className="flex justify-between items-center">
          <p className='text-sm font-medium'>{currency}{price}</p>
          {/* <p className="text-xs text-gray-500">
            {colorVariants?.[selectedColorIndex]?.sizes?.length || 0} sizes
          </p> */}
          {/* <p className="text-xs text-gray-500">
            Stock: {currentStock}
          </p> */}
        </div>
      </div>
    </Link>
  )
}

export default ProductItem