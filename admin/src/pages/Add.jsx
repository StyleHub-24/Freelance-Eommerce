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
    { color: "", images: [null, null, null, null], sizes: [], stock: "" },
  ]);

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
    const newVariants = [...colorVariants];
    const sizes = newVariants[variantIndex].sizes;
    newVariants[variantIndex].sizes = sizes.includes(size)
      ? sizes.filter((s) => s !== size)
      : [...sizes, size];
    setColorVariants(newVariants);
  };

  const addColorVariant = () => {
    setColorVariants([
      ...colorVariants,
      {
        color: "",
        images: [null, null, null, null],
        sizes: [],
        stock: "",
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
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);

      // Add color variants data
      const variantsData = colorVariants.map((variant) => ({
        color: variant.color,
        sizes: variant.sizes,
        stock: variant.stock,
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
        setPrice("");
        setColorVariants([
          { color: "", images: [null, null, null, null], sizes: [], stock: "" },
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
        <input
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="px-3 py-2 w-[120px]"
          type="number"
          placeholder="Price"
          min={1}
        />
      </div>

      {/* Color variants section */}
      {colorVariants.map((variant, variantIndex) => (
        <div key={variantIndex} className="w-full border-b pb-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <input
                required
                value={variant.color}
                onChange={(e) =>
                  handleColorChange(variantIndex, e.target.value)
                }
                className="px-3 py-2 w-full sm:w-auto"
                type="text"
                placeholder="Color name"
              />
              <input
                required
                value={variant.stock}
                onChange={(e) =>
                  handleStockChange(variantIndex, e.target.value)
                }
                className="px-3 py-2 w-[120px]"
                type="number"
                placeholder="Stock"
                min={0}
              />
            </div>
            {variantIndex > 0 && (
              <button
                type="button"
                onClick={() => removeColorVariant(variantIndex)}
                className="text-red-500 w-full sm:w-auto text-left"
              >
                Remove Color
              </button>
            )}
          </div>

          {/* Image uploads */}
          <div className="flex flex-wrap gap-2 mb-3">
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

          {/* Size selection */}
          <div className="flex flex-wrap gap-3">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                onClick={() => handleSizeToggle(variantIndex, size)}
                className="cursor-pointer"
              >
                <p
                  className={`${
                    variant.sizes.includes(size)
                      ? "bg-pink-100"
                      : "bg-slate-200"
                  } px-3 py-1`}
                >
                  {size}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

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
