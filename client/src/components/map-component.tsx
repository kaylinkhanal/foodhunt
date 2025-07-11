"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Minus, Plus } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import L from "leaflet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/reducerSlices/userSlice";
import MapSidebar from "./map-sidebar";
import axios from "axios";

interface MapProps {
  position: [number, number]; // [latitude, longitude]
  zoom?: number;
}

// const foodCategories = [
//   {
//     name: "Burgers",
//     emoji: "🍔",
//     locations: [
//       { name: "S Café Tinkune", coordinates: [27.686, 85.3503] },
//       { name: "AT Burger", coordinates: [27.702, 85.326] },
//       {
//         name: "The Burger House & Crunchy Fried Chicken",
//         coordinates: [27.6925, 85.334],
//       },
//     ],
//   },
//   {
//     name: "Pizza",
//     emoji: "🍕",
//     locations: [
//       { name: "Pizza Palace", coordinates: [27.695, 85.34] },
//       { name: "Domino's", coordinates: [27.7, 85.33] },
//       { name: "Pizza Hut", coordinates: [27.69, 85.345] },
//     ],
//   },
//   {
//     name: "Sushi",
//     emoji: "🍣",
//     locations: [
//       { name: "Sushi Haven", coordinates: [27.688, 85.338] },
//       { name: "Tokyo Sushi", coordinates: [27.705, 85.32] },
//     ],
//   },
//   {
//     name: "Pasta",
//     emoji: "🍝",
//     locations: [
//       { name: "Pasta Place", coordinates: [27.68, 85.355] },
//       { name: "Italian Bistro", coordinates: [27.698, 85.325] },
//     ],
//   },
//   {
//     name: "Tacos",
//     emoji: "🌮",
//     locations: [
//       { name: "Taco Time", coordinates: [27.687, 85.342] },
//       { name: "Mexican Grill", coordinates: [27.703, 85.328] },
//     ],
//   },
//   {
//     name: "Desserts",
//     emoji: "🍰",
//     locations: [
//       { name: "Sweet Treats", coordinates: [27.691, 85.337] },
//       { name: "Cake Corner", coordinates: [27.699, 85.331] },
//     ],
//   },
//   {
//     name: "Coffee",
//     emoji: "☕",
//     locations: [
//       { name: "Coffee Co.", coordinates: [27.694, 85.343] },
//       { name: "Bean Brew", coordinates: [27.701, 85.324] },
//     ],
//   },
//   {
//     name: "Salads",
//     emoji: "🥗",
//     locations: [
//       { name: "Green Bowl", coordinates: [27.689, 85.339] },
//       { name: "Fresh Greens", coordinates: [27.704, 85.327] },
//     ],
//   },
//   {
//     name: "Sandwiches",
//     emoji: "🥪",
//     locations: [
//       { name: "Sandwich Stop", coordinates: [27.693, 85.341] },
//       { name: "Sub Shack", coordinates: [27.702, 85.329] },
//     ],
//   },
//   {
//     name: "BBQ",
//     emoji: "🍖",
//     locations: [
//       { name: "BBQ Barn", coordinates: [27.685, 85.347] },
//       { name: "Smokehouse", coordinates: [27.697, 85.323] },
//     ],
//   },
// ];

