import { motion, useInView, useAnimation, Variant } from "framer-motion";
import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  x?: number;
  y?: number;
}

export const ScrollReveal = ({
  children,
  width = "100%", // Default to 100% to avoid layout shifts
  className = "",
  delay = 0,
  duration = 0.6,
  threshold = 0.1, // Trigger when 10% of the element is visible
  x = 0,
  y = 30,
}: ScrollRevealProps) => {
  const ref = useRef(null);
  // once: false is the key here for re-animating
  const isInView = useInView(ref, { once: false, amount: threshold });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const variants = {
    hidden: { opacity: 0, x, y },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { duration, delay, ease: "easeOut" as const }
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      className={className}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
