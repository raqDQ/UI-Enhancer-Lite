import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { config } from '../config';
import VinylPlayer from '../components/VinylPlayer';

export default function PageThree() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setShowWhatsapp(true), 3000);
    return () => clearTimeout(timer);
  }, [inView]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      setToastMessage(customEvent.detail);
      setTimeout(() => setToastMessage(''), 3000);
    };
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  const handleWhatsapp = () => {
    window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}`, '_blank');
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[100dvh] overflow-hidden bg-gradient-to-b from-[#FFF8F0] to-[#FFE8EE]"
    >
      {/* Ambient floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute w-2 h-2 bg-white/60 rounded-full blur-[1px]"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, Math.random() * -100 - 50],
            x: [null, `calc(${Math.random() * 50 - 25}px)`]
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Central Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-white/40 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-[12dvh] px-6">
        
        {/* Top Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-center max-w-[340px]"
        >
          <p className="font-serif italic text-xl md:text-2xl text-[#3D1A1A] leading-relaxed drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
            "{config.wish}"
          </p>
        </motion.div>

        {/* Centerpiece Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.9 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="w-full"
        >
          <VinylPlayer />
        </motion.div>

        {/* Bottom Text & CTA */}
        <div className="flex flex-col items-center space-y-8 mt-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 1.5, delay: 2 }}
            className="font-serif italic text-lg text-[#5D3A3A]/80 text-center"
          >
            {config.caption}
          </motion.p>

          <AnimatePresence>
            {showWhatsapp && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsapp}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-sans font-bold tracking-wide shadow-[0_4px_20px_rgba(244,63,94,0.4)]"
                data-testid="whatsapp-button"
              >
                Send a Response ❤️
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toast Message */}
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
