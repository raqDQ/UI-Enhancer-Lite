import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { config } from '../config';

export default function VinylPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (config.musicFile) {
      audioRef.current = new Audio(config.musicFile);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!isPlaying) {
      if (audioRef.current) {
        audioRef.current.play().catch(e => {
          console.error("Audio playback failed", e);
        });
        setIsPlaying(true);
      } else {
        // No music file configured — show a toast and do NOT spin the record
        const evt = new CustomEvent('show-toast', { detail: 'Add your song to config.ts to play music 🎵' });
        window.dispatchEvent(evt);
      }
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  return (
    <div 
      className="relative w-full max-w-sm aspect-square flex items-center justify-center cursor-pointer translate-x-[8%]"
      onClick={togglePlay}
      data-testid="vinyl-player"
    >
      {/* The Vinyl Record */}
      <motion.div
        className="relative w-[72vmin] max-w-[320px] aspect-square rounded-full bg-[#C41E3A] shadow-2xl flex items-center justify-center"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ 
          repeat: isPlaying ? Infinity : 0, 
          duration: 1.8, 
          ease: "linear" 
        }}
        style={{
          boxShadow: 'inset 0 0 0 4px #b01a34, inset 0 0 0 10px #C41E3A, inset 0 0 0 12px #a3172f, inset 0 0 0 20px #C41E3A, inset 0 0 0 22px #98142a, inset 0 0 0 35px #C41E3A, inset 0 0 0 37px #8b1125'
        }}
      >
        {/* Record Label */}
        <div className="absolute w-[30%] aspect-square bg-[#111111] rounded-full flex flex-col items-center justify-center text-white z-10">
          <div className="text-[9px] font-bold tracking-widest text-center uppercase leading-tight px-2">
            {config.songTitle}
          </div>
          <div className="text-[7px] text-gray-400 mt-1 uppercase tracking-wider text-center px-1">
            {config.artistName}
          </div>
          <div className="absolute w-2 h-2 bg-gray-300 rounded-full border border-gray-600" />
        </div>
      </motion.div>

      {/* The Tonearm Pivot */}
      <div className="absolute left-[-15%] top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-800 rounded-full border-4 border-gray-900 shadow-xl z-20 flex items-center justify-center">
        <div className="w-3 h-3 bg-gray-600 rounded-full" />
      </div>

      {/* The Tonearm */}
      <motion.div
        className="absolute left-[-15%] top-1/2 z-20 origin-left"
        initial={{ rotate: -15 }}
        animate={{ rotate: isPlaying ? 5 : -15 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ width: '45%' }}
      >
        <div className="relative w-full h-[3px] bg-[#111] mt-[-1.5px] rounded-r-full shadow-lg">
          {/* Needle Head */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-6 bg-gray-800 rounded-sm border border-gray-700 shadow-md">
            <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-1 h-2 bg-gray-400 rounded-b-sm" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
