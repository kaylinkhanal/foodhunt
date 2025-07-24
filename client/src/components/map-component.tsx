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
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import L from "leaflet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState, useRef, useCallback } from "react"; // Import useCallback
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
import { toast } from "sonner";

interface MapProps {
  position: [number, number]; // [latitude, longitude]
  zoom?: number;
}

// Helper function for single emoji markers (used when a specific category is selected)
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
          transform: translate(-50%, -50%) scale(0);
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

// Helper function for multi-product static markers (used on initial load or no category selected)
const createMultiProductIcon = (products, totalProductsAtLocation) => {
  const sortedProducts = [...products].sort((a, b) => b.discountPercentage - a.discountPercentage);
  const productsToShow = sortedProducts.slice(0, 4); // Max 4 products displayed statically
  const remainingProductsCount = totalProductsAtLocation - productsToShow.length;

  // Ensure coordinates are available for click handling on the main circle
  const mainCoords = products[0]?.sellerId?.coords;
  const mainCoordsString = mainCoords ? `${mainCoords.lat},${mainCoords.lng}` : '';

  // Define the fixed angles for 0, 90, 180, 270 degrees
  // In Leaflet, 0 degrees is East (right), 90 degrees is South (down), 180 degrees is West (left), 270 degrees is North (up).
  // The request uses conventional math angles (0 right, 90 up). We'll adjust the display logic accordingly.
  // For display on a circle, 0 is right, 90 is top, 180 is left, 270 is bottom.
  // Let's use standard degrees for positioning: 0 (right), 90 (top), 180 (left), 270 (bottom)
  const fixedAngles = [0, 90, 180, 270]; // In degrees: Right, Top, Left, Bottom

  // Determine the radius for the outer product chips
  const radius = 60; // Adjust this value to control how far out the chips are

  const rotatingItemsHtml = productsToShow
    .map((product, index) => {
      // Use the fixed angle for each of the first four products
      const angle = fixedAngles[index]; // Get the specific angle for this product

      // Calculate X and Y offsets for static positioning around the circle
      // Note: Math.cos/sin expect radians, so convert degrees to radians
      // Y-axis needs to be inverted for screen coordinates if 90deg is "up"
      // If 0deg is Right, 90deg is Top:
      const offsetX = radius * Math.cos(angle * (Math.PI / 180));
      const offsetY = -radius * Math.sin(angle * (Math.PI / 180)); // Invert Y for screen coords if 90 is UP

      const productCoords = product.sellerId?.coords;
      const productCoordsString = productCoords ? `${productCoords.lat},${productCoords.lng}` : '';

      let discountTextStyle = '';
      // Apply specific discount text positioning based on the angle
      // 0 degrees (Right) -> Discount text middle of 0 to 90 (i.e., above and slightly right of icon)
      if (angle === 0) {
        discountTextStyle = `
          position: absolute;
          top: -20px; /* Above the emoji */
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 16px;
          line-height: 1;
        `;
      }
      // 90 degrees (Top) -> Discount text on the top of its icon (i.e., above emoji)
      else if (angle === 90) {
        discountTextStyle = `
          position: absolute;
          top: -20px; /* Above the emoji */
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 16px;
          line-height: 1;
        `;
      }
      // 180 degrees (Left) -> Discount text middle of 90 to 180 (i.e., above and slightly left of icon)
      else if (angle === 180) {
        discountTextStyle = `
          position: absolute;
          top: -20px; /* Above the emoji */
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 16px;
          line-height: 1;
        `;
      }
      // 270 degrees (Bottom) -> Discount text on the bottom of the icon (i.e., below emoji)
      else if (angle === 270) {
        discountTextStyle = `
          position: absolute;
          bottom: -20px; /* Below the emoji */
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 16px;
          line-height: 1;
        `;
      }


      return `
        <div
          class="rotating-item-wrapper"
          style="left: calc(50% + ${offsetX}px); top: calc(50% + ${offsetY}px); transform: translate(-50%, -50%);"
          data-product-id="${product._id}"
          data-coords="${productCoordsString}"
        >
          <div class="product-chip">
            <span class="product-discount" style="${discountTextStyle}">${product.discountPercentage.toFixed(0)}% OFF</span>
            <span class="product-emoji">${product.category?.emoji || '📦'}</span>
          </div>
        </div>
      `;
    })
    .join("");

  // Determine the content for the center circle
  const centerContent = remainingProductsCount > 0
    ? `<div class="more-items-text" data-location-coords="${mainCoordsString}">${remainingProductsCount} more items</div>`
    : `
        <div class="central-location-icon" data-location-coords="${mainCoordsString}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%; color: dodgerblue; filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
        </div>`;

  return L.divIcon({
    html: `
      <div class="multi-marker-container">
        <div class="main-circle">
          ${centerContent}
          <span class="ripple"></span>
        </div>
        <div class="rotating-products-outer-ring">
          ${rotatingItemsHtml}
        </div>
      </div>

      <style>
        .multi-marker-container {
          position: relative;
          width: 150px; /* Adjust size as needed */
          height: 150px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .main-circle {
          position: relative;
          width: 70px;
          height: 70px;
          background: transparent;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          color: white;
          z-index: 10;
          pointer-events: all;
          text-align: center;
        }

        .central-content {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .more-items-text {
          font-size: 14px;
          text-align: center;
          animation: pulse-text 1.5s infinite ease-in-out;
          color: red;
          line-height: 1.2;
          padding: 5px;
        }

        .central-location-icon {
            font-size: 36px;
            line-height: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            pointer-events: all;
        }

        .ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          background:rgb(255, 77, 0);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple-effect 1.2s infinite;
          z-index: -1;
        }
        @keyframes ripple-effect {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(5);
            opacity: 0;
          }
        }

        @keyframes pulse-text {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .rotating-products-outer-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .rotating-item-wrapper {
          position: absolute;
          pointer-events: all;
          cursor: pointer;
        }

        .product-chip {
          background: none;
          border: none;
          border-radius: 10px;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          white-space: nowrap;
          box-shadow: none;
          transition: transform 0.2s ease-in-out;
          filter: drop-shadow(0 0 4px rgba(0,0,0,0.6));
          position: relative; /* Essential for positioning discount text */
        }

        .product-chip:hover {
          transform: scale(1.1);
        }

        .product-emoji {
          font-size: 28px;
          line-height: 1;
        }

        .product-discount {
          font-size: 16px;
          font-weight: bold;
          color: red;
          animation: pop-discount-text 1.5s infinite ease-in-out;
        }

        @keyframes pop-discount-text {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>`,
    className: "custom-multi-product-icon",
    iconSize: [150, 150],
    iconAnchor: [75, 75],
    popupAnchor: [0, -75],
  });
};

