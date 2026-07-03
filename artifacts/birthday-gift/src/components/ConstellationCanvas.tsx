import { useEffect, useRef, useState } from 'react';
import { config } from '../config';

interface Star {
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  alpha: number;
  trail: { x: number; y: number }[];
  twinkleSpeed: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  tx?: number;
  ty?: number;
}

export default function ConstellationCanvas({ inView }: { inView: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0); 
  // 0 = gather, 1 = constellation, 2 = dissolve, 3 = particle name, 4 = morph, 5 = celebration
  
  const stateRef = useRef({
    phase: 0,
    startTime: 0,
    stars: [] as Star[],
    particles: [] as Particle[],
    bgStars: [] as { x: number; y: number; size: number; alpha: number; speed: number }[],
    width: 0,
    height: 0,
    namePoints: [] as { x: number; y: number }[],
    denseNamePoints: [] as { x: number; y: number }[],
    hasStarted: false,
  });

  // Extract points from text
  const getTextPoints = (text: string, width: number, height: number, density: number = 4) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];
    
    canvas.width = width;
    canvas.height = height;
    
    // Scale font size based on width to fit
    const fontSize = Math.min(width * 0.15, 60);
    ctx.font = `bold ${fontSize}px "Playfair Display", serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    
    const imgData = ctx.getImageData(0, 0, width, height).data;
    const points = [];
    
    for (let y = 0; y < height; y += density) {
      for (let x = 0; x < width; x += density) {
        const i = (y * width + x) * 4;
        if (imgData[i + 3] > 128) {
          points.push({ x, y });
        }
      }
    }
    return points;
  };

  useEffect(() => {
    if (!inView || stateRef.current.hasStarted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    stateRef.current.width = rect.width;
    stateRef.current.height = rect.height;
    stateRef.current.hasStarted = true;
    stateRef.current.startTime = Date.now();

    const w = rect.width;
    const h = rect.height;

    // Generate background stars
    const bgStars = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    }));
    stateRef.current.bgStars = bgStars;

    // Get text points
    const densePoints = getTextPoints(config.name, w, h, 3);
    const sparsePoints = getTextPoints(config.name, w, h, Math.max(12, Math.floor(w/20)));
    
    // Select 25 specific points for the constellation
    const targetPoints = [];
    if (sparsePoints.length > 0) {
      const step = Math.max(1, Math.floor(sparsePoints.length / 25));
      for (let i = 0; i < 25; i++) {
        const pt = sparsePoints[(i * step) % sparsePoints.length];
        if (pt) targetPoints.push(pt);
      }
    } else {
      // Fallback
      for (let i = 0; i < 25; i++) {
        targetPoints.push({ x: w/2 + (Math.random()-0.5)*100, y: h/2 + (Math.random()-0.5)*100 });
      }
    }

    stateRef.current.denseNamePoints = densePoints;
    stateRef.current.namePoints = targetPoints;

    // Initialize constellation stars
    const stars: Star[] = targetPoints.map(pt => ({
      x: Math.random() * w,
      y: Math.random() * h,
      tx: pt.x,
      ty: pt.y,
      size: Math.random() * 2 + 2,
      alpha: 1,
      trail: [],
      twinkleSpeed: Math.random() * 0.1 + 0.05,
      color: 'rgba(255, 255, 255, 1)'
    }));
    stateRef.current.stars = stars;

    // Colors for particles
    const colors = ['#FF6B9D', '#FFD700', '#9D4EDD', '#00E5FF', '#FFFFFF'];

    let animationFrameId: number;

    const render = () => {
      const now = Date.now();
      const elapsed = (now - stateRef.current.startTime) / 1000; // in seconds
      
      let currentPhase = 0;
      if (elapsed > 20) currentPhase = 5;
      else if (elapsed > 16) currentPhase = 4;
      else if (elapsed > 12) currentPhase = 3;
      else if (elapsed > 8) currentPhase = 2;
      else if (elapsed > 4) currentPhase = 1;
      
      if (currentPhase !== stateRef.current.phase) {
        stateRef.current.phase = currentPhase;
        setPhase(currentPhase);
        
        // Phase Transitions
        if (currentPhase === 2) {
          // Dissolve: create particles
          const particles: Particle[] = [];
          for (let i = 0; i < 300; i++) {
            particles.push({
              x: w / 2 + (Math.random() - 0.5) * 50,
              y: h / 2 + (Math.random() - 0.5) * 50,
              vx: (Math.random() - 0.5) * 15,
              vy: (Math.random() - 0.5) * 15,
              size: Math.random() * 2 + 1,
              alpha: Math.random(),
              color: colors[Math.floor(Math.random() * colors.length)]
            });
          }
          stateRef.current.particles = particles;
        } else if (currentPhase === 3) {
          // Assign targets to particles
          const dPoints = stateRef.current.denseNamePoints;
          if (dPoints.length > 0) {
            stateRef.current.particles.forEach((p, i) => {
              const target = dPoints[i % dPoints.length];
              p.tx = target.x;
              p.ty = target.y;
            });
          }
        }
      }

      ctx.clearRect(0, 0, w, h);

      // Draw background stars
      ctx.fillStyle = 'white';
      stateRef.current.bgStars.forEach(bs => {
        bs.alpha += bs.speed;
        if (bs.alpha > Math.PI * 2) bs.alpha -= Math.PI * 2;
        const opacity = (Math.sin(bs.alpha) + 1) / 2 * 0.5 + 0.1;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(bs.x, bs.y, bs.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Phase 0 & 1: Constellation
      if (currentPhase < 2) {
        const { stars } = stateRef.current;
        
        // Draw lines for phase 1
        if (currentPhase === 1) {
          const lineAlpha = Math.min((elapsed - 4) / 2, 0.4);
          ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let i = 0; i < stars.length - 1; i++) {
            ctx.moveTo(stars[i].x, stars[i].y);
            // Connect to nearest neighbor that isn't connected yet, simplified to path order
            ctx.lineTo(stars[i+1].x, stars[i+1].y);
          }
          ctx.stroke();
        }

        // Update and draw stars
        stars.forEach(star => {
          if (currentPhase === 0) {
            // Move to target
            const ease = 0.02;
            star.x += (star.tx - star.x) * ease;
            star.y += (star.ty - star.y) * ease;
            
            // Trail
            star.trail.push({ x: star.x, y: star.y });
            if (star.trail.length > 15) star.trail.shift();
            
            // Draw trail
            if (star.trail.length > 1) {
              ctx.beginPath();
              ctx.moveTo(star.trail[0].x, star.trail[0].y);
              for (let i = 1; i < star.trail.length; i++) {
                ctx.lineTo(star.trail[i].x, star.trail[i].y);
              }
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          }

          // Draw star
          const twinkle = (Math.sin(elapsed * star.twinkleSpeed * 10) + 1) / 2 * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'white';
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // Phase 2, 3, 4: Particles
      if (currentPhase >= 2 && currentPhase <= 4) {
        const pAlpha = currentPhase === 4 ? Math.max(1 - (elapsed - 16) / 2, 0) : 1;
        ctx.globalAlpha = pAlpha;
        
        stateRef.current.particles.forEach(p => {
          if (currentPhase === 2) {
            // Swirl outward
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.98;
            p.vy *= 0.98;
          } else if (currentPhase >= 3) {
            // Move to target text
            if (p.tx !== undefined && p.ty !== undefined) {
              p.x += (p.tx - p.x) * 0.05;
              p.y += (p.ty - p.y) * 0.05;
              
              // Add slight float
              p.x += Math.sin(now / 1000 + p.alpha * 10) * 0.5;
              p.y += Math.cos(now / 1000 + p.alpha * 10) * 0.5;
            }
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
      }
      
      // Phase 5: Fireworks / Sparks
      if (currentPhase === 5) {
        // Add random sparks if needed, or rely on CSS/Framer motion in the parent component
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [inView]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      {/* Morph to Typography */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-2000 pointer-events-none ${phase >= 4 ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 10 }}
      >
        <div className="text-center px-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            ✨ Happy Birthday, {config.name} ✨
          </h2>
          
          <div className={`transition-opacity duration-1000 delay-[1500ms] ${phase === 5 ? 'opacity-100' : 'opacity-0'} mt-8`}>
            <p className="text-lg md:text-xl font-serif text-white/90 max-w-sm mx-auto mb-4">
              {config.birthdayMessage}
            </p>
          </div>
          
          <div className={`transition-opacity duration-1000 delay-[3000ms] ${phase === 5 ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-lg md:text-xl font-serif text-white/90 max-w-sm mx-auto">
              {config.birthdayMessage2}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
