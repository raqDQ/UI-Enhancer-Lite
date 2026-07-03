import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeddyBear() {
  const [isBlinking, setIsBlinking] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; angle: number }[]>([]);
  const tapCount = useRef(0);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    tapCount.current += 1;
    
    // Add heart
    const newHeart = { id: Date.now(), x, y };
    setHearts((prev) => [...prev, newHeart]);
    setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== newHeart.id)), 2000);

    // Add sparkles
    const newSparkles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i + 1000,
      x,
      y,
      angle: (i * Math.PI * 2) / 6
    }));
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => setSparkles((prev) => prev.filter((s) => !newSparkles.find(ns => ns.id === s.id))), 1000);
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center cursor-pointer select-none" data-testid="teddy-bear">
      {/* Background soft glow */}
      <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full scale-150 pointer-events-none" />
      
      {/* Floating container */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10"
        onClick={handleTap}
        whileTap={{ scale: 1.1 }}
      >
        {/* Breathing container */}
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Arms */}
            <path d="M45 105C30 115 25 135 35 145C45 155 60 145 70 135" fill="#8B5A2B" />
            <path d="M155 105C170 115 175 135 165 145C155 155 140 145 130 135" fill="#8B5A2B" />
            
            {/* Legs */}
            <path d="M60 160C45 175 55 195 70 190C85 185 85 165 80 155" fill="#8B5A2B" />
            <path d="M140 160C155 175 145 195 130 190C115 185 115 165 120 155" fill="#8B5A2B" />
            
            {/* Body */}
            <circle cx="100" cy="130" r="45" fill="#A06A38" />
            
            {/* Belly patch */}
            <circle cx="100" cy="135" r="30" fill="#C29B70" />
            
            {/* Ears */}
            <circle cx="65" cy="55" r="18" fill="#8B5A2B" />
            <circle cx="65" cy="55" r="10" fill="#C29B70" />
            <circle cx="135" cy="55" r="18" fill="#8B5A2B" />
            <circle cx="135" cy="55" r="10" fill="#C29B70" />
            
            {/* Head */}
            <circle cx="100" cy="75" r="38" fill="#A06A38" />
            
            {/* Muzzle */}
            <ellipse cx="100" cy="85" rx="18" ry="14" fill="#C29B70" />
            
            {/* Nose */}
            <ellipse cx="100" cy="80" rx="6" ry="4" fill="#3D1A1A" />
            
            {/* Smile */}
            <path d="M92 88C95 92 105 92 108 88" stroke="#3D1A1A" strokeWidth="2" strokeLinecap="round" />
            
            {/* Eyes */}
            <g transform="translate(85, 65)">
              <ellipse cx="0" cy="0" rx="4" ry={isBlinking ? 0.5 : 5} fill="#111" />
              {!isBlinking && <circle cx="-1" cy="-2" r="1.5" fill="white" />}
            </g>
            <g transform="translate(115, 65)">
              <ellipse cx="0" cy="0" rx="4" ry={isBlinking ? 0.5 : 5} fill="#111" />
              {!isBlinking && <circle cx="-1" cy="-2" r="1.5" fill="white" />}
            </g>
          </svg>
        </motion.div>
      </motion.div>

      {/* Hearts overlay */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, y: heart.y, x: heart.x, scale: 0.5 }}
            animate={{ opacity: 0, y: heart.y - 100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute z-20 pointer-events-none"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF6B9D">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sparkles overlay */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 1, scale: 0, x: sparkle.x, y: sparkle.y }}
            animate={{ 
              opacity: 0, 
              scale: 1, 
              x: sparkle.x + Math.cos(sparkle.angle) * 50, 
              y: sparkle.y + Math.sin(sparkle.angle) * 50 
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute z-20 pointer-events-none w-2 h-2 rounded-full bg-yellow-200"
            style={{ boxShadow: '0 0 8px 2px rgba(253, 224, 71, 0.8)' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
