import { useEffect, useRef } from "react";
import gsap from "gsap";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CursorFollower() {
  const dotRef = useRef(null);

  useEffect(() => {
    if (reduceMotion) return;
    const dot = dotRef.current;

    const move = (e) => {
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const hide = () => gsap.to(dot, { opacity: 0, duration: 0.2 });
    const show = () => gsap.to(dot, { opacity: 1, duration: 0.2 });

    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
    };
  }, []);

  if (reduceMotion) return null;

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}
