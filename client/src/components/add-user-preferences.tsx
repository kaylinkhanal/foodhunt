"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import { updateUserPreferences } from "@/redux/reducerSlices/userSlice";
import { useRouter } from "next/navigation";

// --- Category Image Fallback Data ---
// This object provides fallback image URLs for categories that might not have an image from the backend.
const categoryImages = {
  Pizza: "https://pngimg.com/uploads/pizza/pizza_PNG7097.png",
  Burger: "https://assets.stickpng.com/thumbs/5906078f0cbeef0acff9a645.png",
  Drinks: "https://assets.stickpng.com/thumbs/587e337f9686194a55adab7c.png",
  Coffee: "https://assets.stickpng.com/thumbs/58afe053829958a978a4a6c1.png",
  Asian: "https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c1fa.png",
  "Veg Items":
    "https://assets.stickpng.com/thumbs/5ea45804b033640004a14acc.png",
  Desserts: "https://assets.stickpng.com/thumbs/580b57fbd9996e24bc43c0b2.png",
  Bakery: "https://assets.stickpng.com/thumbs/58b16c4e102ddecdee0dd021.png",
  Snacks:
    "https://purepng.com/public/uploads/large/purepng.com-lays-chips-packpotato-tasty-pack-lays-chips-snack-taste-product-941524636381ybdhu.png",
  Momo: "https://raw.githubusercontent.com/hdpngworld/HPW/main/uploads/652ab95041b31-momos%20images%20hd%20png.png",
  Chowmein:
    "https://rosepng.com/wp-content/uploads/elementor/thumbs/s11728_chow_mein_isolated_on_white_background_-stylize_200_6a0d152a-33c3-4581-b799-746d2d291b91_1-photoroom-qux0rjtxvx3jggsy6lg8b6t9nq3j2io136ofryw90g.png",
  Thakali:
    "https://khukurinepalirestaurant.com.au/wp-content/uploads/2023/05/Asset-34@300x.png",
  Newari:
    "https://restaurant.heshela.com.au/wp-content/uploads/2024/10/YomariSet.png",
  Sekuwa:
    "https://khukurinepalirestaurant.com.au/wp-content/uploads/2023/05/Asset-3@300x-e1684243247509.png",
  Indian:
    "https://rosepng.com/wp-content/uploads/elementor/thumbs/s11728_pav_bhaji_isolated_on_white_background_-stylize_200_b2e7d41e-b988-4514-8e72-48c4ad8fca6d_2-photoroom-qyn4zlnfwk61mxajj1ft6tbdpawq4vc88rchb63s80.png",
  Others:
    "https://rosepng.com/wp-content/uploads/2024/10/screenshot-2024-10-01-155747-1-300x212.png",
};

// --- Mock Category Data ---
const mockCategories = [
  {
    _id: "60c72b2f9b1d8b0015b2e3e1",
    name: "Pizza",
    description: "Italian flatbread with toppings",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3e2",
    name: "Burger",
    description: "A sandwich consisting of cooked patties of ground meat",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3e3",
    name: "Drinks",
    description: "Beverages of various types",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3e4",
    name: "Coffee",
    description: "A brewed drink prepared from roasted coffee beans",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3e5",
    name: "Asian",
    description: "Cuisines from various Asian countries",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3e6",
    name: "Veg Items",
    description: "Vegetarian dishes",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3e7",
    name: "Desserts",
    description: "Sweet course eaten at the end of a meal",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3e8",
    name: "Bakery",
    description: "Baked goods like bread, cakes, pastries",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3e9",
    name: "Snacks",
    description: "Small portions of food eaten between meals",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3eB",
    name: "Momo",
    description: "Dumplings popular in South Asia",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3eC",
    name: "Chowmein",
    description: "Chinese stir-fried noodles",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3eD",
    name: "Thakali",
    description: "Traditional Nepali cuisine from Thakali people",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3eE",
    name: "Newari",
    description: "Traditional cuisine of the Newar people of Nepal",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3eF",
    name: "Sekuwa",
    description: "Nepali grilled meat dish",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3f0",
    name: "Indian",
    description: "Diverse cuisine from the Indian subcontinent",
  },
  {
    _id: "60c72b2f9b1d8b0015b2e3f1",
    name: "Others",
    description: "Miscellaneous food items",
  },
];

