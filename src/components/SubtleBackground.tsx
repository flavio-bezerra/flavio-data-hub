import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

// --- NEURAL NETWORK CANVAS COMPONENT ---
const NeuralNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match parent container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Configuration
    const particleCount = 150; // Reduced density for better performance
    const baseConnectionDistance = 120; // Increased range to maintain connections with fewer particles
    const mouseDistance = 300; // Interaction radius

    // Particles array
    const particles: any[] = [];
    const createParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2, // Slower natural movement
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.5 ? "212, 175, 55" : "65, 105, 225"
        });
      }
    };
    createParticles();

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(p => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse Interaction (Attraction) - REMOVED for performance
        // Particles no longer move towards the mouse, but lines still light up.

        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, 0.5)`;
        ctx.fill();
      });

      // Draw Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Calculate distance to mouse for this pair (using midpoint)
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const distToMouse = Math.sqrt((midX - mouse.x) ** 2 + (midY - mouse.y) ** 2);

          // Dynamic connection distance:
          // If near mouse, significantly increase the connection range to "create" more links
          let effectiveDistance = baseConnectionDistance;
          if (distToMouse < mouseDistance) {
            effectiveDistance += 100 * (1 - distToMouse / mouseDistance); // Boost range by up to 100px
          }

          if (dist < effectiveDistance) {
            ctx.beginPath();
            // Opacity based on distance relative to the effective distance
            const opacity = 0.2 * (1 - dist / effectiveDistance);

            // Highlight lines near mouse
            if (distToMouse < mouseDistance) {
              ctx.strokeStyle = `rgba(148, 163, 184, ${opacity * 2})`; // Brighter near mouse
            } else {
              ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`;
            }

            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

// --- BLOB COMPONENT ---
const Blob = ({ config, mouseX, mouseY }: { config: any, mouseX: any, mouseY: any }) => {
  const movementRange = config.parallaxFactor || 30;
  const x = useTransform(mouseX, [-1, 1], [-movementRange, movementRange]);
  const y = useTransform(mouseY, [-1, 1], [-movementRange, movementRange]);

  return (
    <motion.div
      className="absolute"
      style={{
        top: config.initialTop,
        left: config.initialLeft,
        width: config.size,
        height: config.size,
        x,
        y,
      }}
    >
      <motion.div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle, ${config.color} 0%, transparent 60%)`,
          opacity: config.opacity,
          filter: "blur(60px)",
        }}
        animate={config.animate}
        transition={{
          duration: config.duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

// --- MAIN BACKGROUND COMPONENT ---
const SubtleBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 50 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const blobs = [
    // Large Blobs
    {
      id: "gold-large",
      color: "hsl(var(--gold))",
      size: "60%",
      initialTop: "10%",
      initialLeft: "10%",
      opacity: 0.4,
      duration: 18,
      parallaxFactor: 20,
      animate: {
        x: ["-10%", "20%", "-10%", "-10%"],
        y: ["-20%", "30%", "-10%", "-20%"],
        scale: [1, 1.2, 0.9, 1],
      }
    },
    {
      id: "blue-large",
      color: "hsl(var(--primary))",
      size: "70%",
      initialTop: "20%",
      initialLeft: "40%",
      opacity: 0.5,
      duration: 22,
      parallaxFactor: 30,
      animate: {
        x: ["10%", "-20%", "10%", "10%"],
        y: ["20%", "-30%", "10%", "20%"],
        scale: [1.1, 0.9, 1.2, 1.1],
      }
    },
    {
      id: "deep-blue-large",
      color: "hsl(var(--primary))",
      size: "80%",
      initialTop: "40%",
      initialLeft: "10%",
      opacity: 0.3,
      duration: 25,
      parallaxFactor: 25,
      animate: {
        x: ["-5%", "15%", "-15%", "-5%"],
        y: ["10%", "-20%", "15%", "10%"],
        scale: [0.95, 1.05, 0.95, 0.95],
      }
    },
    // Medium Blobs
    {
      id: "gold-medium",
      color: "hsl(var(--gold))",
      size: "35%",
      initialTop: "60%",
      initialLeft: "60%",
      opacity: 0.3,
      duration: 15,
      parallaxFactor: 50,
      animate: {
        x: ["0%", "-30%", "20%", "0%"],
        y: ["0%", "-20%", "30%", "0%"],
        scale: [1, 1.3, 0.8, 1],
      }
    },
    {
      id: "blue-medium",
      color: "hsl(var(--primary))",
      size: "40%",
      initialTop: "10%",
      initialLeft: "70%",
      opacity: 0.4,
      duration: 19,
      parallaxFactor: 60,
      animate: {
        x: ["0%", "-40%", "10%", "0%"],
        y: ["0%", "40%", "-10%", "0%"],
        scale: [0.9, 1.1, 0.9, 0.9],
      }
    },
    // Small Blobs
    {
      id: "gold-small-1",
      color: "hsl(var(--gold))",
      size: "20%",
      initialTop: "30%",
      initialLeft: "40%",
      opacity: 0.5,
      duration: 12,
      parallaxFactor: 80,
      animate: {
        x: ["-50%", "50%", "-50%"],
        y: ["-20%", "20%", "-20%"],
        scale: [1, 1.5, 1],
      }
    },
    {
      id: "blue-small-1",
      color: "hsl(var(--primary))",
      size: "25%",
      initialTop: "70%",
      initialLeft: "20%",
      opacity: 0.4,
      duration: 14,
      parallaxFactor: 90,
      animate: {
        x: ["30%", "-30%", "30%"],
        y: ["-30%", "30%", "-30%"],
        scale: [1.2, 0.8, 1.2],
      }
    },
    {
      id: "gold-small-2",
      color: "hsl(var(--gold))",
      size: "15%",
      initialTop: "80%",
      initialLeft: "80%",
      opacity: 0.4,
      duration: 16,
      parallaxFactor: 100,
      animate: {
        x: ["-20%", "20%", "-20%"],
        y: ["20%", "-20%", "20%"],
        scale: [0.8, 1.2, 0.8],
      }
    }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-background">
      {/* 1. Base Gradient Blobs */}
      <div className="absolute inset-0 opacity-70">
        {blobs.map((blob) => (
          <Blob
            key={blob.id}
            config={blob}
            mouseX={smoothX}
            mouseY={smoothY}
          />
        ))}
      </div>

      {/* 2. Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 3. Blur Layer (Fog) */}
      <div className="absolute inset-0 backdrop-blur-[100px] bg-background/80" />

      {/* 4. Neural Network Overlay (On top of blur, but subtle) */}
      <NeuralNetwork />
    </div>
  );
};

export default SubtleBackground;
