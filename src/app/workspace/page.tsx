"use client";
import { useSearchParams } from "next/navigation";

import WorkSpace from "@/components/WorkSpace";

export default function WorkSpacePage() {
  const searchParams = useSearchParams();
  const width = parseInt(searchParams.get("width") || "10");
  const height = parseInt(searchParams.get("height") || "10");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WorkSpace width={width} height={height} />
    </main>
  );
}
