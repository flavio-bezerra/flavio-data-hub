import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

// --- NEURAL NETWORK CANVAS COMPONENT ---
const NeuralNetwork = ({ isInView }: { isInView: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isInView) return; // Optimization: Stop animation when not visible

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
    // Configuration
    const spacing = 100; // Increased spacing to reduce particle count for performance
    const baseConnectionDistance = 70; // Balanced connection range
    const mouseDistance = 300; // Interaction radius

    // Particles array
    const particles: any[] = [];
    const createParticles = () => {
      particles.length = 0;
      const cols = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push({
            x: i * spacing + Math.random() * spacing,
            y: j * spacing + Math.random() * spacing,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: Math.random() * 1.5 + 0.5,
            color: Math.random() > 0.5 ? "212, 175, 55" : "65, 105, 225"
          });
        }
      }
    };
    createParticles();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };
    window.addEventListener("resize", handleResize);

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
        ctx.fillStyle = `rgba(${p.color}, 0.2)`;
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
            let alpha = 0.1 * (1 - dist / effectiveDistance);

            // Highlight lines near mouse
            if (distToMouse < mouseDistance) {
              const mouseFactor = 1 - distToMouse / mouseDistance;
              // Add a glow effect: boost opacity significantly near mouse
              alpha += mouseFactor * 0.6;
            }

            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;

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
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

// --- BLOB COMPONENT ---
const Blob = ({ config, mouseX, mouseY }: { config: any, mouseX: any, mouseY: any }) => {
  // Movement removed as requested

  return (
    <div
      className="absolute"
      style={{
        top: config.initialTop,
        left: config.initialLeft,
        width: config.size,
        height: config.size,
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle, ${config.color} 0%, transparent 60%)`,
          opacity: config.opacity,
          filter: "blur(60px)",
        }}
      />
    </div>
  );
};

// --- MAIN BACKGROUND COMPONENT ---
const SubtleBackground = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "200px" }); // Pre-load when close to viewport

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 50 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!isInView) return; // Optimization: Only track mouse when visible

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isInView]);

  const blobs = [
    // Large Blobs
    {
      id: "gold-large",
      color: "hsl(var(--gold))",
      size: "40vw", // Changed to vw to be stable
      initialTop: "10vh", // Changed to vh to be stable
      initialLeft: "10vw",
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
      size: "50vw",
      initialTop: "20vh",
      initialLeft: "40vw",
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
      size: "60vw",
      initialTop: "40vh",
      initialLeft: "10vw",
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
      size: "25vw",
      initialTop: "60vh",
      initialLeft: "60vw",
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
      size: "30vw",
      initialTop: "10vh",
      initialLeft: "70vw",
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
      size: "15vw",
      initialTop: "30vh",
      initialLeft: "40vw",
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
      size: "18vw",
      initialTop: "70vh",
      initialLeft: "20vw",
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
      size: "10vw",
      initialTop: "80vh",
      initialLeft: "80vw",
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
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none bg-background">
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

      {/* 3. Blur Layer (Fog) - Removed for performance */}
      <div className="absolute inset-0 bg-background/80" />

      {/* 4. Neural Network Overlay (On top of blur, but subtle) */}
      <NeuralNetwork isInView={isInView} />
    </div>
  );
};

export default SubtleBackground;
