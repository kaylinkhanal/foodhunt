"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import { updateUserPreferences } from "@/redux/reducerSlices/userSlice";
import { useRouter } from "next/navigation";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
import { MultiSelect } from "./multi-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import AddUserPreferences from "@/app/user-preferences/page";

function transformProducts(products) {
  // Function to return array of unique products and emoji from all product
  // the array will be compatible to use with MultiSelect component

  const uniqueItemsMap = new Map(); // Stores: 'ProductName' -> { label: 'Name', icon: <p>Emoji</p> }

  products.forEach((product) => {
    const name = product.name;
    const emoji = product.category?.emoji;

    // Only adds if the name hasn't been processed yet to ensure uniqueness
    // and picks the emoji from the first encounter.
    if (!uniqueItemsMap.has(name)) {
      uniqueItemsMap.set(name, {
        value: name, // The unique name as the value
        label: name, // The unique name as the label
        icon: () => <p>{emoji}</p>, // Wrap the emoji in a <p> component, as the MultiSelect component expects Icon component
      });
    }
  });
  // Convert the Map values into an array
  return Array.from(uniqueItemsMap.values());
}

export default function UserPreferences() {
  const dispatch = useDispatch();
  const router = useRouter();
  // Get current user preferences from Redux
  const currentUserPreferences = useSelector(
    (state) => state.user.userPreferences
  );
  const userId = useSelector((state) => state.user._id); // Get userId from Redux for the PATCH request
  const userRole = useSelector((state) => state.user.role);

  const [products, setProducts] = useState([]);
  const [favouriteProducts, setFavouriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formattedProducts, setFormattedProducts] = useState([]); // state to pass to MultiSelect component

  // Effect to fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + "/products"
        );
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Effect to initialize favouriteProducts from Redux userPreferences
  // This ensures that if the user already has preferences, they are pre-selected in the UI.
  useEffect(() => {
    setFavouriteProducts(currentUserPreferences ? currentUserPreferences : []);
  }, [currentUserPreferences]);

  // Effect to format the products when products are available
  useEffect(() => {
    setFormattedProducts(transformProducts(products));
  }, [products]);

  // Handle "Next" button click to submit preferences to the backend
  const handleNext = async () => {
    setIsSubmitting(true);

    try {
      // The backend expects an array of product names
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/add-preferences`,
        {
          userPreferences: favouriteProducts,
        }
      );
      toast.success("Preferences saved successfully!");
      dispatch(updateUserPreferences(favouriteProducts)); // Add favourites redux too
    } catch (err) {
      console.error("Error saving preferences:", err);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsSubmitting(false);
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading products...</p>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen justify-center bg-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8 font-inter">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
        <Card className="w-full">
          <CardHeader>
            <div className="flex w-full items-start gap-8 ">
              <Image
                src="/applogo.png"
                alt="App Logo"
                width={110}
                height={110}
                style={{ objectFit: "contain" }}
              />
              <div className="w-full flex flex-col items-start">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 -mb-1 ">
                  What kind of food do you like?
                </CardTitle>
                <CardDescription className="text-base sm:text-lg text-gray-600">
                  We'll personalize your recommendations.
                </CardDescription>
              </div>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
          </CardHeader>
          <CardContent className="-mt-5">
            <MultiSelect
              options={formattedProducts}
              onValueChange={setFavouriteProducts}
              defaultValue={favouriteProducts}
              placeholder="Select options"
              animation={0}
              variant={"default"}
              maxCount={3}
              className=""
            />
            <CardDescription className="mt-1 text-gray-600">
              Choose your favourite foods.
            </CardDescription>
          </CardContent>
          <CardFooter className="w-full">
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-full text-lg font-semibold text-white transition-all duration-300 ease-in-out
              ${
                isSubmitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-orange-400 hover:bg-orange-500 active:bg-orange-600 cursor-pointer shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? "Saving preferences..." : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
