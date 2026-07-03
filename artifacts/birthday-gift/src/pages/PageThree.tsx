import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { config } from '../config';
import VinylPlayer from '../components/VinylPlayer';
import SpiderWebHeart from '../components/SpiderWebHeart';

interface Props {
  isActive: boolean;
}

const CORNER_HEARTS = [
  { id: 0, size: 100, x: -4, y: -3,  rotate: -25, opacity: 0.55 },
  { id: 1, size: 70,  x: 78, y: -2,  rotate: 18,  opacity: 0.45 },
  { id: 2, size: 85,  x: -3, y: 78,  rotate: 30,  opacity: 0.5  },
  { id: 3, size: 60,  x: 82, y: 80,  rotate: -15, opacity: 0.4  },
];

export default function PageThree({ isActive }: Props) {
  const [showContent, setShowContent] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, [isActive]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const ce = e as CustomEvent;
      setToastMessage(ce.detail);
      setTimeout(() => setToastMessage(''), 3000);
    };
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  const handleWhatsapp = () => {
    window.open(
      `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden"
      style={{ background: '#FAF5EE' }}
    >
      {/* Corner hearts */}
      {CORNER_HEARTS.map((h) => (
        <motion.div
          key={h.id}
          className="absolute pointer-events-none"
          style={{ left: `${h.x}%`, top: `${h.y}%`, rotate: h.rotate }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7 + h.id, repeat: Infinity, ease: 'easeInOut', delay: h.id * 0.5 }}
        >
          <SpiderWebHeart size={h.size} opacity={h.opacity} />
        </motion.div>
      ))}

      {/* Centre glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(255,240,230,0.9) 0%, transparent 80%)',
        }}
      />

      {/* ── Main scrollable content ── */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-4 px-6 py-[6dvh]">

        {/* Wish text */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 18 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-center max-w-[300px]"
        >
          <p
            className="font-serif italic leading-relaxed"
            style={{ color: '#5C0000', fontSize: 'clamp(0.95rem, 4vw, 1.1rem)' }}
          >
            {config.wish}
          </p>
        </motion.div>

        {/* Vinyl player + play/pause */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.9 }}
          transition={{ duration: 1.4, delay: 0.5 }}
        >
          <VinylPlayer />
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 0.75 : 0 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="font-serif italic text-center max-w-[280px]"
          style={{ color: '#7A1010', fontSize: '0.9rem' }}
        >
          {config.caption}
        </motion.p>

        {/* WhatsApp button — always in flow, shown after content appears */}
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 14 }}
          transition={{ duration: 1, delay: 1.6 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleWhatsapp}
          className="px-8 py-3 rounded-full font-sans font-semibold tracking-wide text-sm shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            color: '#fff',
            boxShadow: '0 4px 22px rgba(37,211,102,0.38), 0 1px 4px rgba(0,0,0,0.18)',
            border: '1.5px solid rgba(255,255,255,0.2)',
          }}
          data-testid="whatsapp-button"
        >
          💬 Send a Response
        </motion.button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="absolute bottom-24 left-1/2 z-50 bg-black/80 text-white px-6 py-3 rounded-full text-sm font-sans backdrop-blur-md"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
