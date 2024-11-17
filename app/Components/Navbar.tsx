"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { github } from "../utils/Icons";
import ThemeDropdown from "./ThemeDropdown/ThemeDropdown";
import SearchDialog from "./SearchDialog/SearchDialog";
import { useGlobalContext } from "../context/globalContext";

function Navbar() {
  const router = useRouter();
  const { state, toggleMode } = useGlobalContext();

  return (
    <div className="w-full py-4 flex items-center justify-between">
      <div className="left flex items-center gap-2">
        <SearchDialog />
      </div>
      <div className="btn-group flex items-center gap-2">
        <ThemeDropdown />
        <Button
          className="source-code-btn flex items-center gap-2"
          onClick={() => {
            router.push("https://github.com/deva016/My_weather_app");
          }}
        >
          {github} Source Code
        </Button>
      </div>
    </div>
  );
}

export default Navbar;
