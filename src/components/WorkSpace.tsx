"use client";
import React, { useState } from "react";

import { ControllerProvider } from "@/context/controllerContext";

import { DrawingLayer } from "@/components/layer/DrawingLayer";
import { ColorPick } from "@/components/controller/ColorPick";
import { AvailableClickRatioSlider } from "@/components/controller/AvailableClickRatioSlider";

/** canvas set component */
export default function WorkSpace() {
  return (
    <ControllerProvider>
      <section className="flex items-center justify-evenly p-24">
        <ColorPick />
        <DrawingLayer />
      </section>
      <AvailableClickRatioSlider />
    </ControllerProvider>
  );
}
