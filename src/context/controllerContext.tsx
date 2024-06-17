import React, { createContext, useState, useContext } from "react";

interface controllerContextProps {
  color: string;
  availableClickRatio: number;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setClickRatio: React.Dispatch<React.SetStateAction<number>>;
}

const ControllerContext = createContext<controllerContextProps>({
  color: "#CECECE",
  availableClickRatio: 0.12,
  setColor: () => {},
  setClickRatio: () => {},
});

export const ControllerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [color, setColor] = useState<string>("#CECECE");
  const [availableClickRatio, setClickRatio] = useState<number>(0.12);

  return (
    <ControllerContext.Provider
      value={{ color, availableClickRatio, setColor, setClickRatio }}
    >
      {children}
    </ControllerContext.Provider>
  );
};

export const useController = (): controllerContextProps => {
  const context = useContext(ControllerContext);
  if (!context) {
    throw new Error("useController must be used within a ColorClickProvider");
  }
  return context;
};