const createEmojiIcon = (emoji, discountPercentage) => {
  return L.divIcon({
    html: `
      <div class="relative flex flex-col items-center">
        <div class="discount-text" style="font-size: 18px; text-align: center; font-weight: bold;">${discountPercentage.toFixed(2)}% OFF</div>
        <div class="emoji-container" style="font-size: 48px; text-align: center; line-height: 1; position: relative;">
          ${emoji}
          <span class="ripple"></span>
        </div>
      </div>
      <style>
        .emoji-container {
          position: relative;
          display: inline-block;
        }
        .ripple {
          position: absolute;
          top: 50%; /* Ripple starts at the center */
          left: 50%;
          width: 20px;
          height: 20px;
          background:rgb(255, 77, 0);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple-effect 1.2s infinite;
          z-index: -1; /* Place ripple below the emoji */
        }
        @keyframes ripple-effect {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(5); /* Larger spread */
            opacity: 0;
          }
        }
        .discount-text {
          animation: pulse-text 1.5s infinite ease-in-out;
        }
        @keyframes pulse-text {
          0% {
            transform: scale(1);
            color: red;
          }
          50% {
            transform: scale(1.5); /* Slightly larger */
            color: red;
          }
          100% {
            transform: scale(1);
            color: red;
          }
        }
      </style>`,
    className: "custom-emoji-icon",
    iconSize: [60, 60],
    iconAnchor: [30, 60], // Centered icon
    popupAnchor: [0, -50], // Popup above icon
  });
};
const MapComponent: React.FC<MapProps> = ({ position, zoom = 12 }) => {
  const { _id } = useSelector((state) => state.user);
  const [productList, setProductList] = useState([]);
  const [productsOfSelectedCategory,setProductsOfSelectedCategory] = useState([])

  
  const [foodSearch, setFoodSearch] = useState("");
  const userPreferences = useSelector((state) => state.user.userPreferences);
  const [foodCategories,setFoodCategories] = useState([])
  const fetchProducts = async () => {
    if (!userPreferences || userPreferences.length === 0 || !_id) {
      setProductList([]); // Clear products if no preferences or user ID
      console.log(
        "Cannot fetch products: No user preferences or user ID available."
      );
      return;
    }
    const allFetchedProducts = []; // To accumulate all products from different queries
    for (const item of userPreferences) {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products?name=${item}&userId=${_id}`
      );

      allFetchedProducts.push(...data);
    }

    const reducedArr = allFetchedProducts.map((item)=> {
      item.quantity = 1
     return item
    })
    setProductList(reducedArr)
  };

  const fetchCategories = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`
    );
    setFoodCategories(data)

  };

  const fetchProductChip = async (catId= '') => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/product-chips?categoryId=${catId}`
    );
    setProductsOfSelectedCategory(data)

  };



  const fetchProductsByProductIds = async (id) => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/product-search?productIds=${id.join(',')}`
    );
    setProductList(data)

  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchProductChip()
  }, []);

  // const [search, setSearch] = useState('');
  const { isLoggedIn } = useSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]); // Default to first category (Burgers)
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Track input focus
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const [burgerType, setBurgerType] = useState([
    {
      name: "Classic Beef Burger 🍔",
      price: 10.99,
      discounted_price: 9.5,
      quantity: 0,
    },
    {
      name: "Cheeseburger Deluxe 🧀🍔",
      price: 12.5,
      discounted_price: 11.0,
      quantity: 0,
    },
  ]);

 


  const totalPrice = burgerType.reduce(
    (sum, item) => sum + item.discounted_price * item.quantity,
    0
  );

  const handlePlaceOrder = (item) => {
    debugger;
    // // api call { 
    //   userId,
    //   productId,
    //   quantity,
    //   paymentMethod,  
  // }
  };

  const handleCategoryClick = (category) => {
    fetchProductsByProductIds(category.product_ids)
    setSelectedCategory(category);
    setIsSearchFocused(false);
  };

  const handleSidebarCategoryClick = (category) => {
fetchProductChip(category._id)
  } 

  const handleDecrement = (clickedItem)=> {
    const temp = [...productList]
   const reducedArr = temp.map((item)=> {
    if(item._id === clickedItem._id && item.quantity!==1) {
      item.quantity--
    }
    return item
   })
   debugger;
   setProductList(reducedArr)

  }

  const handleIncrement = (clickedItem)=> {
    const temp = [...productList]
    const reducedArr = temp.map((item)=> {
     if(item._id === clickedItem._id && item.quantity< item.availableQuantity) {
       item.quantity++
     }
     return item
    })
    debugger;
    setProductList(reducedArr)
  }

  return (
    <div className="relative w-full h-screen">
      {/* Sidebar Component */}
      <MapSidebar
        foodCategories={foodCategories}
        onCategoryClick={handleSidebarCategoryClick}
      />

      {/* Map Layer */}
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <div className="z-1200 absolute top-10 bg-white hidden">
          {JSON.stringify(productList)}
        </div>
        {productList.map((item) => {
          if (!item.sellerId?.coords?.lat || !item.sellerId?.coords?.lng)
            return null;
          const customIcon = createEmojiIcon(item.category?.emoji, item.discountPercentage);
          return (
            <Marker
              position={[
                item.sellerId?.coords?.lat,
                item.sellerId?.coords?.lng,
              ]}
              icon={customIcon}
              key={item._id}
            >
              <Popup maxWidth={300}>
       
                {selectedCategory.emoji} 
                  <div>

                      <Card
                        // key={index}
                        className="py-2 my-2 w-full bg-white shadow-lg border border-gray-200"
                      >
                        <CardContent className="py-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-bold text-gray-800 flex-1">
                              Avaialble items in stock: {item.availableQuantity}
                           {item.name}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500 line-through">
                                Rs111
                              </span>
                              <span
                                className="text-lg font-bold"
                                style={{ color: "#FAA617" }}
                              >
                                Rs {item.discountedPrice}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={()=> handleDecrement(item)}
                                style={{
                                  borderColor: "#FAA617",
                                  color: "#FAA617",
                                }}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="min-w-[2rem] text-center font-semibold text-lg">
                             {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleIncrement(item)}
                                style={{
                                  borderColor: "#FAA617",
                                  color: "#FAA617",
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                            <div className="text-right text-xs text-gray-600">
                              Subtotal:{" "}
                              <span
                                className="font-semibold"
                                style={{ color: "#FAA617" }}
                              >
                                Rs{" "}
                                {item.discountedPrice * item.quantity}
                              </span>
                            </div>
                        </CardContent>
                      </Card>
    
                    <div className="mt-2 text-right font-semibold">
                      Total:{" "}
                      <span style={{ color: "#FAA617" }}>
                        रु {totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      className="mt-2 w-full"
                      style={{
                        backgroundColor: "#FAA617",
                        color: "white",
                      }}
                      onClick={()=> handlePlaceOrder(item)}
                    >
                      Place Order
                    </Button>
                  </div>
       
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Food Category Chips */}
      <div className="absolute  top-4 left-1/2 transform -translate-x-1/3 z-[1000] w-[1000px]">
        <ScrollArea className="w-full whitespace-nowrap rounded-full scrollbar-hidden">
          <div className="flex space-x-2 p-2">
            {productsOfSelectedCategory.length > 0 && productsOfSelectedCategory.map((category, index) => (
              <Button
                key={index}
                variant={
                  selectedCategory.name === category.name
                    ? "default"
                    : "outline"
                }
                className={`flex items-center space-x-2 ${
                  selectedCategory.name === category.name
                    ? "bg-orange-400 text-white"
                    : "bg-orange-400 text-white border-0"
                } rounded-full px-4 py-2`}
                onClick={() => handleCategoryClick(category)}
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
          <ScrollBar
            orientation="horizontal"
            className="h-2  bg-white rounded-full hidden"
          />
        </ScrollArea>
      </div>

      {/* Search Input with Card */}
      <div className="absolute top-4 bg-orange-400 rounded-full p-1 left-1/8 transform -translate-x-1/2 z-[1000] w-[300px]">
        <Input
          className="text-white border-0 rounded-full outline-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
          type="search"
          placeholder="Search offers for your meal"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        {isSearchFocused && (
          <Card className="absolute top-12 left-1/2 transform -translate-x-1/2 w-[300px] bg-white shadow-lg z-[1001]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Suggested Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {foodCategories.map((category, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left mb-1 hover:bg-[#f85000] hover:text-white"
                  onClick={() => handleCategoryClick(category)}
                >
                  <span className="mr-2">{category.emoji}</span>
                  <span>{category.name}</span>
                </Button>
              ))}
            </CardContent>
            <CardFooter className="p-2">
              <Button
                variant="outline"
                className="w-full"
                style={{ borderColor: "#f85000", color: "#f85000" }}
                onClick={() => setIsSearchFocused(false)}
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Authentication Buttons */}
      <div className="absolute top-6 right-35 z-[1000]">
        {isLoggedIn ? (
          <Button
            onClick={handleLogout}
            variant="outline"
            className="justify-start bg-orange-600 hover:bg-orange-400 text-blue-50"
          >
            Logout
          </Button>
        ) : (
          <div className="flex flex-row items-center space-x-4 ml-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="justify-start bg-black hover:bg-[#c74021] text-blue-50"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                className="w-full justify-start bg-[#faa617]"
              >
                Sign up
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Avatar Dropdown */}
      <div className="absolute top-4 right-20 z-[1000]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-12 w-12 cursor-pointer">
              <AvatarImage
                src="https://img.freepik.com/premium-vector/young-man-avatar-character-due-avatar-man-vector-icon-cartoon-illustration_1186924-4438.jpg?semt=ais_hybrid&w=740"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[1100]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MapComponent;
