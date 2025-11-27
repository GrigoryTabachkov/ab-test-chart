import { useRef, useEffect, useState } from 'react';

export const useZoom = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const relativePos = mouseX / rect.width;

      const delta = e.deltaY < 0 ? 1.12 : 0.89;
      const newZoom = Math.max(1, Math.min(20, zoomLevel * delta));

      const zoomChange = newZoom - zoomLevel;
      const offsetChange = relativePos * rect.width * (zoomChange / newZoom);

      setZoomLevel(newZoom);
      setPanOffset(prev => prev + offsetChange);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [zoomLevel]);

  const reset = () => {
    setZoomLevel(1);
    setPanOffset(0);
  };

  return { containerRef, zoomLevel, panOffset, reset };
};
