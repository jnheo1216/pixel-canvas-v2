"use client";
import React from "react";

import { PIXEL_SIZE } from "@/const";
import { ControllerProvider } from "@/context/controllerContext";

import { DrawingLayer } from "@/components/layer/DrawingLayer";
import { ColorPick } from "@/components/controller/ColorPick";
import { AvailableClickRatioSlider } from "@/components/controller/AvailableClickRatioSlider";

/** canvas set component */
export default function WorkSpace({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  /** checkered background style */
  const checkeredBgStyle = {
    width: `${width * PIXEL_SIZE}px`,
    height: `${height * PIXEL_SIZE}px`,
    backgroundImage: `
    linear-gradient(90deg, rgba(0, 0, 0, 0.3) 1px, transparent 0),
    linear-gradient(rgba(0, 0, 0, 0.3) 1px, transparent 0)
  `,
    backgroundSize: "10px 10px",
  };

  return (
    <ControllerProvider>
      <section className="flex items-center justify-evenly p-24">
        <ColorPick />
        <DrawingLayer
          width={width}
          height={height}
          checkeredBgStyle={checkeredBgStyle}
        />
      </section>
      <AvailableClickRatioSlider />
    </ControllerProvider>
  );
}
