"use client";

import React, { useEffect, useState } from "react";

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isCanvasHover, setIsCanvasHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    document.body.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const isInteractive = target?.closest("button, a, input, [role='button'], .luxury-card-hover, .cursor-pointer");
      const is3D = target?.closest("canvas");

      setIsHovered(!!isInteractive);
      setIsCanvasHover(!!is3D);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300">
      {/* Inner Dot */}
      <div
        className="fixed w-2 h-2 rounded-full bg-burnished-copper shadow-copper-glow transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0) scale(${isHovered ? 0.5 : 1})`,
        }}
      />

      {/* Outer Follower Ring */}
      <div
        className={`fixed rounded-full border transition-all duration-200 ease-out ${
          isCanvasHover
            ? "w-12 h-12 border-burnished-copper/70 bg-burnished-copper/10 scale-125 shadow-copper-glow"
            : isHovered
            ? "w-10 h-10 border-soft-champagne/80 bg-soft-champagne/10 scale-110 shadow-champagne-glow"
            : "w-7 h-7 border-dusty-mauve/40 bg-transparent"
        }`}
        style={{
          transform: `translate3d(${pos.x - (isCanvasHover ? 24 : isHovered ? 20 : 14)}px, ${
            pos.y - (isCanvasHover ? 24 : isHovered ? 20 : 14)
          }px, 0)`,
        }}
      />
    </div>
  );
};