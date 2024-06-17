"use client";
import React, { useState } from "react";

import { COLOR_SET } from "@/const";
import { useController } from "@/context/controllerContext";

/** Layer Component */
export function ColorPick() {
  const { color, setColor } = useController();

  /** selected index */
  const [selectedIndex, setSelectedIndex] = useState<number>(7);

  /** color pick handler */
  const handleColorClick = (index: number, colorCode: string) => {
    setColor(colorCode);
    setSelectedIndex(index);
  };

  // TODO: user can change another color set
  // TODO: user can add another color set
  return (
    <div>
      <div className="w-10 h-10 m-5" style={{ backgroundColor: color }}></div>
      <div className="grid grid-cols-2">
        {Object.entries(COLOR_SET).map(([key, value], index) => (
          <div
            key={key}
            title={key}
            onClick={() => handleColorClick(index, value)}
            className={`w-10 h-10 border-dashed border-black ${
              index === selectedIndex ? "border-2" : "border-0"
            }`}
            style={{ backgroundColor: value }}
          ></div>
        ))}
      </div>
    </div>
  );
}
