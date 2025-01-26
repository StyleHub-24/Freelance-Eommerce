import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const Add = ({ token }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);

  const [colorVariants, setColorVariants] = useState([
    { 
      color: "", 
      images: [null, null, null, null], 
      sizes: [], 
      price: "",
    },
  ]);

  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeInfo, setSizeInfo] = useState({
    stock: "",
    chestMeasurements: {
      inches: "",
      cm: ""
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleColorChange = (index, color) => {
    const newVariants = [...colorVariants];
    newVariants[index].color = color;
    setColorVariants(newVariants);
  };

  const handleStockChange = (index, stock) => {
    const newVariants = [...colorVariants];
    newVariants[index].stock = parseInt(stock) || 0;
    setColorVariants(newVariants);
  };

  const handleImageChange = (variantIndex, imageIndex, file) => {
    const newVariants = [...colorVariants];
    newVariants[variantIndex].images[imageIndex] = file;
    setColorVariants(newVariants);
  };

  const handleSizeToggle = (variantIndex, size) => {
    setSelectedVariantIndex(variantIndex);
    setSelectedSize(size);
    
    // Check if size info already exists for this size
    const existingSizeInfo = colorVariants[variantIndex].sizes?.find(s => s.size === size);
    if (existingSizeInfo) {
      // If exists, populate the form with existing data
      setSizeInfo({
        stock: existingSizeInfo.stock,
        chestMeasurements: {
          inches: existingSizeInfo.chestMeasurements.inches,
          cm: existingSizeInfo.chestMeasurements.cm
        }
      });
    } else {
      // If it's a new size, reset the form
      setSizeInfo({
        stock: "",
        chestMeasurements: {
          inches: "",
          cm: ""
        }
      });
    }
    
    setShowSizePopup(true);
  };

  const handleAddSizeInfo = () => {
    if (!sizeInfo.stock || !sizeInfo.chestMeasurements.inches || !sizeInfo.chestMeasurements.cm) {
      toast.error("Please fill all the size information");
      return;
    }

    const newVariants = [...colorVariants];
    const currentSizes = newVariants[selectedVariantIndex].sizes || [];
    
    // Add or update size info
    const sizeExists = currentSizes.findIndex(s => s.size === selectedSize);
    if (sizeExists !== -1) {
      currentSizes[sizeExists] = {
        size: selectedSize,
        ...sizeInfo
      };
    } else {
      currentSizes.push({
        size: selectedSize,
        ...sizeInfo
      });
    }

    newVariants[selectedVariantIndex].sizes = currentSizes;
    setColorVariants(newVariants);
    handleCloseSizePopup();
  };

  const handleCloseSizePopup = () => {
    setShowSizePopup(false);
    setSelectedSize(null);
    setSizeInfo({
      stock: "",
      chestMeasurements: {
        inches: "",
        cm: ""
      }
    });
  };

  const addColorVariant = () => {
    setColorVariants([
      ...colorVariants,
      {
        color: "",
        images: [null, null, null, null],
        sizes: [],
        price: "",
      },
    ]);
  };

  const removeColorVariant = (index) => {
    setColorVariants(colorVariants.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);

      // Add color variants data
      const variantsData = colorVariants.map((variant) => ({
        color: variant.color,
        price: variant.price,
        sizes: variant.sizes,
      }));
      formData.append("colorVariants", JSON.stringify(variantsData));

      // Add images for each variant
      colorVariants.forEach((variant, variantIndex) => {
        variant.images.forEach((image, imageIndex) => {
          if (image) {
            formData.append(`image${variantIndex}_${imageIndex + 1}`, image);
          }
        });
      });

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setColorVariants([
          { 
            color: "", 
            images: [null, null, null, null], 
            sizes: [], 
            price: "",
          },
        ]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
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
        <select
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2"
        >
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
        <select
          onChange={(e) => setSubCategory(e.target.value)}
          className="px-3 py-2"
        >
          <option value="Topwear">Topwear</option>
          <option value="Bottomwear">Bottomwear</option>
          <option value="Winterwear">Winterwear</option>
        </select>
      </div>

      {/* Color variants section */}
      <div className="flex flex-col gap-4 mt-4">
        {colorVariants.map((variant, variantIndex) => (
          <div key={variantIndex} className="border p-4 rounded-lg">
            <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) => handleColorChange(variantIndex, e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) => {
                    const newVariants = [...colorVariants];
                    newVariants[variantIndex].price = e.target.value;
                    setColorVariants(newVariants);
                  }}
                  className="border rounded px-2 py-1"
                />
              </div>
              
              {variantIndex > 0 && (
                <button
                  type="button"
                  onClick={() => removeColorVariant(variantIndex)}
                  className="text-red-500 hover:text-red-700 font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
                  title="Remove Color"
                >
                  ×
                </button>
              )}
            </div>

            {/* Size selection */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`px-3 py-1 rounded ${
                    variant.sizes?.some(s => s.size === size)
                      ? "bg-pink-100"
                      : "bg-slate-200"
                  }`}
                  onClick={() => handleSizeToggle(variantIndex, size)}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Image upload section */}
            <div className="flex flex-wrap gap-2 mb-4">
              {variant.images.map((image, imageIndex) => (
                <label key={imageIndex} className="cursor-pointer">
                  <img
                    className="w-20 h-20 object-cover"
                    src={!image ? assets.upload_area : URL.createObjectURL(image)}
                    alt=""
                  />
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      handleImageChange(
                        variantIndex,
                        imageIndex,
                        e.target.files[0]
                      )
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Size Info Popup */}
      {showSizePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Size Information for {selectedSize}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  value={sizeInfo.stock}
                  onChange={(e) => setSizeInfo({...sizeInfo, stock: e.target.value})}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Enter stock quantity"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Chest (inches)</label>
                <input
                  type="text"
                  value={sizeInfo.chestMeasurements.inches}
                  onChange={(e) => setSizeInfo({
                    ...sizeInfo,
                    chestMeasurements: {
                      ...sizeInfo.chestMeasurements,
                      inches: e.target.value
                    }
                  })}
                  className="w-full border rounded px-2 py-1"
                  placeholder="e.g., 34-37"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Chest (cm)</label>
                <input
                  type="text"
                  value={sizeInfo.chestMeasurements.cm}
                  onChange={(e) => setSizeInfo({
                    ...sizeInfo,
                    chestMeasurements: {
                      ...sizeInfo.chestMeasurements,
                      cm: e.target.value
                    }
                  })}
                  className="w-full border rounded px-2 py-1"
                  placeholder="e.g., 86-94"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={handleCloseSizePopup}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSizeInfo}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Size Info
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={addColorVariant}
        className="bg-gray-200 px-4 py-2 rounded"
      >
        Add Color Variant
      </button>

      <div className="flex gap-3 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2
        rounded-md bg-slate-800 py-2 px-4 
        text-white hover:bg-slate-700 
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        min-w-[120px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          "ADD PRODUCT"
        )}
      </button>
    </form>
  );
};

export default Add;