// --- Checkmark SVG Icon (for selected categories) ---
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-white"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default function UserPreferences() {
  const dispatch = useDispatch();
  const router = useRouter();
  // Get current user preferences from Redux, ensuring it's an array and contains _id strings
  const currentUserPreferences = useSelector(
    (state) => state.user.userPreferences
  );
  const userId = useSelector((state) => state.user._id); // Get userId from Redux for the PATCH request
  const userRole = useSelector((state) => state.user.role);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      if (!userId) {
        toast("User not logged in. Cannot save preferences.");
        router.push("/");
      }

      if (userRole !== "user") {
        toast("Food preferences are only for Users.");
        router.push("/");
      }

      try {
        setLoading(true);
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + "/categories"
        );
        setCategories(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Effect to initialize selectedCategoryIds from Redux userPreferences
  // This ensures that if the user already has preferences, they are pre-selected in the UI.
  useEffect(() => {
    console.log(currentUserPreferences);
    setSelectedCategoryIds(
      currentUserPreferences ? currentUserPreferences : []
    );
  }, [currentUserPreferences]);

  // Handle category card click
  const handleCategoryClick = (categoryId) => {
    const isSelected = selectedCategoryIds.includes(categoryId);
    let newSelectedIds;

    if (isSelected) {
      newSelectedIds = selectedCategoryIds.filter((id) => id !== categoryId);
    } else {
      newSelectedIds = [...selectedCategoryIds, categoryId];
    }
    setSelectedCategoryIds(newSelectedIds);
    dispatch(updateUserPreferences(newSelectedIds));
  };

  // Handle "Next" button click to submit preferences to the backend
  const handleNext = async () => {
    setIsSubmitting(true);

    try {
      // The backend expects an array of category IDs
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/add-preferences`,
        {
          userPreferences: selectedCategoryIds,
        }
      );
      toast("Preferences saved successfully!");
    } catch (err) {
      console.error("Error saving preferences:", err);
      toast("Failed to save preferences. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading categories...</p>
      </div>
    );
  }

  if (error && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8 font-inter">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
        <div className="flex w-full items-start gap-8 ">
          <Image
            src="/applogo.png"
            alt="App Logo"
            width={110}
            height={110}
            style={{ objectFit: "contain" }}
          />
          <div className="w-full flex flex-col items-start">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 -mb-1 ">
              What kind of food do you like?
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 ">
              We'll personalize your recommendations.
            </p>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategoryIds.includes(category._id);
            const imageUrl = category.image
              ? `${process.env.NEXT_PUBLIC_API_URL}/category-uploads/${category.image}`
              : categoryImages[category.name];
            return (
              <div
                key={category._id}
                className={`relative flex flex-col items-center justify-center p-2 sm:p-3 bg-gray-50 rounded-xl cursor-pointer transition-all duration-200 ease-in-out
                  ${
                    isSelected
                      ? "border-2 border-orange-400 shadow-md shadow-orange-600"
                      : "border border-gray-200 hover:shadow-md hover:scale-105"
                  }`}
                onClick={() => handleCategoryClick(category._id)}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-orange-400 rounded-full p-1 flex items-center justify-center z-10 shadow-md">
                    <CheckIcon />
                  </div>
                )}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg overflow-hidden mb-2">
                  <Image
                    src={imageUrl}
                    alt={category.name}
                    className="w-full h-full object-contain rounded-lg"
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                  />
                </div>
                <p className="text-sm sm:text-base font-medium text-gray-800 text-start">
                  {category.name}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`w-full max-w-xs py-3 px-6 rounded-full text-lg font-semibold text-white transition-all duration-300 ease-in-out
              ${
                isSubmitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-orange-400 hover:bg-orange-500 active:bg-orange-600 cursor-pointer shadow-lg hover:shadow-xl"
              }`}
          >
            {isSubmitting ? "Saving preferences..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
