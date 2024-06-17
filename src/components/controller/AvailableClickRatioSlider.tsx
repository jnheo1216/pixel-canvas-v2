"use client";
import React from "react";

import { useController } from "@/context/controllerContext";

/** Layer Component */
export function AvailableClickRatioSlider({}: {}) {
  const { availableClickRatio, setClickRatio } = useController();

  /** ratio change handler */
  const handleRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClickRatio(parseFloat(e.target.value));
  };

  return (
    <div className="flex justify-center">
      <div className="">
        <input
          type="range"
          min="0.02"
          max="0.4"
          step="0.01"
          value={availableClickRatio}
          onChange={handleRatioChange}
          className="slider"
        />
        <div className="text-center">Ratio: {availableClickRatio}</div>
      </div>
    </div>
  );
}
