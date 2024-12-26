import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateProduct = ({ token }) => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate(); // To navigate after update

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Topwear');
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [replacedImages, setReplacedImages] = useState([]);
  // Fetch product details
  const fetchProductDetails = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/product/single', { productId: id, });

      if (response.data.success) {
        const product = response.data.product;
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setSubCategory(product.subCategory);
        setBestseller(product.bestseller);
        setSizes(product.sizes || []);

        // Initialize images with Cloudinary URLs
        setImage1(product.image[0] || null);
        setImage2(product.image[1] || null);
        setImage3(product.image[2] || null);
        setImage4(product.image[3] || null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch product details.');
    }
  };


  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Create FormData to send as multipart/form-data
      const formData = new FormData();

      // Append product details
      formData.append('id', id); // Send the product ID
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('sizes', JSON.stringify(sizes)); // Convert sizes to JSON string if necessary
      formData.append('replacedImages',JSON.stringify(replacedImages));

      // Append updated images if they are provided
      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);
      if (image4) formData.append('image4', image4);

      // Make the PUT request to update the product
      const response = await axios.put(`${backendUrl}/api/productUpdate/update`, formData, { headers: { token } });

      // Handle response
      if (response.data.success) {
        toast.success('Product updated successfully!');
        navigate('/list'); // Navigate back to the product list after successful update
      } else {
        toast.error(response.data.message || 'Failed to update product.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product due to an error.');
    }
  };

  

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
    <p className="mb-2">Update Images</p>
    <div className="flex gap-2">
  {[image1, image2, image3, image4].map((image, index) => (
    <div key={index} className="relative">
      <label htmlFor={`image${index + 1}`}>
        <img
          className="w-20"
          src={
            image
              ? typeof image === 'string' && image.startsWith('http') // Check if image is a URL string
                ? image // If image is a URL (e.g., Cloudinary), use it
                : URL.createObjectURL(image) // If it's a file selected by the user, use the local preview
              : assets.upload_area // Show placeholder if no image uploaded
          }
          alt={`Product Image ${index + 1}`}
        />
      </label>

      {/* Remove button to delete image */}
      {image && (
        <button
          type="button"
          className="absolute top-0 right-0 text-black font-bold text-sm rounded-full px-1"
          onClick={() => {
            const setter = [setImage1, setImage2, setImage3, setImage4][index];
            setter(null); // Reset the image

            // Update replacedImages state to track the removed image
            setReplacedImages((prev) => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev; // Avoid duplicates if the index is already present
            });
          }}
        >
          X
        </button>
      )}

      <input
        onChange={(e) => {
          const newImage = e.target.files[0];
          const setters = [setImage1, setImage2, setImage3, setImage4];
          const setter = setters[index];

          // Update the image state for the given index
          setter(newImage);

          // Update the replacedImages state when a new image is selected
          setReplacedImages((prev) => {
            if (!prev.includes(index)) {
              return [...prev, index];
            }
            return prev; // Avoid duplicates if the index is already present
          });
        }}
        type="file"
        id={`image${index + 1}`}
        hidden
      />
    </div>
  ))}
</div>



      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
            min={1}
          />
        </div>
      </div>
      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`${sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'
                  } px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>
      <button
        type="submit"
        className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        UPDATE
      </button>
    </form>
  );
};

export default UpdateProduct;
