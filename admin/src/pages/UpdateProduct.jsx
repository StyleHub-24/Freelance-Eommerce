import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendUrl } from '../App'

const UpdateProduct = ({ token }) => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate(); // To navigate after update

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [bestseller, setBestseller] = useState(false);
  const [colorVariants, setColorVariants] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading state to true

  // Fetch product details
  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/product/single`, { productId: id });
      if (response.data.success) {
        const product = response.data.product;
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setSubCategory(product.subCategory);
        setBestseller(product.bestseller);

        const productVariants = product.colorVariants.map((variant) => ({
          color: variant.color,
          images: variant.images || [null, null, null, null],
          sizes: variant.sizes || [],
          stock: variant.stock,
        }));
        setColorVariants(productVariants);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        id,
        name,
        description,
        price,
        category,
        subCategory,
        bestseller,
        colorVariants: colorVariants.map((variant) => ({
          color: variant.color,
          sizes: variant.sizes,
          stock: variant.stock,
        })),
      };
      console.log(updatedData.price)
      const response = await axios.put(`${backendUrl}/api/productUpdate/update`, updatedData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success('Product updated successfully!');
        navigate('/list'); // Redirect to product list after update
      } else {
        toast.error(response.data.message || 'Failed to update product.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product due to an error.');
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 1 }).map((_, index) => ( // Show 1 loader by default
            <div key={index} className="w-full border-b pb-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <div className="w-full max-w-[500px] h-10 bg-gray-200 animate-pulse"></div>
                <div className="w-[100px] h-10 bg-gray-200 animate-pulse"></div>
              </div>
              <div className="flex gap-2 mb-3">
                {Array.from({ length: 4 }).map((_, imgIndex) => (
                  <div key={imgIndex} className="w-20 h-20 bg-gray-200 animate-pulse"></div>
                ))}
              </div>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <div key={size} className="w-10 h-10 bg-gray-200 animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
          {/* Basic product info */}
          <div className="w-full">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-[500px] px-3 py-2"
              type="text"
              placeholder="Product Name"
            />
          </div>
          <div className="w-full">
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full max-w-[500px] px-3 py-2"
              placeholder="Product Description"
            />
          </div>

          {/* Category selectors and price */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
            <select onChange={(e) => setCategory(e.target.value)} className="px-3 py-2">
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
            <select onChange={(e) => setSubCategory(e.target.value)} className="px-3 py-2">
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
            <input
              required
              value={price}
              onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
              className='px-3 py-2 w-[120px]'
              type="number"
              placeholder='Price'
              min={1}
            />
          </div>

          {/* Color variants section */}
          {colorVariants.map((variant, variantIndex) => (
            <div key={variantIndex} className="w-full border-b pb-4 mb-4">
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3'>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <input
                  required
                  value={variant.color}
                  onChange={(e) => {
                    const updatedVariants = [...colorVariants];
                    updatedVariants[variantIndex].color = e.target.value;
                    setColorVariants(updatedVariants);
                  }}
                  className="px-3 py-2 w-full sm:w-auto"
                  type="text"
                  placeholder="Color name"
                />
                <input
                  required
                  value={variant.stock}
                  onChange={(e) => {
                    const updatedVariants = [...colorVariants];
                    updatedVariants[variantIndex].stock = parseInt(e.target.value) || 0;
                    setColorVariants(updatedVariants);
                  }}
                  className="px-3 py-2 w-[120px]"
                  type="number"
                  placeholder="Stock"
                  min={0}
                />
              </div>
              </div>

              {/* Display fetched images */}
              <div className="flex flex-wrap gap-2 mb-3">
                {variant.images.map((image, imageIndex) => (
                  <img
                    key={imageIndex}
                    className="w-20 h-20 object-cover"
                    src={image || 'https://via.placeholder.com/80'} // Placeholder for null images
                    alt={`Variant ${variantIndex} Image ${imageIndex + 1}`}
                  />
                ))}
              </div>

              {/* Size selection */}
              <div className="flex flex-wrap gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <div
                    key={size}
                    onClick={() => {
                      const updatedVariants = [...colorVariants];
                      const sizes = updatedVariants[variantIndex].sizes;
                      updatedVariants[variantIndex].sizes = sizes.includes(size)
                        ? sizes.filter((s) => s !== size)
                        : [...sizes, size];
                      setColorVariants(updatedVariants);
                    }}
                    className="cursor-pointer"
                  >
                    <p
                      className={`${variant.sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'
                        } px-3 py-1`}
                    >
                      {size}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Bestseller checkbox */}
          <div className="flex gap-3 mt-2">
            <input
              onChange={() => setBestseller((prev) => !prev)}
              checked={bestseller}
              type="checkbox"
              id="bestseller"
            />
            <label htmlFor="bestseller">Add to bestseller</label>
          </div>

          {/* Update button */}
          <button
            type="submit"
            className="rounded-md bg-slate-800 py-2 px-4 text-white hover:bg-slate-700"
          >
            UPDATE PRODUCT
          </button>
        </form>
      )}
    </>
  );
};

export default UpdateProduct;
