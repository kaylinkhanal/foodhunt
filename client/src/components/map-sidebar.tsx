"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, X, Heart, UserCog, Clock } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion"; // Added missing import
import OrderDetailPopup from "./order-detail-pop";

interface Category {
  name: string;
  emoji: string;
  locations: { name: string; coordinates: [number, number] }[];
}

interface OrderItem {
  _id?: string;
  productId: {
    name: string;
  };
  description?: string;
  price?: number;
  status?: string;
}

interface SidebarProps {
  foodCategories: Category[];
  selectedCategory: Category;
  onCategoryClick: (category: Category) => void;
}

const MapSidebar: React.FC<SidebarProps> = ({
  foodCategories,
  onCategoryClick,
}) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/orders/"
      );

      if (data && Array.isArray(data.data)) {
        setOrders(data.data);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.warn("Unexpected API response format for orders:", data);
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleFavoriteFoods = () => {
    console.log("Show Your Favorite Foods");
  };

  const handleRecentSearches = () => {
    console.log("Show Recent Searches");
  };

  const statusColorMap: { [key: string]: string } = {
    Pending: "text-gray-400",
    "In Progress": "text-blue-500",
    Completed: "text-green-500",
    Cancelled: "text-red-500",
    Booked: "text-purple-500",
  };

  const [hoveredOrderId, setHoveredOrderId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOrderMouseEnter = (orderId?: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (orderId) {
      setHoveredOrderId(orderId);
    }
  };

  const handleOrderMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredOrderId(null);
    }, 3000);
  };

  const handlePopupMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredOrderId(null);
    }, 3000);
  };

  const handleClosePopup = () => {
    setHoveredOrderId(null);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  return (
    <>
      {/* Mini Sidebar */}
      <motion.div
        initial={{ x: 0 }}
        className="fixed top-0 left-0 w-[80px] h-full bg-gradient-to-b from-[#f85000] to-[#d74000] flex flex-col justify-start items-center z-[1002] p-4 shadow-lg"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-8 transition-colors duration-300"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </motion.div>

        <div className="flex flex-col items-center space-y-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-300"
              onClick={handleFavoriteFoods}
            >
              <Heart className="h-6 w-6" />
            </Button>
            <span className="text-white text-xs font-medium text-center mt-1 tracking-wide">
              Favorites
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-300"
              onClick={handleRecentSearches}
            >
              <Clock className="h-6 w-6" />
            </Button>
            <span className="text-white text-xs font-medium text-center mt-1 tracking-wide">
              Recent
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-300"
              onClick={() => router.push("/user-preferences")}
            >
              <UserCog className="h-6 w-6" />
            </Button>
            <span className="text-white text-xs font-medium text-center mt-1 tracking-wide">
              Preferences
            </span>
          </motion.div>
        </div>
      </motion.div>
      <div className="gap-0">
        {isOpen && (
          <div className="fixed top-0 left-0 w-[300px] h-full bg-white shadow-xl z-[1003] transition-transform duration-300 ease-in-out transform translate-x-0">
            <Card className="h-full flex bg-[#d7ccc7] flex-col">
              <CardHeader className="flex justify-between items-center p-4 border-b">
                <CardTitle className="text-xl font-bold text-[#f85000]">
                  Food Hunt
                </CardTitle>
                <Button
                  variant="ghost"
                  className="text-[#f85000] hover:bg-[#f85000] hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </CardHeader>
              <h3 className="text-lg font-semibold px-4 pt-4 text-gray-800">
                Your Orders
              </h3>
              <ScrollArea className="h-[500px] flex-grow">
                <CardContent className="p-0">
                  {orders.length > 0 ? (
                    orders.map((item) => (
                      <div
                        key={
                          item._id ||
                          `order-${item.productId?.name}-${item.price}`
                        }
                        className="border-b last:border-b-0 cursor-pointer hover:bg-gray-100 transition"
                        onMouseEnter={() => handleOrderMouseEnter(item._id)}
                        onMouseLeave={handleOrderMouseLeave}
                      >
                        <div className="p-4 cursor-pointer hover:bg-gray-100 transition ">
                          <h3 className="text-lg font-semibold mb-2">
                            {item.productId?.name || "Unknown Product"}
                          </h3>
                          <p className="text-gray-600">
                            {item?.description || "No description"}
                          </p>
                          <p
                            className={`${statusColorMap[item?.status || ""]}`}
                          >
                            {item?.status || "No status found"}
                          </p>
                          <p className="text-gray-800 font-bold mt-2">
                            Price: ${item.price?.toFixed(2) || "0.00"}{" "}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-gray-500">No orders to display.</p>
                  )}
                </CardContent>
              </ScrollArea>
              <CardContent className="p-4 hover:bg-[#8a8887] border-t mt-auto flex flex-col overflow-hidden">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Categories
                </h3>
                <ScrollArea className="h-[150px] overflow-y-auto">
                  {foodCategories.map((item, index) => (
                    <Button
                      key={`category-${item.name}-${index}`}
                      onClick={() => {
                        onCategoryClick(item);
                        setIsOpen(false);
                      }}
                      className="w-full justify-start mb-2 hover:bg-gray-100"
                      variant="ghost"
                    >
                      <span className="mr-2 text-xl">{item.emoji}</span>{" "}
                      <span className="text-base">{item.name}</span>
                    </Button>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {hoveredOrderId && (
          <div
            onMouseEnter={handlePopupMouseEnter}
            onMouseLeave={handlePopupMouseLeave}
          >
            <OrderDetailPopup
              orderId={hoveredOrderId}
              onClose={handleClosePopup}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default MapSidebar;