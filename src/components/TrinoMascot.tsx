import React from "react";

export type MascotMood = "general" | "music" | "cinema" | "theater";

interface TrinoMascotProps {
  mood?: MascotMood;
  className?: string;
  size?: number;
  animated?: boolean;
}

export default function TrinoMascot({
  mood = "general",
  className = "",
  size = 200,
  animated = true,
}: TrinoMascotProps) {
  // Common colors from Trino Brand Guidelines
  const limeColor = "#C2FF01";
  const lilacColor = "#DCB8FE";
  const orangeColor = "#FE4502";
  const midnightColor = "#1B1D21";
  const blueColor = "#0044FD";
  const celesteColor = "#00BBFC";

  // Animation CSS class names
  const bounceClass = animated ? "animate-bounce" : "";
  const swingClass = animated ? "origin-bottom animate-[wiggle_3s_ease-in-out_infinite]" : "";

  // Helper to render the common retro cap
  const renderCap = (capColor: string = limeColor) => (
    <g id="retro-cap" className="origin-[100px_60px]">
      {/* Cap body */}
      <path
        d="M 65 60 C 65 35, 115 35, 115 60 Z"
        fill={capColor}
        stroke={midnightColor}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Visor facing backwards */}
      <path
        d="M 50 62 C 55 58, 70 58, 72 62"
        fill={capColor}
        stroke={midnightColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 45 61 L 65 59"
        stroke={midnightColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Cap button */}
      <circle cx="90" cy="38" r="4.5" fill={midnightColor} />
    </g>
  );

  // Helper to render the pie eyes (retro cartoon style)
  const renderPieEyes = () => (
    <g id="pie-eyes">
      {/* Left Eye */}
      <ellipse cx="112" cy="74" rx="6.5" ry="9.5" fill={midnightColor} />
      <circle cx="114" cy="71" r="2.5" fill="#FFFFFF" />
      
      {/* Right Eye */}
      <ellipse cx="127" cy="74" rx="6.5" ry="9.5" fill={midnightColor} />
      <circle cx="129" cy="71" r="2.5" fill="#FFFFFF" />
    </g>
  );

  // Helper to render beak
  const renderBeak = () => (
    <g id="cute-beak">
      <path
        d="M 118 81 C 118 86, 126 86, 126 81"
        fill={orangeColor}
        stroke={midnightColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Expression line */}
      <path
        d="M 115 80 L 119 80"
        stroke={midnightColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );

  // Helper to render the feet/sneakers
  const renderSneakers = (leftOffset: number = 0, rightOffset: number = 0, isWalking: boolean = false) => (
    <g id="retro-sneakers">
      {/* Left leg & shoe */}
      <line
        x1="92"
        y1="130"
        x2={84 + leftOffset}
        y2="155"
        stroke={midnightColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g transform={`translate(${leftOffset}, 0)`}>
        {/* Left Shoe */}
        <path
          d="M 68 152 C 68 144, 92 144, 92 154 L 92 161 C 92 161, 68 161, 68 161 Z"
          fill="#FFFFFF"
          stroke={midnightColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Sneaker Accent (Lilac) */}
        <path
          d="M 72 153 C 74 148, 86 148, 88 153 Z"
          fill={lilacColor}
          stroke={midnightColor}
          strokeWidth="2"
        />
        {/* Sneaker Sole */}
        <path
          d="M 66 159 L 94 159 C 94 162, 66 162, 66 159 Z"
          fill={midnightColor}
        />
      </g>

      {/* Right leg & shoe */}
      <line
        x1="114"
        y1="130"
        x2={122 + rightOffset}
        y2="155"
        stroke={midnightColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g transform={`translate(${rightOffset}, 0)`}>
        {/* Right Shoe */}
        <path
          d="M 106 152 C 106 144, 130 144, 130 154 L 130 161 C 130 161, 106 161, 106 161 Z"
          fill="#FFFFFF"
          stroke={midnightColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Sneaker Accent (Lilac) */}
        <path
          d="M 110 153 C 112 148, 124 148, 126 153 Z"
          fill={lilacColor}
          stroke={midnightColor}
          strokeWidth="2"
        />
        {/* Sneaker Sole */}
        <path
          d="M 104 159 L 132 159 C 132 162, 104 162, 104 159 Z"
          fill={midnightColor}
        />
      </g>
    </g>
  );

  switch (mood) {
    case "music":
      return (
        <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Music Notes Floating */}
            <path
              d="M 150 40 Q 160 30, 165 40 L 165 55 Q 160 45, 150 50 Z"
              fill={lilacColor}
              stroke={midnightColor}
              strokeWidth="2"
              className="animate-pulse"
            />
            <path
              d="M 30 70 Q 40 60, 45 70 L 45 85 Q 40 75, 30 80 Z"
              fill={celesteColor}
              stroke={midnightColor}
              strokeWidth="2"
              className="animate-bounce"
            />

            {/* Sneakers */}
            {renderSneakers(-2, 4)}

            {/* Bird Body */}
            <g className={bounceClass}>
              {/* Back wing (flapping) */}
              <path
                d="M 68 95 C 45 90, 40 115, 66 110 C 50 115, 55 125, 75 118"
                fill="#FFFFFF"
                stroke={midnightColor}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="origin-[75px_100px] animate-[ping_2s_infinite_alternate]"
              />

              {/* Main plump bird body */}
              <path
                d="M 75 90 C 75 55, 135 55, 135 90 C 135 125, 75 125, 75 90 Z"
                fill="#FFFFFF"
                stroke={midnightColor}
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Backwards cap */}
              {renderCap(limeColor)}

              {/* Eyes */}
              {renderPieEyes()}

              {/* Beak */}
              {renderBeak()}

              {/* Front Wing holding Ukulele/Guitar */}
              <g id="ukulele-guitar" className="origin-[95px_105px] animate-[pulse_1.5s_infinite]">
                {/* Guitar Neck */}
                <rect
                  x="120"
                  y="92"
                  width="45"
                  height="7"
                  rx="2"
                  transform="rotate(-20 120 92)"
                  fill={orangeColor}
                  stroke={midnightColor}
                  strokeWidth="2"
                />
                {/* Guitar Body */}
                <ellipse
                  cx="122"
                  cy="104"
                  rx="15"
                  ry="11"
                  transform="rotate(-20 122 104)"
                  fill={blueColor}
                  stroke={midnightColor}
                  strokeWidth="3"
                />
                <circle cx="122" cy="104" r="4.5" fill={midnightColor} />
                {/* Strings */}
                <line x1="110" y1="102" x2="158" y2="85" stroke="#FFFFFF" strokeWidth="1" />
                <line x1="112" y1="106" x2="160" y2="88" stroke="#FFFFFF" strokeWidth="1" />
              </g>

              {/* Front wing wrapped around guitar */}
              <path
                d="M 98 105 C 105 105, 115 112, 110 120 C 105 125, 95 115, 98 105 Z"
                fill="#FFFFFF"
                stroke={midnightColor}
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      );

    case "cinema":
      return (
        <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Popcorn container icon floating */}
            <g className="animate-bounce">
              <path d="M 160 80 Q 165 75, 170 80" stroke={midnightColor} strokeWidth="2.5" fill={limeColor} />
              <path d="M 152 75 Q 158 72, 162 76" stroke={midnightColor} strokeWidth="2.5" fill="#FFFFFF" />
            </g>

            {/* Sneakers */}
            {renderSneakers(0, 0)}

            {/* Bird Body */}
            <g className={swingClass}>
              {/* Main plump bird body */}
              <path
                d="M 75 90 C 75 55, 135 55, 135 90 C 135 125, 75 125, 75 90 Z"
                fill="#FFFFFF"
                stroke={midnightColor}
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Backwards cap */}
              {renderCap(blueColor)}

              {/* Eyes looking down at popcorn */}
              <g id="pie-eyes-looking-down">
                <ellipse cx="112" cy="76" rx="6.5" ry="9.5" fill={midnightColor} />
                <circle cx="112" cy="78" r="2.5" fill="#FFFFFF" />
                <ellipse cx="127" cy="76" rx="6.5" ry="9.5" fill={midnightColor} />
                <circle cx="127" cy="78" r="2.5" fill="#FFFFFF" />
              </g>

              {/* Beak */}
              {renderBeak()}

              {/* Popcorn Box held in wing */}
              <g id="popcorn-box" transform="translate(112, 95)">
                {/* Box */}
                <path
                  d="M 5 10 L 25 10 L 21 35 L 9 35 Z"
                  fill="#FFFFFF"
                  stroke={midnightColor}
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                {/* Stripes */}
                <line x1="11" y1="10" x2="13" y2="35" stroke={orangeColor} strokeWidth="2.5" />
                <line x1="18" y1="10" x2="16" y2="35" stroke={orangeColor} strokeWidth="2.5" />

                {/* Popcorn bubbles overflowing */}
                <circle cx="9" cy="8" r="5" fill={limeColor} stroke={midnightColor} strokeWidth="2" />
                <circle cx="15" cy="6" r="6" fill="#FFFFFF" stroke={midnightColor} strokeWidth="2" />
                <circle cx="21" cy="8" r="5" fill={limeColor} stroke={midnightColor} strokeWidth="2" />
              </g>

              {/* Front wing holding the popcorn */}
              <path
                d="M 95 110 C 105 110, 118 112, 114 122 C 108 128, 92 120, 95 110 Z"
                fill="#FFFFFF"
                stroke={midnightColor}
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      );

    case "theater":
      return (
        <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Elegant spotlight beam floating in background */}
            <path
              d="M 20 20 L 180 180 L 140 200 L 0 40 Z"
              fill={lilacColor}
              opacity="0.15"
              strokeLinejoin="round"
            />

            {/* Sneakers */}
            {renderSneakers(-3, -1)}

            {/* Bird Body */}
            <g className={bounceClass}>
              {/* Back wing dramatic gesture */}
              <path
                d="M 70 95 C 45 80, 35 105, 68 112"
                fill="#FFFFFF"
                stroke={midnightColor}
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Main plump bird body */}
              <path
                d="M 75 90 C 75 55, 135 55, 135 90 C 135 125, 75 125, 75 90 Z"
                fill="#FFFFFF"
                stroke={midnightColor}
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Backwards cap */}
              {renderCap(orangeColor)}

              {/* Expression Eyes (more dramatic) */}
              <g id="pie-eyes-dramatic">
                <ellipse cx="112" cy="74" rx="6.5" ry="9.5" fill={midnightColor} />
                <circle cx="114" cy="71" r="2.5" fill="#FFFFFF" />
                <ellipse cx="127" cy="74" rx="6.5" ry="9.5" fill={midnightColor} />
                <circle cx="129" cy="71" r="2.5" fill="#FFFFFF" />
                {/* Dramatic eyebrow */}
                <path d="M 106 63 L 118 64" stroke={midnightColor} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 133 63 L 122 65" stroke={midnightColor} strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Beak */}
              {renderBeak()}

              {/* Little retro skull held in front wing (Hamlet/Theater reference) */}
              <g id="shakespeare-skull" transform="translate(138, 96)" className="animate-pulse">
                {/* Skull Main */}
                <rect x="0" y="5" width="22" height="18" rx="8" fill="#FFFFFF" stroke={midnightColor} strokeWidth="3" />
                <rect x="5" y="19" width="12" height="7" fill="#FFFFFF" stroke={midnightColor} strokeWidth="3" />
                {/* Teeth cuts */}
                <line x1="9" y1="21" x2="9" y2="25" stroke={midnightColor} strokeWidth="2" />
                <line x1="13" y1="21" x2="13" y2="25" stroke={midnightColor} strokeWidth="2" />
                {/* Eye sockets */}
                <circle cx="6" cy="11" r="3" fill={midnightColor} />
                <circle cx="16" cy="11" r="3" fill={midnightColor} />
                {/* Nose cavity */}
                <path d="M 11 14 L 9 17 L 13 17 Z" fill={midnightColor} />
              </g>

              {/* Front wing holding the skull up */}
              <path
                d="M 96 112 C 108 112, 134 116, 135 106 C 132 98, 108 102, 96 112 Z"
                fill="#FFFFFF"
                stroke={midnightColor}
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      );

    case "general":
    default:
      return (
        <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Playful circular brand ring (as seen on Page 8 & 1) */}
            <circle cx="100" cy="100" r="85" stroke={limeColor} strokeWidth="5" strokeDasharray="6 8" className="animate-[spin_40s_linear_infinite]" />

            {/* Sneakers */}
            {renderSneakers(2, -2)}

            {/* Bird Body */}
            <g className={swingClass}>
              {/* Back wing waving */}
              <path
                d="M 66 94 C 40 85, 30 110, 64 112"
                fill="#FFFFFF"
                stroke={midnightColor}
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Main plump bird body */}
              <path
                d="M 75 90 C 75 55, 135 55, 135 90 C 135 125, 75 125, 75 90 Z"
                fill="#FFFFFF"
                stroke={midnightColor}
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Backwards cap */}
              {renderCap(limeColor)}

              {/* Eyes */}
              {renderPieEyes()}

              {/* Beak */}
              {renderBeak()}

              {/* Front wing holding walking balance */}
              <path
                d="M 98 108 C 110 110, 125 105, 122 118 C 118 126, 102 115, 98 108 Z"
                fill="#FFFFFF"
                stroke={midnightColor}
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      );
  }
}
