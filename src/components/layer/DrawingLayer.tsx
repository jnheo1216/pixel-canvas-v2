"use client";
import React, { useRef, useEffect, useState } from "react";
import { PIXEL_SIZE } from "@/const";

type Grid = string[][];

const getWH = () => {
  const url = new URL(window.location.href);
  const width = url.searchParams.get("width");
  const height = url.searchParams.get("height");
  return {
    width: width ? parseInt(width) : 10,
    height: height ? parseInt(height) : 10,
  };
};

const createGrid = (width: number, height: number): Grid => {
  const grid: Grid = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push("");
    }
    grid.push(row);
  }
  return grid;
};

function renderCanvas(
  ctx: CanvasRenderingContext2D | null | undefined,
  canvasWidth: number,
  canvasHeight: number,
  array: string[][]
) {
  if (!ctx) {
    return;
  }
  const rectWidth = canvasWidth / array.length;
  const rectHeight = canvasHeight / array[0].length;

  array.forEach((row, i) => {
    row.forEach((value, j) => {
      if (!value) {
        return;
      }
      ctx.fillStyle = value;
      ctx.fillRect(j * rectWidth, i * rectHeight, rectWidth, rectHeight);
    });
  });
}

const checkeredBgStyle = {
  width: `${getWH().width * PIXEL_SIZE}px`,
  height: `${getWH().height * PIXEL_SIZE}px`,
  backgroundImage: `
    linear-gradient(90deg, rgba(0, 0, 0, 0.3) 1px, transparent 0),
    linear-gradient(rgba(0, 0, 0, 0.3) 1px, transparent 0)
  `,
  backgroundSize: "10px 10px",
};

/** Layer Component */
export function DrawingLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<Grid>(
    createGrid(getWH().width * PIXEL_SIZE, getWH().height * PIXEL_SIZE)
  );

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d", {
      willReadFrequently: true,
    });
    renderCanvas(
      context,
      getWH().width * PIXEL_SIZE,
      getWH().height * PIXEL_SIZE,
      grid
    );
  }, []);

  return (
    <div className="relative flex place-items-center">
      <div
        style={checkeredBgStyle}
        className={`absolute top-0 left-0 w-${PIXEL_SIZE * getWH().width} h-${
          PIXEL_SIZE * getWH().height
        } z-10`}
      ></div>
      <canvas
        ref={canvasRef}
        className="bg-transparent outline-dotted z-20"
        width={getWH().width * PIXEL_SIZE}
        height={getWH().height * PIXEL_SIZE}
      />
    </div>
  );
}