// --- NEW COMPONENT: MapContent ---
// This component will live inside MapContainer to access the map context via useMap()
const MapContent = ({
  markersData,
  isCategorySelected,
  productList,
  handleDecrement,
  handleIncrement,
  handlePlaceOrder
}) => {
  // Access the Leaflet map instance here
  const map = useMap();

  // Helper function to generate popup content for a single product
  const generatePopupContent = (item) => {
    // Buttons inside the popup use global window functions to interact with React state
    return `
      <div>
        <div class="py-2 my-2 w-full bg-white shadow-lg border border-gray-200 rounded-lg">
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-bold text-gray-800 flex-1">
                Available <span class="text-white p-1 rounded-sm bg-orange-400">${item.availableQuantity}</span> stocks of ${item.name}
              </h3>
            </div>
            ${item.availableQuantity === 0 ? `<h4 class="text-red-500 mb-2">Item is currently not available</h4>` : ''}
            <div class="flex items-center justify-between mb-2">
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 line-through">
                  रु ${item.originalPrice}
                </span>
                <span
                  class="text-lg font-bold text-orange-500"
                >
                  रु ${item.discountedPrice}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="px-2 py-1 rounded-sm text-sm border border-orange-400 text-orange-400"
                  onclick="window.handleDecrementFromPopup('${item._id}')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg>
                </button>
                <span class="min-w-[2rem] text-center font-semibold text-lg">
                  ${item.quantity}
                </span>
                <button
                  class="px-2 py-1 rounded-sm text-sm border border-orange-400 text-orange-400"
                  onclick="window.handleIncrementFromPopup('${item._id}')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                </button>
              </div>
            </div>
            <div class="mt-2 text-right font-semibold w-full">
              Total:
              <span class="text-orange-500">
                रु ${item.discountedPrice * item.quantity}
              </span>
            </div>
            <button
              class="mt-4 w-full px-4 py-2 rounded-md text-white bg-orange-500 hover:bg-orange-600 ${item.availableQuantity < 1 ? 'opacity-50 cursor-not-allowed' : ''}"
              onclick="window.handlePlaceOrderFromPopup('${item._id}')"
              ${item.availableQuantity < 1 ? 'disabled' : ''}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // Expose these functions globally for popup buttons to call
  useEffect(() => {
    window.handleDecrementFromPopup = (productId) => {
      const item = productList.find(p => p._id === productId);
      if (item) handleDecrement(item);
    };
    window.handleIncrementFromPopup = (productId) => {
      const item = productList.find(p => p._id === productId);
      if (item) handleIncrement(item);
    };
    window.handlePlaceOrderFromPopup = async (productId) => {
      const item = productList.find(p => p._id === productId);
      if (item) await handlePlaceOrder(item);
      if (map.getPopup()) { // Close the current popup after ordering
        map.closePopup();
      }
    };

    // Cleanup global functions when component unmounts or dependencies change
    return () => {
      delete window.handleDecrementFromPopup;
      delete window.handleIncrementFromPopup;
      delete window.handlePlaceOrderFromPopup;
    };
  }, [productList, handleDecrement, handleIncrement, handlePlaceOrder, map]);

  // Use useCallback for stable function references
  const handleProductChipClick = useCallback((event) => {
    event.stopPropagation(); // Prevents map drag/zoom on click
    const productId = event.currentTarget.dataset.productId;
    const coordsString = event.currentTarget.dataset.coords; // Get coordinates from data attribute
    if (!productId || !coordsString) {
      console.error("Missing product ID or coordinates for click handler.", event.currentTarget);
      return;
    }

    const productToOpen = productList.find(p => p._id === productId);

    if (productToOpen) {
      const [latStr, lngStr] = coordsString.split(',');
      const coords = [parseFloat(latStr), parseFloat(lngStr)];

      if (isNaN(coords[0]) || isNaN(coords[1])) {
        console.error("Invalid coordinates for click handler:", coordsString);
        return;
      }

      const popupContent = generatePopupContent(productToOpen);
      // Directly open popup at the specified coordinates
      map.openPopup(popupContent, coords, {
          closeButton: true,
          autoClose: true,
          maxWidth: 300,
          className: 'product-chip-popup'
      });
    } else {
        console.warn("Product not found in productList for productId:", productId);
    }
  }, [productList, map, generatePopupContent]); // Dependencies for useCallback

  const handleCenterCircleClick = useCallback((event) => {
    event.stopPropagation(); // Prevents map drag/zoom on click
    const coordsString = event.currentTarget.dataset.locationCoords;
    if (!coordsString) {
      console.error("Missing location coordinates for center click handler.", event.currentTarget);
      return;
    }

    const [latStr, lngStr] = coordsString.split(',');
    const coords = [parseFloat(latStr), parseFloat(lngStr)];

    if (isNaN(coords[0]) || isNaN(coords[1])) {
      console.error("Invalid coordinates for center click handler:", coordsString);
      return;
    }

    // Find all products associated with these coordinates
    const productsAtLocation = markersData.find(m =>
      m.coords[0] === coords[0] && m.coords[1] === coords[1]
    )?.products || [];

    if (productsAtLocation.length > 0) {
        // Concatenate all product popups into a single scrollable popup
        const allPopupsContent = productsAtLocation.map(product => generatePopupContent(product)).join('');

        map.openPopup(`<div style="max-height: 300px; overflow-y: auto;">${allPopupsContent}</div>`, coords, {
            closeButton: true,
            autoClose: true,
            maxWidth: 300,
            className: 'multiple-products-popup'
        });
    } else {
        console.warn("No products found at location for coordinates:", coords);
    }
  }, [markersData, map, generatePopupContent]); // Dependencies for useCallback


  // --- Event Delegation for dynamic elements ---
  useEffect(() => {
    const mapContainer = map.getContainer(); // Get the root DOM element of the map

    const delegatedClickHandler = (event) => {
        // Check if the click originated from a product chip
        const productChip = event.target.closest('.rotating-item-wrapper');
        if (productChip) {
            // Manually call handleProductChipClick with a simulated event object
            handleProductChipClick({ currentTarget: productChip, stopPropagation: () => event.stopPropagation() });
            return; // Stop here if we handled the click
        }

        // Check if the click originated from the center circle/text/icon
        const centerElement = event.target.closest('.main-circle, .more-items-text, .central-content, .central-location-icon');
        if (centerElement) {
            // Manually call handleCenterCircleClick with a simulated event object
            handleCenterCircleClick({ currentTarget: centerElement, stopPropagation: () => event.stopPropagation() });
            return; // Stop here if we handled the click
        }
    };

    // Attach the single delegated listener to the map container
    if (mapContainer) {
        mapContainer.addEventListener('click', delegatedClickHandler);
    }

    // Cleanup function: Remove the listener when the component unmounts
    return () => {
        if (mapContainer) {
            mapContainer.removeEventListener('click', delegatedClickHandler);
        }
    };
  }, [map, handleProductChipClick, handleCenterCircleClick]); // Depend on map instance and the handlers themselves


  return (
    <>
      {markersData.map((markerGroup, index) => {
        if (!markerGroup.coords[0] || !markerGroup.coords[1])
          return null;

        let customIcon;
        // The condition for displaying custom multi-product icon on first load
        // and single emoji icon when a category is selected.
        if (isCategorySelected) {
          const product = markerGroup.products[0];
          if (!product) return null; // Should not happen if products are grouped by seller
          customIcon = createEmojiIcon(product.category?.emoji, product.discountPercentage);
        } else {
          customIcon = createMultiProductIcon(markerGroup.products, markerGroup.products.length);
        }

        return (
          <Marker
            position={markerGroup.coords}
            icon={customIcon}
            key={`marker-${markerGroup.coords[0]}-${markerGroup.coords[1]}-${index}`}
          >
            {/* Popups are now handled directly by map.openPopup for custom icons */}
          </Marker>
        );
      })}
    </>
  );
};

// --- ORIGINAL MapComponent (now simplified to manage states and render MapContainer) ---
const MapComponent: React.FC<MapProps> = ({ position, zoom = 12 }) => {
  const { _id } = useSelector((state) => state.user);
  const [productList, setProductList] = useState([]);
  const [productsOfSelectedCategory, setProductsOfSelectedCategory] = useState([]);
  const [foodSearch, setFoodSearch] = useState("");
  const userPreferences = useSelector((state) => state.user.userPreferences);
  const [foodCategories, setFoodCategories] = useState([]);

  // State to hold grouped products by seller and their coordinates
  const [markersData, setMarkersData] = useState<{
    coords: [number, number];
    products: any[];
  }[]>([]);

  // State to track if a product chip category has been selected
  const [isCategorySelected, setIsCategorySelected] = useState(false);


  const fetchProducts = async () => {
    const allFetchedProducts = [];

    if (userPreferences && userPreferences.length > 0) {
      for (const item of userPreferences) {
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/products?name=${item}&userId=${_id}`
          );
          allFetchedProducts.push(...data);
        } catch (error) {
          console.error(`Error fetching products for preference ${item}:`, error);
        }
      }
    } else {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );
        allFetchedProducts.push(...data);
      } catch (error) {
        console.error("Error fetching general products (no preferences):", error);
      }
    }

    const reducedArr = allFetchedProducts.map((item) => ({
      ...item,
      quantity: 1,
    }));
    setProductList(reducedArr);

    const groupedByCoords = reducedArr.reduce((acc, product) => {
      const lat = product.sellerId?.coords?.lat;
      const lng = product.sellerId?.coords?.lng;

      if (lat !== undefined && lng !== undefined) {
        const coordKey = `${lat},${lng}`;
        if (!acc[coordKey]) {
          acc[coordKey] = {
            coords: [lat, lng],
            products: [],
          };
        }
        acc[coordKey].products.push(product);
      }
      return acc;
    }, {});

    setMarkersData(Object.values(groupedByCoords));
  };

  const fetchCategories = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`
    );
    setFoodCategories(data);
  };

  const fetchProductChip = async (catId = '') => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/product-chips?categoryId=${catId}`
    );
    setProductsOfSelectedCategory(data);
  };

  const fetchProductsByProductIds = async (ids) => {
    if (!ids || ids.length === 0) {
      setIsCategorySelected(false);
      fetchProducts(); // Revert to initial product fetch if no IDs
      return;
    }

    setIsCategorySelected(true);

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/product-search?productIds=${ids.join(',')}`
    );

    const reducedArr = data.map((item) => {
      item.quantity = 1;
      return item;
    });
    setProductList(reducedArr);

    // Grouping by coordinates again to ensure each seller location is a single marker
    const groupedByCoordsForCategory = reducedArr.reduce((acc, product) => {
      const lat = product.sellerId?.coords?.lat;
      const lng = product.sellerId?.coords?.lng;

      if (lat !== undefined && lng !== undefined) {
        const coordKey = `${lat},${lng}`;
        if (!acc[coordKey]) {
          acc[coordKey] = {
            coords: [lat, lng],
            products: [], // Still an array, though for category it might be 1 product
          };
        }
        acc[coordKey].products.push(product);
      }
      return acc;
    }, {});
    setMarkersData(Object.values(groupedByCoordsForCategory));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchProductChip();
  }, []);


  const { isLoggedIn } = useSelector((state) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const updateProduct = async (item) => {
    const values = {
      availableQuantity: item.availableQuantity - item.quantity,
    };
    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/products/update/${item._id}`, values);
  };

  const handlePlaceOrder = async (item) => {
    const values = {
      bookedById: _id,
      productId: item._id,
      quantity: item.quantity,
      price: item.quantity * item.discountedPrice,
      paymentMethod: 'Cash',
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        values
      );

      toast(response.data.message);
      await updateProduct(item);
    } catch (error) {
      console.error("Failed to place order:", error);
      toast("Failed to place order");
    }
    if (isCategorySelected) {
      fetchProductsByProductIds(selectedCategory?.product_ids);
    } else {
      fetchProducts();
    }
  };

  const handleCategoryClick = (category) => {
    fetchProductsByProductIds(category.product_ids);
    setSelectedCategory(category);
    setIsSearchFocused(false);
  };

  const handleSidebarCategoryClick = (category) => {
    fetchProductChip(category._id);
    setSelectedCategory(null);
    setIsCategorySelected(false);
    fetchProducts(); // Fetch all products again for the "no category selected" view
  }

  const handleDecrement = (clickedItem) => {
    setProductList(prevList =>
      prevList.map(item =>
        item._id === clickedItem._id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleIncrement = (clickedItem) => {
    setProductList(prevList =>
      prevList.map(item =>
        item._id === clickedItem._id && item.quantity < item.availableQuantity
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

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

        {/* Render the new MapContent component here, passing necessary props */}
        <MapContent
          markersData={markersData}
          isCategorySelected={isCategorySelected}
          productList={productList}
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
          handlePlaceOrder={handlePlaceOrder}
        />

      </MapContainer>

      {/* Food Category Chips */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/3 z-[1000] w-[1000px]">
        <ScrollArea className="w-full whitespace-nowrap rounded-full scrollbar-hidden">
          <div className="flex space-x-2 p-2">
            {productsOfSelectedCategory.length > 0 && productsOfSelectedCategory.map((category, index) => (
              <Button
                key={index}
                variant={
                  selectedCategory?.name === category.name
                    ? "default"
                    : "outline"
                }
                className={`flex items-center space-x-2 ${selectedCategory?.name === category.name
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
                variant="ghost"
                className="w-full justify-start text-left mb-1 hover:bg-[#f85000] hover:text-white"
                onClick={() => {
                  fetchProducts();
                  setSelectedCategory(null);
                  setIsCategorySelected(false);
                  setIsSearchFocused(false);
                }}
              >
                Clear Search
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Profile/Auth section */}
      <div className="absolute top-4 right-4 z-[1000]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/orders">My Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            {isLoggedIn ? (
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>
                <Link href="/login">Login</Link>
              </DropdownMenuItem>
              
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MapComponent;