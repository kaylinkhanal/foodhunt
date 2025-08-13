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
<<<<<<< HEAD
import { AwardIcon, Minus, Plus } from "lucide-react";
=======
import { socket } from "@/lib/socket";
import { Minus, Plus, ShoppingBagIcon, ShoppingCart, Bell } from "lucide-react";
>>>>>>> 447a190aabf8db9367714cb8458c1572ade9f77f
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
import axios from "axios";
import { toast } from "sonner";
import { addToCart } from "@/redux/reducerSlices/productSlice";
import MapSidebar from "./map-sidebar";
interface MapProps {
  position: [number, number]; // [latitude, longitude]
  zoom?: number;
}
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
<<<<<<< HEAD
  const [productsOfSelectedCategory,setProductsOfSelectedCategory] = useState([])
  
  // const [search, setSearch] = useState('');
  const { isLoggedIn } = useSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]); // Default to first category (Burgers)
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Track input focus
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allChipProducts, setAllChipProducts] = useState([]);

  const dispatch = useDispatch();
  
=======
  const { cart } = useSelector((state) => state.product);
  const [productsOfSelectedCategory, setProductsOfSelectedCategory] = useState([])
  const [newNotification, setNewNotification] = useState(false);
  useEffect(() => {
    socket.on('connection')
    socket.on('orderId', (orderId) => {
      setNewNotification(true)
    })
>>>>>>> 447a190aabf8db9367714cb8458c1572ade9f77f

  }, [])
  const [foodSearch, setFoodSearch] = useState("");
  const userPreferences = useSelector((state) => state.user.userPreferences);
  const [foodCategories, setFoodCategories] = useState([])
  const fetchProducts = async () => {
    const allFetchedProducts = []; // To accumulate all products from different queries
    for (const item of userPreferences) {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products?name=${item}&userId=${_id}`
      );

      const reducedArr = data.map((item) => {

        item.quantity = 1
        return item
      })
      setProductList(reducedArr)
      allFetchedProducts.push(...data);
    }


  };

  const fetchCategories = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`
    );
    setFoodCategories(data)

  };

  const fetchProductChip = async (catId = '') => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/product-chips?categoryId=${catId}`
    );
    if (data?.length > 0) {

      fetchProductsByProductIds(data[0]?.product_ids)
      setSelectedCategory(data[0])

    }
    setProductsOfSelectedCategory(data)

  };



  const fetchProductsByProductIds = async (id) => {

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/product-search?productIds=${id ? id?.join(',') : ''}`
    );
    const reducedArr = data.map((item) => {
      item.quantity = 1
      return item
    })
    setProductList(reducedArr)


  };

  useEffect(() => {
    fetchProducts();
    // fetchProductsByProductIds(null)
    fetchCategories();
    fetchProductChip()
  }, []);

<<<<<<< HEAD
=======

  const { isLoggedIn } = useSelector((state) => state.user);
  const { cart: reduxCart } = useSelector(state => state.product)
  const [selectedCategory, setSelectedCategory] = useState([]); // Default to first category (Burgers)
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Track input focus
  const dispatch = useDispatch();
>>>>>>> 447a190aabf8db9367714cb8458c1572ade9f77f

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const updateProduct = async (item) => {
    const values = {
      availableQuantity: item.availableQuantity - item.quantity,
    }
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/products/update/${item._id}`, values)
  }
  const handlePlaceOrder = async (item) => {
    const values = {
      bookedById: _id,
      productId: item._id,
      quantity: item.quantity,
      price: item.quantity * item.discountedPrice,
      paymentMethod: 'Cash',
    };
    socket.emit('order', _id);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        values
      );

      toast(response.data.message);
      updateProduct(item)
    } catch (error) {
      console.error("Failed to place order:", error);
      toast("Failed to place order");
    }
    fetchProducts();

  };


  const handleCategoryClick = (category) => {
    fetchProductsByProductIds(category.product_ids)
    setSelectedCategory(category);
    setIsSearchFocused(false);
  };

  const handleSidebarCategoryClick = (category) => {
    fetchProductChip(category._id)
  }

  const handleDecrement = (clickedItem) => {
    const temp = [...productList]
    const reducedArr = temp.map((item) => {
      if (item._id === clickedItem._id && item.quantity !== 1) {
        item.quantity--
      }
      return item
    })
    // debugger;
    setProductList(reducedArr)

  }
  const generateCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  const handleIncrement = (clickedItem) => {
    const temp = [...productList]
    const reducedArr = temp.map((item) => {
      if (item._id === clickedItem._id && item.quantity < item.availableQuantity) {
        item.quantity++
      }
      return item
    })
    // debugger;
    setProductList(reducedArr)
  }


  const handleClick = async (item) => {
    let totalCart = 0
    reduxCart.forEach((cartItem) => {
      if (cartItem._id === item._id) {
        totalCart = totalCart + cartItem.quantity
      }
    })
    if (item.quantity <= item.availableQuantity) {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stock-count/${item._id}`)
      if (data.stockCount >= item.quantity && totalCart <= data.stockCount) {
        dispatch(addToCart(item))
      }
      const temp = [...productList]
      const reducedArr = temp.map((val) => {
        if (val._id === item._id) {
          return {
            ...val,
            availableQuantity: val.availableQuantity - item.quantity,
          }
        }
        return val
      })
      setProductList(reducedArr)
    }
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
                          Available  <span className="text-white p-1 rounded-sm" style={{ backgroundColor: "#FAA617" }}>{item.availableQuantity}</span> {" stocks of "}
                          {item.name}
                        </h3>
                      </div>
                      {item.availableQuantity === 0 && <h4 className="text-red-500 mb-1">{item.name} is currently not available</h4>}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 line-through">
                            रु {item.originalPrice}
                          </span>
                          <span
                            className="text-lg font-bold"
                            style={{ color: "#FAA617" }}
                          >
                            रु {item.discountedPrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDecrement(item)}
                            style={{
                              borderColor: "#FAA617",
                              color: "#FAA617",
                            }}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="min-w-[2rem]  text-center font-semibold text-lg">
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
                      <Button onClick={() => handleClick(item)}>Add to Cart</Button>

                    </CardContent>
                  </Card>

                  <div className="mt-2 text-right font-semibold">
                    Total:{" "}
                    <span style={{ color: "#FAA617" }}>
                      रु {item.discountedPrice * item.quantity}
                    </span>
                  </div>
                  <Button
                    className="mt-2 w-full"
                    style={{
                      backgroundColor: "#FAA617",
                      color: "white",
                    }}
                    disabled={item.availableQuantity < 1}
                    onClick={() => { handlePlaceOrder(item) }}
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
                className={`flex items-center space-x-2 ${selectedCategory.name === category.name
                  ? "bg-orange-400 text-white"
                  : "bg-blue-400 text-white border-0"
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
          <>
            <div className="flex gap-3 relative">
              <div className="relative cursor-pointer" onClick={() => setNewNotification(false)}>
                <Bell className="w-6 h-6" />
                {newNotification && (
                  <div className="bg-red-600 w-2 h-2 rounded-full absolute top-0.5 left-4" />
                )}
              </div>
              <Button>
                <ShoppingCart />
                <span className="ml-2">{generateCartCount()} items</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="justify-start bg-orange-600 hover:bg-orange-400 text-blue-50"
              >
                Logout
              </Button>
            </div>
          </>

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


export default MapComponent;
