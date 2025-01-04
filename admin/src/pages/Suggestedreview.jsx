import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Suggestedreview = ({ token }) => {
  const [subcategory, setSubcategory] = useState("");
  const [messages, setMessages] = useState([""]);
  const [categories, setCategories] = useState([
    "Topwear",
    "Bottomwear",
    "Winterwear",
  ]); // Example categories

  useEffect(() => {
    if (subcategory) {
      fetchSuggestedReviews(subcategory);
    }
  }, [subcategory]);

  const fetchSuggestedReviews = async (subcategory) => {

    // Clear previous messages when subcategory changes
    setMessages([]);

    try {
      const response = await axios.get(
        `${backendUrl}/api/review/show-suggested/${subcategory}`
      );
      if (response.data.success) {
        const { suggested } = response.data;
        if (suggested.length > 0) {
          setMessages(suggested[0].messages || []);
          // console.log(suggested[0]._id);
        } else {
          console.log(suggested);
          
          setMessages([]);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching suggested reviews:", error);
      // toast.error("Failed to fetch suggested reviews."); // don't remove this line
    }
  };

  const handleAddMessage = () => {
    if (messages.length < 10) {
      setMessages([...messages, ""]);
    } else {
      toast.warning("You cannot add more than 10 messages.");
    }
  };

  const handleRemoveMessage = (index) => {
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
    toast.success("Message removed successfully so please click the Save Subcategory button!.");
  };

  const handleInputChange = (value, index) => {
    const updatedMessages = [...messages];
    updatedMessages[index] = value;
    setMessages(updatedMessages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(messages)

    if (!subcategory.trim()) {
      toast.error("Subcategory cannot be empty.");
      return;
    }

    if (messages.length === 0) {
      toast.error("Messages array cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/review/add-suggested`,
        {
          subcategory,
          messages,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success("Subcategory and messages saved successfully!");
        setSubcategory("");
        setMessages([""]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("An error occurred while saving the data.");
    }
  };

  return (
    <div className="p-6 border rounded-md bg-white shadow-lg">
      <h1 className="text-xl font-bold mb-4 text-center">
        Add Suggested Reviews
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Subcategory Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcategory
          </label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Subcategory</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Messages
          </label>
          {messages.map((message, index) => (
            <div key={index} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={message}
                onChange={(e) => handleInputChange(e.target.value, index)}
                placeholder={`Message ${index + 1}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveMessage(index)}
                className="text-sm font-medium text-gray-700"
              >
                X
              </button>
            </div>
          ))}
          {messages.length < 10 && (
            <button
              type="button"
              onClick={handleAddMessage}
              className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Add Message
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Save Subcategory
          </button>
        </div>
      </form>
    </div>
  );
};

export default Suggestedreview;
