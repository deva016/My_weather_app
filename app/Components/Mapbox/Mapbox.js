"use client"; // Ensures this component runs only on the client

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGlobalContext } from "@/app/context/globalContext";

function FlyToActiveCity({ activeCityCords }) {
  const map = useMap();

  useEffect(() => {
    if (activeCityCords && map) {
      map.flyTo([activeCityCords.lat, activeCityCords.lon], 13, {
        duration: 1.5,
      });
    }
  }, [activeCityCords, map]);

  return null;
}

function Mapbox() {
  const { forecast } = useGlobalContext();
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
          setLocationError(true);
        }
      );
    } else {
      setLocationError(true);
    }
  }, []);

  const activeCityCords = forecast?.coord || userLocation;

  if (!activeCityCords) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1>{locationError ? "Location Access Denied" : "Loading..."}</h1>
      </div>
    );
  }

  return (
    <div className="flex-1 basis-[50%] border rounded-lg">
      <MapContainer
        center={[activeCityCords.lat, activeCityCords.lon]}
        zoom={13}
        scrollWheelZoom={false}
        className="rounded-lg m-4"
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FlyToActiveCity activeCityCords={activeCityCords} />
      </MapContainer>
    </div>
  );
}

export default Mapbox;
