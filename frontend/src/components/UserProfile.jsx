import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { Loader2, User, Pencil } from "lucide-react";
import { assets } from "../assets/assets";
import PhoneInput from "./PhoneInput";

const UserProfile = ({ token }) => {
  const [formData, setFormData] = useState({
    userData: null,
    phoneNumber: "",
    gender: "",
    name: "",
    email: "",
    userId: "",
    bio: "",
    dateOfBirth: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { backendUrl } = useContext(ShopContext);

  // Add this inside the component, after existing state declarations
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });

      if (response.data.success) {
        const user = response.data.user;
        setFormData({
          userData: user,
          userId: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber || "",
          gender: user.gender || "other",
          bio: user.bio || "",
          dateOfBirth: formatDateForInput(user.dateOfBirth),
          address: user.address || {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
        });
        // console.log(user.profilePicture)
        user.profilePicture === "defaultImage"
          ? setProfilePicture(assets.defaultProfileImg)
          : setProfilePicture(user.profilePicture);
        // setProfilePicture(user.profilePicture || null);
      } else {
        toast.error("Failed to fetch user profile");
      }
    } catch (error) {
      toast.error(`Error fetching profile: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePicture(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userId", formData.userId);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("address", JSON.stringify(formData.address));

      if (profilePicture instanceof File) {
        formDataToSend.append("profilePicture", profilePicture);
      }

      const response = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        formDataToSend,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");
        if (response.data.updatedUser?.profilePicture) {
          setProfilePicture(response.data.updatedUser.profilePicture);
        }
        fetchUserProfile();
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData.userData) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const getProfilePictureUrl = () => {
    if (profilePicture instanceof File) {
      return URL.createObjectURL(profilePicture);
    }
    return profilePicture || null;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <label
            htmlFor="profilePicture"
            className="cursor-pointer group relative"
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              {getProfilePictureUrl() ? (
                <img
                  className="w-full h-full object-cover"
                  src={getProfilePictureUrl()}
                  alt="Profile"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/30 flex items-center justify-center p-1">
                <Pencil className="w-4 h-4 text-white" />
              </div>
            </div>
            <input
              type="file"
              id="profilePicture"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <PhoneInput
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {/* <option value="">Select gender</option> */}
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="text"
              value={formData.userData?.age || "Not set"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              disabled
            />
          </div>
        </div>

        {/* Bio Section */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Tell us about yourself"
          />
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street Address
              </label>
              <input
                id="street"
                name="address.street"
                type="text"
                value={formData.address.street}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Street address"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <input
                id="city"
                name="address.city"
                type="text"
                value={formData.address.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="City"
              />
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                State
              </label>
              <input
                id="state"
                name="address.state"
                type="text"
                value={formData.address.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="State"
              />
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ZIP Code
              </label>
              <input
                id="zipCode"
                name="address.zipCode"
                type="text"
                value={formData.address.zipCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="ZIP code"
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Country
              </label>
              <input
                id="country"
                name="address.country"
                type="text"
                value={formData.address.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Country"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
