import React from "react";

interface CursorBadgeProps {
  color: string;
  text: string;
  rotation?: number;
  sharpEdge?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function CursorBadge({
  color = "#C3F53C",
  text = "DiraSignature",
  rotation = 90,
  sharpEdge = "top-right",
}: CursorBadgeProps) {
  const styles = {
    "top-right": {
      radius: "rounded-l-full rounded-tr-2xl rounded-br-full",
      cursor: "-top-6 -right-6",
      padding: "pl-4 pr-6 py-2",
    },
    "top-left": {
      radius: "rounded-r-full rounded-tl-2xl rounded-bl-full",
      cursor: "-top-6 -left-6",
      padding: "pl-4 pr-6 py-2",
    },
    "bottom-right": {
      radius: "rounded-l-full rounded-r-2xl",
      cursor: "-bottom-3 -right-3",
      padding: "pl-6 pr-8 py-3",
    },
    "bottom-left": {
      radius: "rounded-r-full rounded-l-2xl",
      cursor: "-bottom-3 -left-3",
      padding: "pl-8 pr-6 py-3",
    },
  };

  const config = styles[sharpEdge];

  return (
    <div className="relative inline-flex group">
      <div
        className={`${config.padding} ${config.radius} text-black font-medium text-lg shadow-sm select-none transition-all`}
        style={{ backgroundColor: color }}
      >
        {text}
      </div>
      <div className={`absolute ${config.cursor} drop-shadow-md`}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <path
            d="M3 3L10.5 21.5L13.5 13.5L21.5 10.5L3 3Z"
            fill="black"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
