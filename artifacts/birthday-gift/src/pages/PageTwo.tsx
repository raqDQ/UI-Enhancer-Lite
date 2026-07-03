import { useEffect, useState, useRef } from 'react';
import ConstellationCanvas from '../components/ConstellationCanvas';

export default function PageTwo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

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

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[100dvh] overflow-hidden bg-[#020513]"
    >
      {/* Nebula Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[60vw] h-[60vw] rounded-full bg-teal-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-rose-600/10 blur-[80px] pointer-events-none" />

      {/* Aurora Bands */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[20%] w-full h-[20%] bg-gradient-to-b from-transparent via-[#00FFCC] to-transparent blur-[40px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute top-[50%] w-full h-[30%] bg-gradient-to-b from-transparent via-[#9D4EDD] to-transparent blur-[60px] animate-[pulse_15s_ease-in-out_infinite_reverse]" />
      </div>

      <ConstellationCanvas inView={inView} />
    </div>
  );
}
