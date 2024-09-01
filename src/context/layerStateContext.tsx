import React, { createContext, useState, useContext } from "react";

type Layer = {
  zIndex: number;
  imageData: string[][];
};

type ImageLayerData = Layer[];

interface layerStateContextProps {
  imageLayerData: ImageLayerData[];
  setImageLayerData: React.Dispatch<React.SetStateAction<ImageLayerData[]>>;
}

const LayerStateContext = createContext<layerStateContextProps>({
  imageLayerData: [],
  setImageLayerData: () => {},
});

export const LayerStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [imageLayerData, setImageLayerData] = useState<ImageLayerData[]>([]);

  return (
    <LayerStateContext.Provider value={{ imageLayerData, setImageLayerData }}>
      {children}
    </LayerStateContext.Provider>
  );
};

export const useImageState = (): layerStateContextProps => {
  const context = useContext(LayerStateContext);
  if (!context) {
    throw new Error("useIamgeState must be used within a LayerStateContext");
  }
  return context;
};

const testImageLayers: ImageLayerData = [
  {
    zIndex: 1,
    imageData: [
      ["#000000", "#000000", "#000000", "#000000"],
      ["#000000", "#000000", "#000000", "#000000"],
      ["#000000", "#000000", "#000000", "#000000"],
      ["#000000", "#000000", "#000000", "#000000"],
    ],
  },
  {
    zIndex: 2,
    imageData: [
      ["#000000", "#000000", "#000000", "#000000"],
      ["#000000", "#000000", "#000000", "#000000"],
      ["#000000", "#000000", "#000000", "#000000"],
      ["#000000", "#000000", "#000000", "#000000"],
    ],
  },
  {
    zIndex: 3,
    imageData: [
      ["#000000", "#000000", "#000000", "#000000"],
      ["#000000", "#000000", "#000000", "#000000"],
      ["#000000", "#000000", "#000000", "#000000"],
      ["#000000", "#000000", "#000000", "#000000"],
    ],
  },
  {
    zIndex: 4,
    imageData: [
      ["#000000", "#000000", "#000000", "#000000"],
      ["#000000", "#000000", "#000000", "#000000"],
      ["#000000", "#000000", "#000000", "#000000"],
      ["#000000", "#000000", "#000000", "#000000"],
    ],
  },
];

// {
//   testImageLayers.map((layer, index) => {
//     return (
//       <div key={index}>
//         <SomeImageDraw zIndex={layer.zIndex} imageData={layer.imageData} />
//       </div>
//     );
//   });
// }
