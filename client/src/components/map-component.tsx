// components/MapComponent.tsx
"use client"; // This line is crucial for client-side rendering

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility"; // Important for default icons
import L from "leaflet"
interface MapProps {
  position: [number, number]; // [latitude, longitude]
  zoom?: number;
}

const burgerLists = [
    {
      "emoji": "🍔",
      "name": "S Café Tinkune",
      "coordinates": [27.6860, 85.3503]
    },
    {
      "emoji": "🍔",
      "name": "AT Burger",
      "coordinates": [27.7020, 85.3260]
    },
    {
      "emoji": "🍔",
      "name": "The Burger House & Crunchy Fried Chicken",
      "coordinates": [27.6925, 85.3340]
    }
  ]

  const createEmojiIcon = (emoji, name) => {
    return L.divIcon({
      html: `<div>
      <div style="font-size: 72px; text-align: center; line-height: 1;">${emoji}
      </div>
        <div style="width:120px; font-weight: 800">
          price: Rs. 500
        </div>
               <div style="width:120px; font-weight: 800">
        ${name}
        </div>
      </div>`,
      className: 'custom-emoji-icon', // Add a class for styling (optional)
      iconSize: [60, 60], // Adjust size as needed
      iconAnchor: [15, 30], // Point of the icon which corresponds to marker's location
      popupAnchor: [0, -25] // Point from which the popup should open relative to the iconAnchor
    });
  };
const MapComponent: React.FC<MapProps> = ({ position, zoom = 13 }) => {
    
  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }} // Ensure the map has a height and width
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {burgerLists.map((item)=>{
                const customIcon = createEmojiIcon(item.emoji, item.name);

        return (
            <Marker position={item.coordinates} icon={customIcon} key={item.name}>
            <Popup>
              <b>{item.name}</b>
              <br />
              {item.emoji} Yummy!
            </Popup>
          </Marker>
        )
      })}
     
    </MapContainer>
  );
};

export default MapComponent;