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
import { Input } from "./ui/input";

interface MapProps {
  position: [number, number]; // [latitude, longitude]
  zoom?: number;
}

const burgerLists = [
  {
    emoji: "🍔",
    name: "S Café Tinkune",
    coordinates: [27.686, 85.3503],
  },
  {
    emoji: "🍔",
    name: "AT Burger",
    coordinates: [27.702, 85.326],
  },
  {
    emoji: "🍔",
    name: "The Burger House & Crunchy Fried Chicken",
    coordinates: [27.6925, 85.334],
  },
];

const createEmojiIcon = (emoji, name) => {
  return L.divIcon({
    html: `<div>
      <div style="font-size: 48px; text-align: center; line-height: 1;">${emoji}</div>
      <div style="width:120px; font-weight: 800">
        price: Rs. 500
      </div>
      <div style="width:120px; font-weight: 800">
        ${name}
      </div>
    </div>`,
    className: "custom-emoji-icon",
    iconSize: [60, 60],
    iconAnchor: [15, 30],
    popupAnchor: [0, -25],
  });
};

const MapComponent: React.FC<MapProps> = ({ position, zoom = 13 }) => {
  const [search, setSearch] = useState('');
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
     
      {burgerLists.map((item) => {
        const customIcon = createEmojiIcon(item.emoji, item.name);

        return (
          <Marker position={item.coordinates} icon={customIcon} key={item.name}>
            <Popup maxWidth={300}>
              <div className="py-1">
                <b>{item.name}</b>
                <br />
                {item.emoji} Yummy!
                <br />
              </div>
              <div className="flex rounded-lg border-[1px]">
                <input placeholder="Search food here..." onChange={(e) => { setSearch(e.target.value) }} className="m-1 p-2 outline-none border-none focus:ring-0 flex-grow" type="text" />
                <Button type="submit" style={{ backgroundColor: '#B7312D' }} className="m-1 p-2 flex-end">Search</Button>
              </div>
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
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
