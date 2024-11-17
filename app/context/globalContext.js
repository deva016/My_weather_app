"use Client";
import axios from "axios";
import React, { useContext, createContext, useState, useEffect } from "react";
import defaultStates from "../utils/defaultStates";

import { debounce } from "lodash";

const GlobalContext = createContext();
const GlobalContextUpdate = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [forecast, setForecast] = useState({});
  const [geoCodedList, setGeoCodedList] = useState(defaultStates);
  const [inputValue, setInputValue] = useState("");

  const [activeCityCoords, setActiveCityCoords] = useState([
    17.3850,  78.4867,
  ]);

  const [airQuality, setAirQuality] = useState({});
  const [fiveDayForecast, setFiveDayForecast] = useState({});
  const [uvIndex, seUvIndex] = useState({});

  const fetchForecast = async (lat, lon) => {
    try {
      const res = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`, {
        timeout: 5000,
        retry: 3,
      });
      setForecast(res.data);
    } catch (error) {
      console.log("Error fetching forecast data: ", error.message);
      setForecast({});
    }
  };

  // Air Quality
  const fetchAirQuality = async (lat, lon) => {
    try {
      const res = await axios.get(`/api/pollution?lat=${lat}&lon=${lon}`, {
        timeout: 5000,
        retry: 3,
      });
      setAirQuality(res.data);
    } catch (error) {
      console.log("Error fetching air quality data: ", error.message);
      setAirQuality({});
    }
  };

  // five day forecast
  const fetchFiveDayForecast = async (lat, lon) => {
    try {
      const res = await axios.get(`/api/fiveday?lat=${lat}&lon=${lon}`);

      setFiveDayForecast(res.data);
    } catch (error) {
      console.log("Error fetching five day forecast data: ", error.message);
    }
  };

  //geocoded list
  const fetchGeoCodedList = async (search) => {
    try {
      const res = await axios.get(`/api/geocoded?search=${search}`);

      setGeoCodedList(res.data);
    } catch (error) {
      console.log("Error fetching geocoded list: ", error.message);
    }
  };

  //fetch uv data
  const fetchUvIndex = async (lat, lon) => {
    try {
      const res = await axios.get(`/api/uv?lat=${lat}&lon=${lon}`);

      seUvIndex(res.data);
    } catch (error) {
      console.error("Error fetching the forecast:", error);
    }
  };

  // handle input
  const handleInput = (e) => {
    setInputValue(e.target.value);

    if (e.target.value === "") {
      setGeoCodedList(defaultStates);
    }
  };

  // debounce function
  useEffect(() => {
    const debouncedFetch = debounce((search) => {
      fetchGeoCodedList(search);
    }, 500);

    if (inputValue) {
      debouncedFetch(inputValue);
    }

    // cleanup
    return () => debouncedFetch.cancel();
  }, [inputValue]);

  useEffect(() => {
    getUserLocation();
  }, []);

  const fetchData = async () => {
    const retryCount = 3;
    const delay = 1000;

    for (let i = 0; i < retryCount; i++) {
      try {
        await fetchForecast(activeCityCoords[0], activeCityCoords[1]);
        await new Promise(resolve => setTimeout(resolve, delay));
        await fetchAirQuality(activeCityCoords[0], activeCityCoords[1]);
        await new Promise(resolve => setTimeout(resolve, delay));
        await fetchFiveDayForecast(activeCityCoords[0], activeCityCoords[1]);
        await new Promise(resolve => setTimeout(resolve, delay));
        await fetchUvIndex(activeCityCoords[0], activeCityCoords[1]);
        break; // If successful, exit the retry loop
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i === retryCount - 1) throw error; // Throw error on last attempt
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCityCoords]);

  // Add new function to get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setActiveCityCoords([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default location (Hyderabad)
          setActiveCityCoords([17.3850, 78.4867]);
        },
        { 
          timeout: 5000,
          maximumAge: 0,
          enableHighAccuracy: true 
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setActiveCityCoords([17.3850, 78.4867]);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        forecast,
        airQuality,
        fiveDayForecast,
        uvIndex,
        geoCodedList,
        inputValue,
        handleInput,
        setActiveCityCoords,
        getUserLocation,
      }}
    >
      <GlobalContextUpdate.Provider
        value={{
          setActiveCityCoords,
        }}
      >
        {children}
      </GlobalContextUpdate.Provider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
export const useGlobalContextUpdate = () => useContext(GlobalContextUpdate);
