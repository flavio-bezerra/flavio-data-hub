import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. CONFIGURAÇÃO DA CENA ---
    const scene = new THREE.Scene();
    
    const bgColor = 0x020617; 
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.005); // Neblina mais densa para escala menor

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    
    // CÂMERA REPOSICIONADA:
    // Como reduzimos a distância entre pontos, o "mundo" encolheu.
    // Aproximei a câmera para manter a imersão.
    camera.position.set(0, 8, 55); 
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. TEXTURA ---
    function createSphereTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 16; 
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
            const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); 
            gradient.addColorStop(0.2, 'rgba(0, 160, 255, 1)'); 
            gradient.addColorStop(0.5, 'rgba(0, 60, 160, 0.5)'); 
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');     

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 16, 16);
        }

        return new THREE.CanvasTexture(canvas);
    }

    // --- 3. GRID DE PARTÍCULAS (ULTRA COMPACTO) ---
    const particlesGeometry = new THREE.BufferGeometry();
    
    // Mantendo a contagem otimizada (~22.500) para performance
    const numParticlesX = 150; 
    const numParticlesZ = 150;
    const totalParticles = numParticlesX * numParticlesZ;
    
    const posArray = new Float32Array(totalParticles * 3);
    
    // DISTÂNCIA: Ajustada para manter a proporção visual com menos pontos
    const separation = 1.8; 
    
    const startX = (numParticlesX * separation) / -2;
    const startZ = (numParticlesZ * separation) / -2;

    let i = 0;
    for (let ix = 0; ix < numParticlesX; ix++) {
        for (let iz = 0; iz < numParticlesZ; iz++) {
            posArray[i] = startX + ix * separation;
            posArray[i + 1] = 0; 
            posArray[i + 2] = startZ + iz * separation;
            i += 3;
        }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // MATERIAL
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.7, // Reduzi o tamanho (era 1.0) para não virar um borrão sólido
        color: 0x44aaff, 
        map: createSphereTexture(),
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- 4. INTERAÇÃO ---
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - windowHalfX) * 0.05;
        mouseY = (event.clientY - windowHalfY) * 0.05;
    };

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
        if (event.gamma !== null && event.beta !== null) {
            // Gamma: Left/Right tilt (-90 to 90)
            // Beta: Front/Back tilt (-180 to 180)
            // Multiplier adjusted to match the scale of mouse interaction
            mouseX = event.gamma * 0.5; 
            // Subtracting 45 to assume a natural holding position (45 degrees tilt) as center
            mouseY = (event.beta - 45) * 0.5;
        }
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation);

    // --- 5. ANIMAÇÃO ---
    let count = 0;
    let animationId: number;

    // --- VISIBILITY CHECK ---
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
    });
    if (containerRef.current) {
        observer.observe(containerRef.current);
    }

    const animate = () => {
        animationId = requestAnimationFrame(animate);

        if (!isVisible) return;

        count += 0.03; 

        const positions = particlesGeometry.attributes.position.array as Float32Array;
        let index = 0;

        // Fator de ajuste de escala da onda:
        // Reduzi para 0.25 para "esticar" a onda sobre os pontos compactados,
        // senão a onda ficaria muito frequente/repetitiva.
        const scaleAdjustment = 0.4; 

        for (let ix = 0; ix < numParticlesX; ix++) {
            for (let iz = 0; iz < numParticlesZ; iz++) {
                
                const waveX = Math.sin((ix * 0.2 * scaleAdjustment) + count) * 4; 
                const waveZ = Math.sin((iz * 0.15 * scaleAdjustment) + count * 0.5) * 8; 
                
                // Detalhe fino ajustado
                const detail = Math.sin((ix * 0.5 * scaleAdjustment) + (iz * 0.3 * scaleAdjustment) + count) * 2; 

                positions[index + 1] = waveX + waveZ + detail;

                index += 3;
            }
        }

        particlesGeometry.attributes.position.needsUpdate = true;

        // Movimento de câmera ajustado para a nova escala (menor amplitude de movimento)
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        // Corrigindo o provável erro de digitação do original: assumindo 8 como altura base
        camera.position.y += (-mouseY * 0.9 + 8 - camera.position.y) * 0.5; 
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // --- 6. REDIMENSIONAMENTO (Baseado no Container) ---
    const updateSize = () => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };

    // Usar ResizeObserver para detectar mudanças no tamanho do container pai
    const resizeObserver = new ResizeObserver(() => {
        updateSize();
    });

    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
        // Forçar um update inicial
        updateSize();
    }

    // Cleanup
    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
        resizeObserver.disconnect(); // Parar de observar
        cancelAnimationFrame(animationId);
        
        if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement);
        }
        
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
};

export default ThreeBackground;
