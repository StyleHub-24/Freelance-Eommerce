import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import { Navigate,useNavigate } from 'react-router-dom'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const navigate = useNavigate();

  const fetchList = async () => {
    setLoading(true);
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      // console.log(response.data);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  const removeProduct = async (id) => {
    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  
  const handeleditProduct=(id)=>{
    navigate(`/updateProduct/${id}`); 
  }


  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => ( // Show 5 loaders by default
            <div
              className="grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[1fr_2fr_1fr_1fr_1fr] lg:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-3 py-2 px-3 border text-sm sm:text-base"
              key={index}
            >
              <div className="w-12 sm:w-16 md:w-20 h-12 bg-gray-200 animate-pulse"></div>
              <p className="truncate bg-gray-200 h-6 animate-pulse"></p>
              <p className="hidden md:block bg-gray-200 h-6 animate-pulse"></p>
              <p className="text-sm sm:text-base bg-gray-200 h-6 animate-pulse"></p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 sm:w-5 md:w-6 lg:w-8 h-6 bg-gray-200 animate-pulse"></div>
                <p className="cursor-pointer text-lg text-gray-200 h-6 animate-pulse">X</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="mb-2 text-lg sm:text-xl">All Products List</p>
          <div className="flex flex-col gap-2">
            {/* List Table Title */}
            <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] lg:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm sm:text-base">
              <b>Image</b>
              <b>Name</b>
              <b>Category</b>
              <b>Price</b>
              <b className="text-center">Action</b>
            </div>
            {/* Product List */}
            {list.map((item, index) => (
              <div
                className="grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[1fr_2fr_1fr_1fr_1fr] lg:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-3 py-2 px-3 border text-sm sm:text-base"
                key={index}
              >
                <img className="w-12 sm:w-16 md:w-20 h-auto" src={item.colorVariants[0]?.images[0]} alt={item.name} />
                <p className="truncate">{item.name}</p>
                <p className="hidden md:block">{item.category}</p>
                <p className="text-sm sm:text-base">
                  {currency}
                  {item.colorVariants[0]?.price}
                </p>
                {/* Action Column */}
                <div className="flex items-center justify-center space-x-2">
                  <button onClick={() => handeleditProduct(item._id)}>
                    <img className="w-4 sm:w-5 md:w-6 lg:w-8 h-auto" src={assets.edit_icon} alt="Edit" />
                  </button>
                  <p
                    onClick={() => removeProduct(item._id)}
                    className="cursor-pointer text-lg text-gray-600 hover:text-red-600"
                  >
                    X
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default List