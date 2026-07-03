import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SpiderWebHeart from '../components/SpiderWebHeart';

interface Props {
  onNext: () => void;
}

// Fixed heart positions/sizes so they don't re-randomise on re-render
const HEARTS = [
  { id: 0, size: 180, x: -8, y: -5, rotate: -20, opacity: 0.9, delay: 0, dur: 7 },
  { id: 1, size: 130, x: 62, y: -3, rotate: 15, opacity: 0.75, delay: 0.6, dur: 8.5 },
  { id: 2, size: 90, x: 78, y: 18, rotate: -8, opacity: 0.65, delay: 1.2, dur: 6.5 },
  { id: 3, size: 60, x: 5, y: 22, rotate: 25, opacity: 0.55, delay: 0.4, dur: 9 },
  { id: 4, size: 200, x: -12, y: 55, rotate: -30, opacity: 0.85, delay: 0.9, dur: 7.5 },
  { id: 5, size: 110, x: 70, y: 50, rotate: 12, opacity: 0.7, delay: 1.5, dur: 8 },
  { id: 6, size: 75, x: 40, y: 70, rotate: -18, opacity: 0.5, delay: 0.3, dur: 10 },
  { id: 7, size: 50, x: 85, y: 72, rotate: 5, opacity: 0.6, delay: 1.8, dur: 6 },
  { id: 8, size: 160, x: -5, y: 78, rotate: 20, opacity: 0.8, delay: 0.7, dur: 8 },
  { id: 9, size: 95, x: 58, y: 88, rotate: -10, opacity: 0.65, delay: 1.1, dur: 7 },
  { id: 10, size: 55, x: 20, y: 88, rotate: 30, opacity: 0.45, delay: 2, dur: 9.5 },
];

export default function PageOne({ onNext }: Props) {
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLine1(true), 600);
    const t2 = setTimeout(() => setShowLine2(true), 2200);
    const t3 = setTimeout(() => setShowLine3(true), 3600);
    const t4 = setTimeout(() => setShowBtn(true), 4800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden select-none"
      style={{ background: '#FAF5EE' }}
    >
      {/* Floating spider-web hearts */}
      {HEARTS.map((h) => (
        <motion.div
          key={h.id}
          className="absolute pointer-events-none"
          style={{
            left: `${h.x}%`,
            top: `${h.y}%`,
            rotate: h.rotate,
          }}
          animate={{
            y: [0, -18, 0],
            rotate: [h.rotate, h.rotate + 6, h.rotate - 4, h.rotate],
          }}
          transition={{
            duration: h.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: h.delay,
          }}
        >
          <SpiderWebHeart size={h.size} opacity={h.opacity} />
        </motion.div>
      ))}

      {/* Subtle cream radial centre glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,240,230,0.85) 0%, transparent 80%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-6 px-8">
        {/* Name badge */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'backOut', delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <span
            className="font-serif italic font-bold tracking-widest"
            style={{ color: '#5C0000', fontSize: 'clamp(2.4rem, 10vw, 4rem)', lineHeight: 1.1 }}
          >
            Nethra
          </span>
          {/* Spider-man style small web divider */}
          <div className="flex items-center gap-2 mt-1">
            <div style={{ width: 40, height: 1, background: '#8B0000', opacity: 0.4 }} />
            <span style={{ color: '#8B0000', fontSize: '1rem' }}>🕷️</span>
            <div style={{ width: 40, height: 1, background: '#8B0000', opacity: 0.4 }} />
          </div>
        </motion.div>

        {/* Staggered text lines */}
        <div className="flex flex-col items-center gap-3 text-center max-w-[300px] min-h-[96px]">
          {showLine1 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="font-serif italic"
              style={{ color: '#5C0000', fontSize: '1.05rem', lineHeight: 1.6 }}
            >
              With great love comes a great birthday…
            </motion.p>
          )}
          {showLine2 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="font-serif italic"
              style={{ color: '#7A1010', fontSize: '1rem', lineHeight: 1.6, opacity: 0.85 }}
            >
              The universe conspired to put you here.
            </motion.p>
          )}
          {showLine3 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="font-serif italic"
              style={{ color: '#8B0000', fontSize: '0.9rem', opacity: 0.75 }}
            >
              And we're all so glad it did. ❤️
            </motion.p>
          )}
        </div>

        {/* Next button */}
        {showBtn && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onClick={onNext}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="mt-2 px-10 py-3 rounded-full font-sans font-semibold tracking-wider text-sm shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #8B0000, #C0392B)',
              color: '#fff',
              boxShadow: '0 4px 24px rgba(139,0,0,0.35), 0 1px 4px rgba(0,0,0,0.18)',
              border: '1.5px solid rgba(255,255,255,0.18)',
            }}
          >
            Open your gift →
          </motion.button>
        )}
      </div>
    </div>
  );
}
