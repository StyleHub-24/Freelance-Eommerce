import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    const addToCart = async (itemId, size, color) => {

        if (!size || !color) {
            toast.error('Select Product Size and Color');
            return;
        }

        let cartData = structuredClone(cartItems);
        
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        if (!cartData[itemId][color]) {
            cartData[itemId][color] = {};
        }
        cartData[itemId][color][size] = (cartData[itemId][color][size] || 0) + 1;
        toast.success('Item added to cart');
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', 
                    { itemId, size, color }, 
                    { headers: { token } }
                );
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    // useEffect(() => {
    //     console.log(cartItems);
    // }, [cartItems])

    const getCartCount = () => {
        return Object.entries(cartItems).reduce((total, [_, colors]) => {
            return total + Object.entries(colors).reduce((colorTotal, [_, sizes]) => {
                return colorTotal + Object.values(sizes).reduce((sizeTotal, quantity) => sizeTotal + quantity, 0);
            }, 0);
        }, 0);
    }
    
    const updateQuantity = async (itemId, size, quantity, color) => {
        
        let cartData = structuredClone(cartItems);
        cartData[itemId][color][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', 
                    { itemId, size, color, quantity }, 
                    { headers: { token } }
                );
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }

    }

    const getCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, colors]) => {
            const itemInfo = products.find(product => product._id === itemId);
            if (!itemInfo) return total;

            return total + Object.values(colors).reduce((colorTotal, sizes) => {
                return colorTotal + Object.values(sizes).reduce((sizeTotal, quantity) => {
                    return sizeTotal + (quantity * itemInfo.price);
                }, 0);
            }, 0);
        }, 0);
    }

    const getProductsData = async () => {
        try {
            
            const response = await axios.get(backendUrl + '/api/product/list');
            // console.log(response.data);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers: {token}});
            // console.log(response.data);
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    // fetch user data
    const getUserData = async (tokenValue) => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/profile`, {
                headers: { token: tokenValue }
            });
            if (response.data.success) {
                setUserData(response.data.user);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getProductsData();
    }, [])

    useEffect(() => {
      if (!token && localStorage.getItem('token')) {
        setToken(localStorage.getItem('token'));
        getUserCart(localStorage.getItem('token'))
        getUserData(localStorage.getItem('token'));
      }
    }, [])
    

    const value = {
        products , currency , delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, userData, getUserCart
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;