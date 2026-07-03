import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeddyBear from '../components/TeddyBear';
import { ChevronUp } from 'lucide-react';

export default function PageOne() {
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showText3, setShowText3] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowText1(true), 1000);
    const t2 = setTimeout(() => setShowText2(true), 4000); // 1s + typing time + 1.5s pause
    const t3 = setTimeout(() => setShowText3(true), 5500); // previous + 1.5s pause

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Simple typewriter component
  const Typewriter = ({ text }: { text: string }) => {
    const [displayed, setDisplayed] = useState('');
    
    useEffect(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.substring(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }, [text]);

    return <span>{displayed}</span>;
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-[#0A0F24] to-black">
      {/* Moon */}
      <div className="absolute top-[10%] right-[15%] w-16 h-16 md:w-24 md:h-24 bg-white/90 rounded-full shadow-[0_0_80px_30px_rgba(255,255,255,0.4)]" />

      {/* Clouds */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[10%] bg-white/5 blur-[40px] rounded-full animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute top-[40%] right-[-10%] w-[50%] h-[15%] bg-white/5 blur-[50px] rounded-full animate-[pulse_12s_ease-in-out_infinite_reverse]" />

      {/* Fireflies / Particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_8px_rgba(253,224,71,0.8)]"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
            y: (typeof window !== 'undefined' ? window.innerHeight : 800) + Math.random() * 200,
            opacity: Math.random() * 0.5 + 0.3
          }}
          animate={{
            y: -100,
            x: `calc(${Math.random() * 100 - 50}px + ${Math.random() * 100}vw)`,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-[10dvh]">
        
        {/* Centerpiece Teddy */}
        <div className="mb-12">
          <TeddyBear />
        </div>

        {/* Text Sequence */}
        <div className="flex flex-col items-center text-center space-y-6 px-6 max-w-[320px] min-h-[150px]">
          {showText1 && (
            <p className="font-serif italic text-white/90 text-lg md:text-xl">
              <Typewriter text="The day the universe received one of its cutest gifts..." />
            </p>
          )}
          
          {showText2 && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="font-serif italic text-white/80 text-lg md:text-xl"
            >
              The stars have been waiting for this moment.
            </motion.p>
          )}
        </div>

        {/* Swipe Indicator */}
        <AnimatePresence>
          {showText3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute bottom-[5dvh] flex flex-col items-center text-white/50"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronUp className="w-8 h-8" />
              </motion.div>
              <span className="font-sans text-xs tracking-widest uppercase mt-2">Swipe Up</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
