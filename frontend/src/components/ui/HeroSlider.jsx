import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import hero1 from "../../assets/hero/hero-1.png";
import hero2 from "../../assets/hero/hero-2.png";
import hero3 from "../../assets/hero/hero-3.png";
import hero4 from "../../assets/hero/hero-4.png";

const images = [hero1, hero2, hero3, hero4];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((previous) => (previous + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Animated hero images */}
      <AnimatePresence mode="sync">
        <motion.img
          key={current}
          src={images[current]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          initial={{
            opacity: 0,
            scale: 1.08,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.02,
          }}
          transition={{
            opacity: {
              duration: 1.2,
              ease: "easeInOut",
            },
            scale: {
              duration: 5,
              ease: "linear",
            },
          }}
        />
      </AnimatePresence>

      {/* Main readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/65 to-white/20" />

      {/* Bottom soft fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/55" />

      {/* Very subtle green brand tint */}
      <div className="absolute inset-0 bg-emerald-500/[0.02]" />

      {/* Soft blur to blend images into the UI */}
      <div className="absolute inset-0 backdrop-blur-[1px]" />
    </div>
  );
};

export default HeroSlider;