// app/page.tsx
"use client"; // This page also needs to be a client component if it directly uses client-side hooks or components

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function HomePage() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map-component"), {
        loading: () => <p>Map is loading...</p>,
        ssr: false, // This is crucial: disable server-side rendering for the map component
      }),
    []
  );

  const defaultPosition: [number, number] = [27.68592,  85.35032]; // Example coordinates

  return (
    <div style={{ width: "100vw", height: "100vh" }}>

      {" "}

      <Map position={defaultPosition} zoom={14} />
    </div>
  );
}