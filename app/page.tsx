"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "./Components/Navbar";
import Temperature from "./Components/Temperature/Temperature";
import FiveDayForecast from "./Components/FiveDayForecast/FiveDayForecast";
import AirPollution from "./Components/AirPollution/AirPollution";
import DailyForecast from "./Components/DailyForecast/DailyForecast";
import FeelsLike from "./Components/FeelsLike/FeelsLike";
import Humidity from "./Components/Humidity/Humidity";
import Population from "./Components/Population/Population";
import Pressure from "./Components/Pressure/Pressure";
import Sunset from "./Components/Sunset/Sunset";
import UvIndex from "./Components/UvIndex/UvIndex";
import Visibility from "./Components/Visibility/Visibility";
import Wind from "./Components/Wind/Wind";
import defaultStates from "./utils/defaultStates";
import { useGlobalContextUpdate } from "./context/globalContext";

// Import Mapbox dynamically to prevent SSR errors
const Mapbox = dynamic(() => import("./Components/Mapbox/Mapbox"), { ssr: false });

export default function Home() {
  const { setActiveCityCoords } = useGlobalContextUpdate() || {};
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(null);

  // Fetch weather data when the page loads
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const res = await fetch("/api/weather"); // Update with the correct API endpoint
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setForecast(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, []);

  // Handle city selection & scrolling
  const getClickedCityCords = (lat: number, lon: number) => {
    if (!setActiveCityCoords) return;
    setActiveCityCoords([lat, lon]);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="mx-[1rem] lg:mx-[2rem] xl:mx-[6rem] 2xl:mx-[16rem] m-auto">
      <Navbar />
      <div className="pb-4 flex flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-4 w-full min-w-[18rem] md:w-[35rem]">
          {loading ? <p>Loading temperature...</p> : <Temperature />}
          {loading ? <p>Loading forecast...</p> : <FiveDayForecast />}
        </div>
        <div className="flex flex-col w-full">
          <div className="instruments grid h-full gap-4 col-span-full sm-2:col-span-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? <p>Loading air pollution...</p> : <AirPollution />}
            {loading ? <p>Loading sunset...</p> : <Sunset />}
            {loading ? <p>Loading wind data...</p> : <Wind />}
            {loading ? <p>Loading daily forecast...</p> : <DailyForecast />}
            {loading ? <p>Loading UV index...</p> : <UvIndex />}
            {loading ? <p>Loading population data...</p> : <Population />}
            {loading ? <p>Loading feels-like temperature...</p> : <FeelsLike />}
            {loading ? <p>Loading humidity...</p> : <Humidity />}
            {loading ? <p>Loading visibility...</p> : <Visibility />}
            {loading ? <p>Loading pressure...</p> : <Pressure />}
          </div>
          <div className="mapbox-con mt-4 flex gap-4">
            <Mapbox />
            <div className="states flex flex-col gap-3 flex-1">
              <h2 className="flex items-center gap-2 font-medium">Top Large Cities</h2>
              <div className="flex flex-col gap-4">
                {defaultStates.map((state, index) => (
                  <div
                    key={index}
                    className="border rounded-lg cursor-pointer dark:bg-dark-grey shadow-sm dark:shadow-none"
                    onClick={() => getClickedCityCords(state.lat, state.lon)}
                  >
                    <p className="px-6 py-4">{state.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-4 flex justify-center pb-8">
        <p className="footer-text text-sm flex items-center gap-1">
          Made by <span className="animate-pulse">💻</span> with ❤️ and ☕️ by
          <a href="https://github.com/deva016" target="_blank" className="text-green-300 font-bold">
            Deveshwar
          </a>
        </p>
      </footer>
    </main>
  );
}
