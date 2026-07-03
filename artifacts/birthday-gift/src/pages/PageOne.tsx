import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeddyBear from '../components/TeddyBear';
import { ChevronUp } from 'lucide-react';

// Vibrant colorful particle colors
const PARTICLE_COLORS = [
  '#FF6B9D', '#FF8E53', '#FFC857', '#A8EDEA', '#C78BFA',
  '#FF9A9E', '#FFECD2', '#A18CD1', '#FBC2EB', '#84FAB0',
  '#F093FB', '#F5576C', '#4FACFE', '#43E97B', '#FA709A',
];

const PARTICLES = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  size: Math.random() * 10 + 5,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 5,
  driftX: (Math.random() - 0.5) * 80,
}));

// Colorful rainbow stars
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  twinkleDuration: Math.random() * 3 + 1.5,
  delay: Math.random() * 4,
}));

export default function PageOne() {
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showText3, setShowText3] = useState(false);
  const [typewriterDone, setTypewriterDone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowText1(true), 800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!typewriterDone) return;
    const t2 = setTimeout(() => setShowText2(true), 1200);
    return () => clearTimeout(t2);
  }, [typewriterDone]);

  useEffect(() => {
    if (!showText2) return;
    const t3 = setTimeout(() => setShowText3(true), 1800);
    return () => clearTimeout(t3);
  }, [showText2]);

  // Typewriter component
  const Typewriter = ({ text, onDone }: { text: string; onDone: () => void }) => {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.substring(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(onDone, 300);
        }
      }, 45);
      return () => clearInterval(interval);
    }, [text, onDone]);
    return <span>{displayed}<span className="animate-pulse">|</span></span>;
  };

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 15%, #C78BFA 35%, #A18CD1 50%, #84FAB0 65%, #FBC2EB 80%, #FF9A9E 100%)',
      }}
    >
      {/* Animated background gradient overlay for depth */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse at 20% 30%, rgba(255,107,157,0.4) 0%, transparent 60%)',
            'radial-gradient(ellipse at 80% 70%, rgba(199,139,250,0.5) 0%, transparent 60%)',
            'radial-gradient(ellipse at 50% 20%, rgba(132,250,176,0.4) 0%, transparent 60%)',
            'radial-gradient(ellipse at 20% 30%, rgba(255,107,157,0.4) 0%, transparent 60%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Soft white overlay for dreamy feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      />

      {/* Rainbow stars */}
      {STARS.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}, 0 0 ${star.size * 4}px ${star.color}88`,
          }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
          transition={{
            duration: star.twinkleDuration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: star.delay,
          }}
        />
      ))}

      {/* Vibrant colorful floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={`particle-${p.id}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size}px ${p.color}88`,
            filter: 'blur(0.5px)',
          }}
          animate={{
            y: [0, -120, 0],
            x: [0, p.driftX, 0],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}

      {/* Colorful blob accents */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,157,0.5), transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(132,250,176,0.4), transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="absolute top-[30%] right-[-15%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(199,139,250,0.45), transparent 70%)',
          filter: 'blur(45px)',
        }}
      />

      {/* ✨ Sparkle bursts */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-2xl pointer-events-none select-none"
          style={{
            left: `${10 + i * 11}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            scale: [0.6, 1.3, 0.6],
            opacity: [0.4, 1, 0.4],
            rotate: [0, 20, -20, 0],
          }}
          transition={{
            duration: 2 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          {['✨', '🌟', '💫', '⭐', '✨', '🌟', '💫', '⭐'][i]}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-6 px-4">

        {/* Teddy Bear with vibrant glow behind */}
        <div className="relative flex items-center justify-center">
          {/* Vibrant rainbow glow ring behind teddy */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 260,
              height: 260,
              background: 'conic-gradient(from 0deg, #FF6B9D, #FFC857, #84FAB0, #A18CD1, #FF6B9D)',
              filter: 'blur(25px)',
              opacity: 0.5,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          {/* White glow center for contrast */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 200,
              height: 200,
              background: 'radial-gradient(circle, rgba(255,255,255,0.7), transparent 70%)',
              filter: 'blur(15px)',
            }}
          />
          <TeddyBear />
        </div>

        {/* Text Sequence — white text with colorful shadow for readability */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-[320px] min-h-[130px]">
          {showText1 && (
            <motion.p
              className="font-serif italic text-white text-lg md:text-xl leading-snug"
              style={{
                textShadow: '0 2px 12px rgba(100,0,60,0.4), 0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              <Typewriter
                text="The day the universe received one of its cutest gifts..."
                onDone={() => setTypewriterDone(true)}
              />
            </motion.p>
          )}

          {showText2 && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="font-serif italic text-white/95 text-lg md:text-xl leading-snug"
              style={{ textShadow: '0 2px 10px rgba(80,0,100,0.35), 0 1px 3px rgba(0,0,0,0.25)' }}
            >
              The stars have been waiting for this moment.
            </motion.p>
          )}

          {showText3 && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="font-serif italic text-white/90 text-base md:text-lg"
              style={{ textShadow: '0 2px 10px rgba(80,0,100,0.3), 0 1px 3px rgba(0,0,0,0.2)' }}
            >
              Swipe up and let them tell the story.
            </motion.p>
          )}
        </div>
      </div>

      {/* Swipe Indicator */}
      <AnimatePresence>
        {showText3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute bottom-[5dvh] left-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronUp className="w-8 h-8 drop-shadow-lg" />
            </motion.div>
            <span
              className="font-sans text-xs tracking-widest uppercase mt-1"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}
            >
              Swipe Up
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
