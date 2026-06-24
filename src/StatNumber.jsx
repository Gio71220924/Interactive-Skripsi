import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function StatNumber({ value, decimals = 2, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const isNeg = value < 0;
  const abs = Math.abs(value);

  const fmt = (v) =>
    prefix + (isNeg ? "-" : "") + Math.abs(v).toFixed(decimals).replace(".", ",") + suffix;

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    const obj = { val: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: abs,
          duration: 1.4,
          ease: "power2.out",
          snap: { val: decimals === 0 ? 1 : 0.01 },
          onUpdate: () => { if (el) el.textContent = fmt(obj.val); },
          onComplete: () => { if (el) el.textContent = fmt(abs); },
        });
      },
    });

    return () => trigger.kill();
  }, [value]);

  return <span ref={ref}>{fmt(abs)}</span>;
}
