export const getWH = () => {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }
  const url = new URL(window.location.href);
  const width = url.searchParams.get("width");
  const height = url.searchParams.get("height");
  return {
    width: width ? parseInt(width) : 10,
    height: height ? parseInt(height) : 10,
  };
};
