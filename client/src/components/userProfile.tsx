'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function UserProfile({ isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const preferredCategoryNames = user.userPreferences
    ?.map((id) => {
      const category = categories.find((cat) => cat._id === id);
      return category?.name;
    })
    .filter(Boolean);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1200] p-4">
      <div
        className="bg-gradient-to-br from-orange-100 to-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-500 ease-out scale-95 animate-slideIn backdrop-blur-sm border border-orange-200"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <img
              src="https://img.freepik.com/premium-vector/young-man-avatar-character-due-avatar-man-vector-icon-cartoon-illustration_1186924-4438.jpg?semt=ais_hybrid&w=740"
              alt="User avatar"
              className="w-24 h-24 rounded-full border-4 border-orange-300 shadow-md object-cover"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-orange-600 text-center mb-6">
            User Profile
          </h2>
          <div className="space-y-5 ">
            <div className="flex items-center space-x-2">
              <span className="text-orange-400 font-semibold text-lg ">Email:</span>
              <span className="text-gray-900 font-medium">{user?.email || 'Not recognized'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-400 font-semibold text-lg ">Role:</span>
              <span className="text-gray-900 font-medium">{user?.role || 'Not recognized'}</span>
            </div>
            <div className="space-y-3">
              <span className="text-orange-400 font-semibold text-lg">Preferred Categories:</span>
              <div className="flex flex-wrap gap-2">
                {isLoading ? (
                  <div className="flex items-center justify-center w-full">
                    <svg
                      className="animate-spin h-6 w-6 text-orange-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span className="ml-2 text-gray-600 text-sm">Loading...</span>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-sm flex items-center">
                    {error}
                    <button
                      onClick={fetchCategories}
                      className="ml-2 text-orange-600 underline hover:text-orange-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : preferredCategoryNames?.length > 0 ? (
                  preferredCategoryNames.map((category, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-4 py-1.5 bg-orange-300 text-white text-sm font-medium rounded-full shadow-sm hover:bg-orange-400 hover:scale-105 transition-all duration-200"
                    >
                      {category}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-600 text-sm">None</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="bg-orange-600 text-white px-8 py-2.5 rounded-full font-semibold hover:bg-orange-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;