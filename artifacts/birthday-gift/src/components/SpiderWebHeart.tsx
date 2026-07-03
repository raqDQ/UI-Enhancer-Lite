interface SpiderWebHeartProps {
  size?: number;
  opacity?: number;
  glowColor?: string;
}

export default function SpiderWebHeart({ size = 120, opacity = 1, glowColor = '#8B0000' }: SpiderWebHeartProps) {
  const id = Math.random().toString(36).slice(2);
  const cx = 50;
  const cy = 58;

  // Radial lines from center outward at every 30°
  const radialLines = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const len = 48;
    return {
      x2: cx + Math.cos(angle) * len,
      y2: cy + Math.sin(angle) * len,
    };
  });

  // Concentric ring radii (ellipses centered at cx,cy)
  const rings = [10, 20, 30, 40];

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ opacity, filter: `drop-shadow(0 0 12px ${glowColor}99) drop-shadow(0 0 4px ${glowColor})` }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={`heart-${id}`}>
          {/* Standard heart path */}
          <path d="M50,32 C50,32 30,14 15,25 C5,33 5,47 15,56 L50,88 L85,56 C95,47 95,33 85,25 C70,14 50,32 50,32 Z" />
        </clipPath>
      </defs>

      {/* Heart fill */}
      <path
        d="M50,32 C50,32 30,14 15,25 C5,33 5,47 15,56 L50,88 L85,56 C95,47 95,33 85,25 C70,14 50,32 50,32 Z"
        fill="rgba(139,0,0,0.10)"
        stroke="#8B0000"
        strokeWidth="2"
      />

      {/* Web content clipped inside heart */}
      <g clipPath={`url(#heart-${id})`} stroke="#8B0000" strokeWidth="0.7" opacity="0.85">
        {/* Radial lines */}
        {radialLines.map((line, i) => (
          <line key={i} x1={cx} y1={cy} x2={line.x2} y2={line.y2} />
        ))}

        {/* Concentric ellipse rings */}
        {rings.map((r, i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.85} fill="none" />
        ))}
      </g>

      {/* Heart outline on top */}
      <path
        d="M50,32 C50,32 30,14 15,25 C5,33 5,47 15,56 L50,88 L85,56 C95,47 95,33 85,25 C70,14 50,32 50,32 Z"
        fill="none"
        stroke="#8B0000"
        strokeWidth="2"
      />
    </svg>
  );
}
