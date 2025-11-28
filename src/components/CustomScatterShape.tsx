import { motion } from "framer-motion";
import { memo, useMemo } from "react";

interface CustomScatterShapeProps {
  cx: number;
  cy: number;
  payload: any;
  activeId: string | null;
  data: any[];
}

const CustomScatterShape = memo(({ cx, cy, payload, activeId, data }: CustomScatterShapeProps) => {
  const isActive = activeId === payload.id;
  const index = data.findIndex((item) => item.id === payload.id);

  // Memoize satellites to prevent recalculation on every render
  const satellites = useMemo(() => {
    if (!isActive) return [];
    
    const satelliteCount = 20; // Further reduced for performance
    return Array.from({ length: satelliteCount }).map((_, i) => {
      const seed = index * 100 + i;
      const rand = (s: number) => {
        const x = Math.sin(s) * 43758.5453;
        return x - Math.floor(x);
      };

      const rX = rand(seed * 1.1);
      const rY = rand(seed * 1.2);
      const rSize = rand(seed * 1.3);

      const spread = 280;
      const offsetX = Math.pow(2 * rX - 1, 3) * spread;
      const offsetY = Math.pow(2 * rY - 1, 3) * spread;
      const size = 1 + rSize * 4;

      return {
        cx: cx + offsetX,
        cy: cy + offsetY,
        r: size,
        // Animation params
        moveX: (rand(seed * 1.4) - 0.5) * 20,
        moveY: (rand(seed * 1.5) - 0.5) * 20,
        duration: 2 + rand(seed * 1.6) * 3,
      };
    });
  }, [isActive, index, cx, cy]);

  return (
    <g>
      {isActive &&
        satellites.map((sat, i) => (
          <motion.circle
            key={`sat-${i}`}
            cx={sat.cx}
            cy={sat.cy}
            r={sat.r}
            fill={payload.color}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: 0.6, 
              scale: 1,
              x: [0, sat.moveX, 0],
              y: [0, sat.moveY, 0]
            }}
            transition={{
              opacity: { duration: 0.4, delay: i * 0.02 },
              scale: { duration: 0.4, delay: i * 0.02 },
              x: {
                duration: sat.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              y: {
                duration: sat.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }
            }}
            style={{ pointerEvents: "none" }}
          />
        ))}
      <motion.circle
        cx={cx}
        cy={cy}
        r={isActive ? 20 : 14}
        fill={payload.color}
        initial={false} // Disable initial animation on re-renders
        animate={{
          scale: isActive ? 1.2 : 1,
          opacity: isActive ? 1 : activeId ? 0.2 : 1,
          r: isActive ? 20 : 14,
        }}
        transition={{
          duration: 0.3, // Faster transition
          type: "spring",
          stiffness: 300, // Stiffer spring for snappier feel
          damping: 20,
        }}
        whileHover={{ scale: 1.3, opacity: 1 }}
        className="cursor-pointer"
        // Note: onClick is handled by the parent Scatter component via props, 
        // but Recharts passes onClick to the shape if defined in Scatter.
        // However, we can't easily pass the handler here without prop drilling or context.
        // A better approach for Recharts is to handle onClick on the Scatter component itself.
        style={{ outline: "none" }}
      />
    </g>
  );
});

export default CustomScatterShape;
