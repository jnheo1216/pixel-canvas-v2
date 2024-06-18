"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { PIXEL_SIZE } from "@/const";
import { useController } from "@/context/controllerContext";

type Grid = string[][];
interface Behavior {
  x: number;
  y: number;
  beforeColorCode: string;
}

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

/** pixel painting */
const fillPixel = (
  ctx: CanvasRenderingContext2D,
  pixelScale: number,
  availableClickRatio: number,
  x: number,
  y: number
) => {
  const pixelX = Math.floor(x / pixelScale) * pixelScale;
  const pixelY = Math.floor(y / pixelScale) * pixelScale;
  // TODO: 지우개 기능 추가 필요

  if (
    x - pixelX < pixelScale * availableClickRatio ||
    y - pixelY < pixelScale * availableClickRatio
  )
    return { isDrawed: false, pixelX, pixelY, hexColor: "" };

  const pixelData = ctx.getImageData(x, y, 1, 1).data;
  const hexColor =
    pixelData[3] === 0
      ? ""
      : rgbToHex(pixelData[0], pixelData[1], pixelData[2]);

  ctx.fillRect(pixelX, pixelY, pixelScale, pixelScale);
  return { isDrawed: true, pixelX, pixelY, hexColor };
};

/** get RGB color hexcode */
const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/** stack log */
const stackDrawLog = (
  pixelX: number,
  pixelY: number,
  hexColor: string,
  recentPixel: Behavior[],
  setLog: React.Dispatch<React.SetStateAction<Behavior[]>>
) => {
  if (recentPixel.length < 1) {
    setLog([{ x: pixelX, y: pixelY, beforeColorCode: hexColor }]);
    return;
  }
  if (
    recentPixel[recentPixel.length - 1].x === pixelX &&
    recentPixel[recentPixel.length - 1].y === pixelY
  ) {
    return;
  }
  // TODO: log counts need limit
  setLog((prevItems) => [
    ...prevItems,
    { x: pixelX, y: pixelY, beforeColorCode: hexColor },
  ]);
};

/** handle pixel when undo & redo */
const handlePixelBehaivior = (
  context: CanvasRenderingContext2D,
  inputPixelList?: Behavior[],
  handleGrid?: (x: number, y: number, color: string) => void
) => {
  const pixelList: Behavior[] = [];
  inputPixelList?.map((element) => {
    if (element) {
      context.fillStyle = element.beforeColorCode;
      const pixelColorData = context.getImageData(
        element.x,
        element.y,
        1,
        1
      ).data;
      const hexColor =
        pixelColorData[3] === 0
          ? ""
          : rgbToHex(pixelColorData[0], pixelColorData[1], pixelColorData[2]);
      if (element.beforeColorCode) {
        context.fillRect(element.x, element.y, PIXEL_SIZE, PIXEL_SIZE);
        handleGrid && handleGrid(element.x, element.y, element.beforeColorCode);
      } else {
        context.clearRect(element.x, element.y, PIXEL_SIZE, PIXEL_SIZE);
        handleGrid && handleGrid(element.x, element.y, "");
      }
      pixelList.push({ ...element, beforeColorCode: hexColor });
    }
  });
  return pixelList;
};

/** checkered background style */
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
  const { color, availableClickRatio } = useController();
  const context = canvasRef.current?.getContext("2d", {
    willReadFrequently: true,
  });
  const rect = canvasRef.current?.getBoundingClientRect();

  const [grid, setGrid] = useState<Grid>(
    createGrid(getWH().width, getWH().height)
  );

  const updateGrid = useCallback(
    (pixelX: number, pixelY: number, color: string) => {
      const newGrid = [...grid];
      newGrid[Math.floor(pixelY / PIXEL_SIZE)][
        Math.floor(pixelX / PIXEL_SIZE)
      ] = color;
      setGrid(newGrid);
    },
    [grid]
  );

  const [behaivior, setBehaivior] = useState<Behavior[]>([]);
  const [beforeLogs, setBeforeLogs] = useState<Behavior[][]>([]);
  const [redo, setRedo] = useState<Behavior[][]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const handleCanvasPenOn = () => {
    setIsDrawing(true);
  };

  const handleCanvasPenOff = () => {
    setIsDrawing(false);
  };

  const handleCanvasDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !rect) return;

    context.fillStyle = color;
    const { isDrawed, pixelX, pixelY, hexColor } = fillPixel(
      context,
      PIXEL_SIZE,
      availableClickRatio,
      event.clientX - rect.left,
      event.clientY - rect.top
    );
    if (isDrawed) {
      stackDrawLog(pixelX, pixelY, hexColor, behaivior, setBehaivior);
      updateGrid(pixelX, pixelY, color);
      setRedo([]);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !rect) return;

    context.fillStyle = color;
    const { isDrawed, pixelX, pixelY, hexColor } = fillPixel(
      context,
      PIXEL_SIZE,
      availableClickRatio,
      event.clientX - rect.left,
      event.clientY - rect.top
    );
    if (isDrawed) {
      stackDrawLog(pixelX, pixelY, hexColor, behaivior, setBehaivior);
      updateGrid(pixelX, pixelY, color);
      setRedo([]);
    }
  };

  const handleDrawEnd = () => {
    setBeforeLogs([...beforeLogs, behaivior]);
    setBehaivior([]);
  };

  const handleUndo = useCallback(() => {
    if (!context) return;

    const beforeLogList = [...beforeLogs];
    if (beforeLogList.length >= 1) {
      const pixelList = handlePixelBehaivior(
        context,
        beforeLogList.pop(),
        updateGrid
      );
      pixelList && setRedo([...redo, pixelList]);
      setBeforeLogs(beforeLogList);
    }
  }, [beforeLogs, redo, context, updateGrid]);

  const handleRedo = useCallback(() => {
    if (!context) return;

    const redoList = [...redo];
    if (redoList.length >= 1) {
      const pixelList = handlePixelBehaivior(
        context,
        redoList.pop(),
        updateGrid
      );
      pixelList && setBeforeLogs([...beforeLogs, pixelList]);
      setRedo(redoList);
    }
  }, [beforeLogs, redo, context, updateGrid]);

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

  useEffect(() => {
    const ctrlZ = function (event: KeyboardEvent) {
      if (event.ctrlKey && event.key === "z") {
        handleUndo();
      }
    };

    addEventListener("keydown", ctrlZ);
    return () => removeEventListener("keydown", ctrlZ);
  }, [handleUndo]);

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
        onClick={handleCanvasClick}
        onMouseDown={handleCanvasPenOn}
        onMouseUp={() => {
          handleCanvasPenOff();
          handleDrawEnd();
        }}
        onMouseLeave={handleCanvasPenOff}
        onMouseMove={handleCanvasDrawing}
      />
    </div>
  );
}
