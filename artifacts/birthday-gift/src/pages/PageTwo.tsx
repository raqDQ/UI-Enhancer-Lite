import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onNext: () => void;
  isActive: boolean;
}

// ── Shooting-star canvas ────────────────────────────────────────────────────
interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  alpha: number;
  color: string;
  dead: boolean;
}

function useMeteorCanvas(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    const meteors: Meteor[] = [];
    const colors = ['#ffffff', '#aaddff', '#ffeebb', '#ccaaff', '#88ddff'];

    const spawnMeteor = () => {
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.6;
      const speed = 8 + Math.random() * 14;
      meteors.push({
        x: Math.random() * W,
        y: -20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 80 + Math.random() * 120,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        dead: false,
      });
    };

    const spawns = [0, 120, 240, 350, 500, 650, 800, 1000, 1200, 1400, 1600, 1900, 2200, 2500];
    const timers = spawns.map((d) => setTimeout(spawnMeteor, d));

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      meteors.forEach((m) => {
        if (m.dead) return;
        m.x += m.vx;
        m.y += m.vy;
        m.alpha -= 0.012;
        if (m.alpha <= 0 || m.x > W + 50 || m.y > H + 50) { m.dead = true; return; }

        const mag = Math.hypot(m.vx, m.vy);
        const tailX = m.x - (m.vx / mag) * m.len;
        const tailY = m.y - (m.vy / mag) * m.len;

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = m.color;
        ctx.globalAlpha = m.alpha * 0.85;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = m.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => { timers.forEach(clearTimeout); cancelAnimationFrame(rafId); };
  }, [active]);

  return canvasRef;
}

// ── Next button (mounts only after delay) ──────────────────────────────────
function NextButton({ onNext }: { onNext: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 6500);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      onClick={onNext}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="absolute bottom-[6dvh] left-1/2 -translate-x-1/2 z-20 px-10 py-3 rounded-full font-sans font-semibold tracking-wider text-sm"
      style={{
        background: 'linear-gradient(135deg, #1a3a8a, #3060c8)',
        color: '#fff',
        boxShadow: '0 4px 28px rgba(80,140,255,0.5), 0 1px 6px rgba(0,0,0,0.4)',
        border: '1.5px solid rgba(255,255,255,0.2)',
      }}
    >
      One last surprise →
    </motion.button>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function PageTwo({ onNext, isActive: _isActive }: Props) {
  const [phase, setPhase] = useState<'idle' | 'galaxy'>('idle');
  const [showName, setShowName] = useState(false);
  const meteorCanvasRef = useMeteorCanvas(phase === 'galaxy');

  const handleReveal = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('galaxy');
  }, [phase]);

  useEffect(() => {
    if (phase !== 'galaxy') return;
    const t1 = setTimeout(() => setShowName(true), 3800);
    return () => clearTimeout(t1);
  }, [phase]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black">

      {/* ── IDLE: Black-hole image ── */}
      <AnimatePresence>
        {phase === 'idle' && (
          <motion.div
            key="idle"
            className="absolute inset-0 cursor-pointer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            onClick={handleReveal}
          >
            {/* Full-bleed high-res image */}
            <img
              src={`${import.meta.env.BASE_URL}black-hole.png`}
              alt="tap to reveal"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ imageRendering: 'high-quality' }}
              draggable={false}
            />

            {/* Subtle dark vignette so the hint text reads cleanly */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)',
              }}
            />

            {/* Tap hint — centred just below the glowing orb */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <motion.div
                className="flex flex-col items-center gap-3"
                style={{ marginTop: '38%' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Expanding pulse ring */}
                <div className="relative flex items-center justify-center w-14 h-14">
                  <motion.div
                    className="absolute rounded-full border border-white/50"
                    style={{ width: 56, height: 56 }}
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute rounded-full border border-white/30"
                    style={{ width: 56, height: 56 }}
                    animate={{ scale: [1, 1.9], opacity: [0.4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                  />
                  <span style={{ fontSize: '1.6rem' }}>✦</span>
                </div>
                <span
                  className="font-sans uppercase tracking-[0.28em] text-white/75"
                  style={{ fontSize: '0.7rem', textShadow: '0 0 12px rgba(255,255,255,0.6)' }}
                >
                  tap to reveal
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GALAXY: Milky-way + meteors + name ── */}
      <AnimatePresence>
        {phase === 'galaxy' && (
          <motion.div
            key="galaxy"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          >
            <img
              src={`${import.meta.env.BASE_URL}milky-way.png`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.85)' }}
              draggable={false}
            />
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,20,0.35)' }} />

            {/* Shooting stars */}
            <canvas
              ref={meteorCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 5 }}
            />

            {/* Name reveal */}
            <AnimatePresence>
              {showName && (
                <motion.div
                  key="name"
                  className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                >
                  <div className="text-center px-6">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                      className="font-sans uppercase tracking-[0.3em] text-white/70 text-xs mb-3"
                    >
                      somewhere in this universe
                    </motion.p>
                    <h1
                      className="font-serif italic font-bold text-white"
                      style={{
                        fontSize: 'clamp(3.2rem, 14vw, 5.5rem)',
                        lineHeight: 1,
                        textShadow:
                          '0 0 40px rgba(160,200,255,0.9), 0 0 80px rgba(120,160,255,0.6), 0 2px 8px rgba(0,0,0,0.6)',
                      }}
                    >
                      Nethra
                    </h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.65 }}
                      transition={{ duration: 1.2, delay: 0.9 }}
                      className="font-serif italic text-white/65 mt-3"
                      style={{ fontSize: '1.05rem' }}
                    >
                      is a shooting star ✨
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <NextButton onNext={onNext} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
