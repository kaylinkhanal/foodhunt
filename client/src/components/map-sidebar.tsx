import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, X, Heart, UserCog, Clock } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  foodCategories: {
    name: string;
    emoji: string;
    locations: { name: string; coordinates: [number, number] }[];
  }[];
  selectedCategory: { name: string; emoji: string; locations: { name: string; coordinates: [number, number] }[] };
  onCategoryClick: (category: { name: string; emoji: string; locations: { name: string; coordinates: [number, number] }[] }) => void;
}

const MapSidebar: React.FC<SidebarProps> = ({ foodCategories, selectedCategory, onCategoryClick,  }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLocationClick = (coordinates) => {
   
  };




  const handleFavoriteFoods = () => {
    console.log("Show Your Favorite Foods");
  };

  const handlePreferences = () => {
   console.log("Show Your Preferences");
  };

  const handleRecentSearches = () => {
    console.log("Show Recent Searches");
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-[80px] h-full bg-[#f85000] gap-8 flex flex-col justify-start items-center z-[1002] p-2">
        <Button
          variant="ghost"
          className="text-white hover:bg-[#d74000] mb-6"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex flex-col items-center mb-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-[#d74000]"
            onClick={handleFavoriteFoods}
          >
            <Heart className="h-6 w-6" />
          </Button>
          <span className="text-white text-sm font-semibold text-center">Your Favorite </span>
        </div>
        <div className="flex flex-col items-center mb-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-[#d74000]"
            onClick={handleRecentSearches}
          >
            <Clock className="h-6 w-6" />
          </Button>
          <span className="text-white text-sm font-semibold text-center">Recent </span>
        </div>
        <div className="flex flex-col items-center mb-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-[#d74000]"
            onClick={handlePreferences}
          >
            <UserCog className="h-6 w-6" />
          </Button>
          <span className="text-white text-sm font-semibold text-center">Your Preferences</span>
        </div>
      </div>

      {/* Large Sidebar */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-[300px] h-full bg-white shadow-xl z-[1003] transition-transform duration-300 ease-in-out transform translate-x-0">
          <Card className="h-full">
            <CardHeader className="flex justify-between items-center p-4 border-b">
              <CardTitle className="text-xl font-bold text-[#f85000]">Food Hunt</CardTitle>
              <Button
                variant="ghost"
                className="text-[#f85000] hover:bg-[#f85000] hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <ScrollArea className="h-[200px] w-full">
                {foodCategories.map((category, index) => (
                  <Button
                    key={index}
                    variant={selectedCategory.name === category.name ? "default" : "ghost"}
                    className={`w-full justify-start text-left mb-1 ${
                      selectedCategory.name === category.name
                        ? "bg-[#f85000] text-white"
                        : "hover:bg-[#f85000] hover:text-white"
                    }`}
                    onClick={() => {
                      onCategoryClick(category);
                      setIsOpen(false); 
                    }}
                  >
                    <span className="mr-2">{category.emoji}</span>
                    <span>{category.name}</span>
                  </Button>
                ))}
              </ScrollArea>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                {selectedCategory.name} Locations
              </h3>
              <ScrollArea className="h-[calc(100vh-300px)] w-full">
                {selectedCategory.locations.map((location, index) => (
                  <div key={index} className="mb-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-[#f85000] hover:text-white"
                      onClick={() => handleLocationClick(location.coordinates)}
                    >
                      <span className="mr-2">{selectedCategory.emoji}</span>
                      <span>{location.name}</span>
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default MapSidebar;