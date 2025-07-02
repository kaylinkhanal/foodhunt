"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import L from "leaflet";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "./ui/input";
import { logoutUser } from "@/redux/reducerSlices/userSlice";
import { useDispatch, useSelector } from "react-redux";

interface MapProps {
  position: [number, number]; // [latitude, longitude]
  zoom?: number;
}

const burgerLists = [
  {
    emoji: "🍔",
    name: "S Café Tinkune",
    startingPrice: 300,
    maxDiscount: 90,
    coordinates: [27.686, 85.3503],
  },
  {
    emoji: "🍔",
    name: "AT Burger",
    startingPrice: 150,
    maxDiscount: 50,
    coordinates: [27.702, 85.326],
  },
  {
    emoji: "🍔",
    name: "The Burger House & Crunchy Fried Chicken",
    startingPrice: 301,
    maxDiscount: 90,
    coordinates: [27.6925, 85.334],
  },
];

const createEmojiIcon = (item) => {
  return L.divIcon({
    html: `<div>
      <div style="font-size: 48px; text-align: center; line-height: 1;">${item.emoji}</div>
      <div style="width:120px; font-size:32px; color: #e69500; font-weight: 800">
       ${item.maxDiscount} % OFF
      </div>
      <div style="width:120px; font-weight: 800">
        Starting Price:${item.startingPrice}
      </div>
    </div>`,
    className: "custom-emoji-icon",
    iconSize: [60, 60],
    iconAnchor: [15, 30],
    popupAnchor: [0, -25],
  });
};

const MapComponent: React.FC<MapProps> = ({ position, zoom = 13 }) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch()
  const {isLoggedIn} = useSelector(state=>state.user)
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
    {
      name: "Spicy Chicken Burger 🌶️🐔🍔",
      price: 11.75,
      discounted_price: 10.25,
      quantity: 0,
    },
    {
      name: "Veggie Burger 🌱🍔",
      price: 9.99,
      discounted_price: 8.75,
      quantity: 0,
    },
  ]);

  const handleIncrease = (burger) => {
    setBurgerType((prev) =>
      prev.map((item) =>
        item.name === burger.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrease = (burger) => {
    setBurgerType((prev) =>
      prev.map((item) =>
        item.name === burger.name
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
    );
  };

  const totalPrice = burgerType.reduce(
    (sum, item) => sum + item.discounted_price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    setBurgerType((prev) =>
      prev.map((item) => ({ ...item, quantity: 0 }))
    );
    setShow(false);
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <div className="absolute top-4 left-4 z-999">
      <Input type="Search" placeholder="Search offers for your meal" />
      </div>
      <div className="absolute top-4 right-4 z-999">
      { isLoggedIn ?(      <DropdownMenu >
        <DropdownMenuTrigger>
        <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>


        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-999">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem onClick={()=> dispatch(logoutUser())}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
              ): <div>login and register button</div>}
      </div>
     
      {burgerLists.map((item) => {
        const customIcon = createEmojiIcon(item);

        return (
          <Marker position={item.coordinates} icon={customIcon} key={item.name}>
            <Popup maxWidth={300}>
              <b>{item.name}</b>
              <br />
              {item.emoji} Yummy!
              <Button
                className="ml-2"
                style={{
                  backgroundColor: show ? "#FAA617" : "#C04430",
                  color: "white",
                }}
                onClick={() => setShow(!show)}
              >
                {show ? "Hide Items" : "Show Items"}
              </Button>
              {show && (
                <div>
                  {burgerType.map((burger, index) => (
                    <Card
                      key={index}
                      className="py-2 my-2 w-full bg-white shadow-lg border border-gray-200"
                    >
                      <CardContent className="py-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-bold text-gray-800 flex-1">
                            {burger.name}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between mb-1">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 line-through">
                              रु {burger.price.toFixed(2)}
                            </span>
                            <span
                              className="text-lg font-bold"
                              style={{ color: "#FAA617" }}
                            >
                              रु {burger.discounted_price.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDecrease(burger)}
                              disabled={burger.quantity === 0}
                              style={{
                                borderColor: "#FAA617",
                                color: "#FAA617",
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="min-w-[2rem] text-center font-semibold text-lg">
                              {burger.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleIncrease(burger)}
                              style={{
                                borderColor: "#FAA617",
                                color: "#FAA617",
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {burger.quantity > 0 && (
                          <div className="text-right text-xs text-gray-600">
                            Subtotal:{" "}
                            <span className="font-semibold" style={{ color: "#FAA617" }}>
                              रु {(
                                burger.discounted_price * burger.quantity
                              ).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

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
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>
                </div>
              )}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
