import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConstellationCanvas from '../components/ConstellationCanvas';

interface Props {
  onNext: () => void;
  isActive: boolean;
}

function NextButton({ onNext }: { onNext: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 22000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      onClick={onNext}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="absolute bottom-[6dvh] left-1/2 -translate-x-1/2 z-20 px-10 py-3 rounded-full font-sans font-semibold tracking-wider text-sm"
      style={{
        background: 'linear-gradient(135deg, #8B0000, #C0392B)',
        color: '#fff',
        boxShadow: '0 4px 24px rgba(139,0,0,0.5), 0 1px 6px rgba(0,0,0,0.3)',
        border: '1.5px solid rgba(255,255,255,0.15)',
      }}
    >
      One last surprise →
    </motion.button>
  );
}

export default function PageTwo({ onNext, isActive }: Props) {
  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#020513]">
      {/* Nebula blobs */}
      <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[60vw] h-[60vw] rounded-full bg-red-800/10 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-rose-600/10 blur-[80px] pointer-events-none" />

      {/* Aurora bands */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[20%] w-full h-[20%] bg-gradient-to-b from-transparent via-[#FF3333] to-transparent blur-[40px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute top-[50%] w-full h-[30%] bg-gradient-to-b from-transparent via-[#9D4EDD] to-transparent blur-[60px] animate-[pulse_15s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Constellation canvas — triggers when isActive */}
      <ConstellationCanvas inView={isActive} />

      {/* Next button — mounts after 22s so keyboard/screen-reader users can't reach it early */}
      <NextButton onNext={onNext} />
    </div>
  );
}
