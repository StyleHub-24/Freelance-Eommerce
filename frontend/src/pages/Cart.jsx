import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";
import { ShoppingBag } from "lucide-react";

const Loader = () => {
  return (
    <div className="animate-pulse flex flex-col items-center space-y-4">
      <div className="w-full h-40 bg-gray-300 rounded-md"></div>
      <div className="w-3/4 h-4 bg-gray-300 rounded-md"></div>
      <div className="w-1/2 h-4 bg-gray-300 rounded-md"></div>
    </div>
  );
};

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const productId in cartItems) {
        for (const color in cartItems[productId]) {
          for (const size in cartItems[productId][color]) {
            if (cartItems[productId][color][size] > 0) {
              tempData.push({
                _id: productId,
                color: color,
                size: size,
                quantity: cartItems[productId][color][size],
              });
            }
          }
        }
      }
      setCartData(tempData);
      setLoading(false);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => <Loader key={index} />)
        ) : cartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-6">
            <p className="text-xl text-gray-600">Your cart is empty</p>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag size={20} />
              Continue Shopping
            </button>
          </div>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find(
              (product) => product._id === item._id
            );

            const colorVariant = productData?.colorVariants.find(
              (variant) => variant.color === item.color
            );

            if (!productData || !colorVariant) return null;

            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img
                    className="w-16 sm:w-20 cursor-pointer"
                    src={colorVariant.images[0]}
                    alt=""
                    onClick={() => navigate(`/product/${productData._id}?color=${item.color}`)}
                  />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">
                      {productData.name}
                    </p>
                    <div className="flex items-center gap-5 mt-2">
                      <p>
                        {currency}
                        {colorVariant.price}
                      </p>
                      <p className="px-2 sm:px-3 sm:py-1 border rounded-md bg-slate-50">
                        {item.size}
                      </p>
                    </div>
                      <div className="flex items-center gap-1 mt-2">
                        <p className="text-xs text-gray-500 font-medium">Color: {item.color}</p>
                        <div 
                          className="w-4 h-4 rounded-full border border-black"
                          style={{ backgroundColor: item.color }}
                          aria-label={`${item.color} color`}
                        />
                      </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <button
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(
                          item._id,
                          item.size,
                          item.quantity - 1,
                          item.color
                        );
                      }
                    }}
                    className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-5 sm:w-8 text-center font-medium text-sm sm:text-base">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => {
                      updateQuantity(
                        item._id,
                        item.size,
                        item.quantity + 1,
                        item.color
                      );
                    }}
                    className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                  <img
                    onClick={() => updateQuantity(item._id, item.size, 0, item.color)}
                    className="w-4 mr-4 sm:w-5 cursor-pointer"
                    src={assets.bin_icon}
                    alt=""
                  />
              </div>
            );
          })
        )}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          {cartData.length > 0 && !loading && <CartTotal />}
          <div className="w-full text-end">
            {cartData.length > 0 && !loading && (
              <button
                onClick={() => cartData.length === 0 ? toast.error("Cart is empty!") : navigate("/place-order")}
                className="bg-black text-white text-sm my-8 px-8 py-3 active:bg-gray-700"
              >
                PROCEED TO CHECKOUT
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
