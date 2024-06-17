"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const router = useRouter();

  const handleSubmit = () => {
    router.push(`/workspace?width=${width}&height=${height}`);
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <label className="text-lg font-bold mb-2">Input width and height</label>
      <input
        type="number"
        className="border p-2 rounded mb-2"
        placeholder="Width"
        value={width}
        onChange={(e) => setWidth(parseInt(e.target.value))}
      />
      <p className="text-lg font-bold mb-2">X</p>
      <input
        type="number"
        className="border p-2 rounded mb-2"
        placeholder="Height"
        value={height}
        onChange={(e) => setHeight(parseInt(e.target.value))}
      />
      <br></br>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </main>
  );
}
