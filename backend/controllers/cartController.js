import userModel from "../models/userModel.js"

// add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, color, size } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][color]) {
                if (cartData[itemId][color][size]) {
                    cartData[itemId][color][size]++;
                } else {
                    cartData[itemId][color][size] = 1;
                }
            } else {
                cartData[itemId][color] = { [size]: 1 };
            }
        } else {
            cartData[itemId] = { [color]: { [size]: 1 } };
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Product added to cart successfully!" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, color, size, quantity } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (!cartData[itemId] || !cartData[itemId][color]) {
            throw new Error("Product not found in cart")
        }

        cartData[itemId][color][size] = quantity;
        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Cart updated successfully!" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// get user cart data
const getUserCart = async (req, res) => {

    try {
        
        const { userId } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({success: true, cartData})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
        
    }

}

export { addToCart, updateCart, getUserCart };

