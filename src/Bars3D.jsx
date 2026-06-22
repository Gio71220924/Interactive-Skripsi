import { useEffect, useState } from "react";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Dep-free pseudo-3D bar chart: box-shadow extrusion gives bars depth, no WebGL.
export default function Bars3D({ data, unit = "", caption }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const [grown, setGrown] = useState(reduceMotion);
  const [hover, setHover] = useState(null);

  // Grow bars up from zero on mount
  useEffect(() => {
    if (reduceMotion) return;
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <figure className="bars3d-fig">
      <div className="bars3d" role="img" aria-label={caption}>
        {data.map((d, i) => (
          <div
            className="bars3d-col"
            key={d.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div
              className="bars3d-bar"
              data-hover={hover === i}
              style={{
                "--h": grown ? `${(d.value / max) * 100}%` : "0%",
                "--c": d.color || "var(--accent)",
              }}
            >
              <span className="bars3d-val">
                {d.value}
                {unit}
              </span>
            </div>
            <span className="bars3d-label">{d.label}</span>
          </div>
        ))}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
