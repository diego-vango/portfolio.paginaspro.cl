import React from "react";

interface TrinoLogoProps {
  className?: string;
  height?: number;
  color?: string;
}

export default function TrinoLogo({
  className = "",
  height = 36,
  color = "#FFFFFF",
}: TrinoLogoProps) {
  // Calculated scale based on height.
  // Original designed viewBox width is ~120, height is ~35.
  const width = (height * 120) / 35;

  return (
    <svg
      viewBox="0 0 120 35"
      style={{ height, width }}
      className={`inline-block ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* T */}
      <path
        d="M 5 6 L 25 6 M 15 6 L 15 30"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* R */}
      <path
        d="M 29 30 L 29 6 C 29 6, 42 3, 42 16 C 42 22, 34 23, 29 23 M 36 21 L 44 30"
        stroke={color}
        strokeWidth="6.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* I */}
      <line
        x1="52"
        y1="6"
        x2="52"
        y2="30"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="square"
      />
      {/* N */}
      <path
        d="M 61 30 L 61 7 C 61 7, 61 24, 76 21 L 76 30"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* O */}
      <rect
        x="84"
        y="6"
        width="21"
        height="24"
        rx="10.5"
        stroke={color}
        strokeWidth="6"
        fill="none"
      />
    </svg>
  );
}
