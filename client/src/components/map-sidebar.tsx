import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, X, Heart, UserCog, Clock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  foodCategories: {
    name: string;
    emoji: string;
    locations: { name: string; coordinates: [number, number] }[];
  }[];
  selectedCategory: {
    name: string;
    emoji: string;
    locations: { name: string; coordinates: [number, number] }[];
  };
  onCategoryClick: (category: {
    name: string;
    emoji: string;
    locations: { name: string; coordinates: [number, number] }[];
  }) => void;
}

const MapSidebar: React.FC<SidebarProps> = ({
  foodCategories,
  onCategoryClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLocationClick = (coordinates) => {};

  const handleFavoriteFoods = () => {
    console.log("Show Your Favorite Foods");
  };

  const handleRecentSearches = () => {
    console.log("Show Recent Searches");
  };

  return (
    <>
      {/* Mini Sidebar */}
      <motion.div 
        initial={{ x: 0 }}
        className="fixed top-0 left-0 w-[80px] h-full bg-gradient-to-b from-[#f85000] to-[#d74000] flex flex-col justify-start items-center z-[1002] p-4 shadow-lg"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
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

      {/* Large Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-[300px] h-full bg-white shadow-2xl z-[1003]"
          >
            <Card className="h-full border-none bg-gradient-to-br from-gray-50 to-gray-100">
              <CardHeader className="flex flex-row justify-between items-center p-6 border-b border-gray-200">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f85000] to-[#d74000]">
                  Food Hunt
                </CardTitle>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    className="text-[#f85000] hover:bg-[#f85000]/10 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
                <ScrollArea className="h-[calc(100vh-200px)] w-full pr-4">
                  <div className="space-y-2">
                    {foodCategories.map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left py-3 px-4 rounded-lg hover:bg-[#f85000]/10 text-gray-800 hover:text-[#f85000] transition-all duration-300"
                          onClick={() => {
                            onCategoryClick(item);
                            setIsOpen(false);
                          }}
                        >
                          <span className="mr-3 text-lg">{item.emoji}</span>
                          <span className="font-medium">{item.name}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MapSidebar;