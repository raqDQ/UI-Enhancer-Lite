import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { config } from '../config';

interface Props {
  /** Called whenever play state changes — parent can react if needed */
  onPlayChange?: (playing: boolean) => void;
}

export default function VinylPlayer({ onPlayChange }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (config.musicFile) {
      const audio = new Audio(config.musicFile);
      audio.loop = true;
      audioRef.current = audio;
    }
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPlayChange?.(false);
    } else {
      audioRef.current.play().catch((e) => console.error('Audio failed', e));
      setIsPlaying(true);
      onPlayChange?.(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* ── Vinyl record ── */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 'min(62vmin, 240px)', height: 'min(62vmin, 240px)' }}
      >
        {/* Spinning disc */}
        <motion.div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: '100%',
            height: '100%',
            background: '#C41E3A',
            boxShadow:
              'inset 0 0 0 4px #b01a34, inset 0 0 0 10px #C41E3A, inset 0 0 0 12px #a3172f, inset 0 0 0 20px #C41E3A, inset 0 0 0 22px #98142a, inset 0 0 0 36px #C41E3A, inset 0 0 0 38px #8b1125',
          }}
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ repeat: isPlaying ? Infinity : 0, duration: 1.8, ease: 'linear' }}
        >
          {/* Label */}
          <div className="absolute w-[30%] aspect-square bg-[#111] rounded-full flex flex-col items-center justify-center text-white z-10">
            <div className="text-[8px] font-bold tracking-widest text-center uppercase leading-tight px-1">
              {config.songTitle}
            </div>
            <div className="text-[6px] text-gray-400 mt-0.5 uppercase tracking-wider text-center px-1">
              {config.artistName}
            </div>
            <div className="absolute w-2 h-2 bg-gray-300 rounded-full border border-gray-600" />
          </div>
        </motion.div>

        {/* Tonearm pivot */}
        <div className="absolute left-[-14%] top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-800 rounded-full border-4 border-gray-900 shadow-xl z-20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-gray-600 rounded-full" />
        </div>

        {/* Tonearm */}
        <motion.div
          className="absolute left-[-14%] top-1/2 z-20 origin-left"
          initial={{ rotate: -15 }}
          animate={{ rotate: isPlaying ? 5 : -15 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{ width: '45%' }}
        >
          <div className="relative w-full h-[3px] bg-[#111] mt-[-1.5px] rounded-r-full shadow-lg">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-5 bg-gray-800 rounded-sm border border-gray-700 shadow-md">
              <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-1 h-2 bg-gray-400 rounded-b-sm" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Play / Pause button ── */}
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="flex items-center gap-2.5 px-7 py-2.5 rounded-full font-sans font-semibold text-sm tracking-wide"
        style={{
          background: isPlaying
            ? 'linear-gradient(135deg, #5C0000, #8B0000)'
            : 'linear-gradient(135deg, #8B0000, #C0392B)',
          color: '#fff',
          boxShadow: '0 4px 18px rgba(139,0,0,0.38), 0 1px 4px rgba(0,0,0,0.2)',
          border: '1.5px solid rgba(255,255,255,0.15)',
          transition: 'background 0.4s',
        }}
      >
        {isPlaying ? (
          /* Pause icon */
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="3" width="4" height="18" rx="1" />
            <rect x="15" y="3" width="4" height="18" rx="1" />
          </svg>
        ) : (
          /* Play icon */
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
        {isPlaying ? 'Pause' : 'Play Heeriye'}
      </motion.button>
    </div>
  );
}
